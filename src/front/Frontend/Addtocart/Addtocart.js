import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';
import b1 from '../../../assets/images/banner/category-banner-back.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Addtocart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discountType, setDiscountType] = useState('');         // 'percentage' | 'fixed' | ''
  const [discountPercent, setDiscountPercent] = useState(0);    // only for percentage label
  const [discountAmount, setDiscountAmount] = useState(0);      // ALWAYS the amount applied
  const [shippingCost, setShippingCost] = useState(0);
  const navigate = useNavigate();

  // ---------- Load initial state ----------
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const savedCoupon = sessionStorage.getItem('appliedCoupon') || '';
    const savedType = sessionStorage.getItem('discountType') || '';
    const savedPercent = parseFloat(sessionStorage.getItem('discountPercent'));
    const savedAmount  = parseFloat(sessionStorage.getItem('discountAmount'));

    if (savedCoupon) setCoupon(savedCoupon);
    if (savedType) setDiscountType(savedType);
    setDiscountPercent(Number.isFinite(savedPercent) ? savedPercent : 0);
    setDiscountAmount(Number.isFinite(savedAmount) ? savedAmount : 0);
  }, []);

  // ---------- Fetch shipping cost per category ----------
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;

    const fetchShipping = async () => {
      const categoryIds = [
        ...new Set(
          cartItems.map(item => item.categoryId).filter(id => id && !isNaN(id))
        ),
      ];

      let totalShipping = 0;
      for (const id of categoryIds) {
        try {
          const res = await axios.get(`http://187.124.157.146:5001/api/categories/${id}`);
          const shipping = parseFloat(res.data?.category?.shipping_cost || 0);
          totalShipping += isNaN(shipping) ? 0 : shipping;
        } catch (err) {
          console.error(`Error fetching shipping cost for category ID ${id}:`, err?.response?.status);
        }
      }
      setShippingCost(totalShipping);
    };

    fetchShipping();
  }, [cartItems]);

  // ---------- Store cart count ----------
  useEffect(() => {
    const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    sessionStorage.setItem('cartItemCount', totalItemCount);
  }, [cartItems]);

  // ---------- Helpers ----------
  const updateQuantity = (index, delta) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    setCartItems(updated);
    sessionStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleDeleteItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    sessionStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // NOTE: industry standard – discount applies on subtotal (not shipping)
  const baseForDiscount = subtotal;
  // Agar tum discount ko shipping + subtotal par apply karna chahte ho to:
  // const baseForDiscount = subtotal + shippingCost;

  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  // ---------- Apply/Remove coupon ----------
  const handleApplyCoupon = async () => {
    if (!coupon) return;

    try {
      const res = await axios.get(`http://187.124.157.146:5001/api/coupons?page=1&limit=10&search=${encodeURIComponent(coupon)}`);
      const coupons = res?.data?.coupons || [];

      const match = coupons.find(c =>
        String(c.code || '').toLowerCase() === coupon.toLowerCase() &&
        Number(c.is_active) === 1 &&
        new Date(c.expiry_date) > new Date()
      );

      if (!match) {
        alert('Invalid or expired coupon.');
        handleRemoveCoupon();
        return;
      }

      const type = String(match.discount_type || '').toLowerCase(); // 'fixed' or 'percentage'
      const value = parseFloat(match.discount_value) || 0;
      const maxCap = parseFloat(match.max_discount); // optional, if API provides

      let computed = 0;

      if (type === 'percentage') {
        computed = (baseForDiscount * value) / 100;
        if (Number.isFinite(maxCap) && maxCap > 0) {
          computed = Math.min(computed, maxCap);
        }
        setDiscountPercent(value);
        setDiscountType('percentage');
      } else if (type === 'fixed') {
        // discount cannot exceed base
        computed = Math.min(value, baseForDiscount);
        setDiscountPercent(0);
        setDiscountType('fixed');
      } else {
        alert('Unsupported coupon type.');
        handleRemoveCoupon();
        return;
      }

      // round to 2 decimals
      computed = Number(computed.toFixed(2));

      setDiscountAmount(computed);

      // persist to session for Checkout/Invoice
      sessionStorage.setItem('appliedCoupon', match.code);
      sessionStorage.setItem('discountType', type);
      sessionStorage.setItem('discountPercent', type === 'percentage' ? String(value) : '0');
      sessionStorage.setItem('discountAmount', computed.toFixed(2));

      alert(
        type === 'percentage'
          ? `Coupon applied: ${value}% off`
          : `Coupon applied: $${value.toFixed(2)} off`
      );
    } catch (err) {
      console.error(err);
      alert('Error applying coupon.');
      handleRemoveCoupon();
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon('');
    setDiscountType('');
    setDiscountPercent(0);
    setDiscountAmount(0);

    sessionStorage.removeItem('appliedCoupon');
    sessionStorage.removeItem('discountType');
    sessionStorage.removeItem('discountPercent');
    sessionStorage.removeItem('discountAmount');

    alert('Coupon removed.');
  };

  // ---------- Proceed to checkout ----------
  const checkout = () => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
    sessionStorage.setItem('subtotal', subtotal.toFixed(2));
    sessionStorage.setItem('shippingCost', shippingCost.toFixed(2));
    sessionStorage.setItem('discountType', discountType);
    sessionStorage.setItem('discountPercent', discountPercent.toString());
    sessionStorage.setItem('discountAmount', discountAmount.toFixed(2));
    sessionStorage.setItem('orderTotal', finalTotal.toFixed(2));
    sessionStorage.setItem('appliedCoupon', coupon);
    navigate('/checkout');
    window.location.reload();
  };

  const btnStyle = {
    padding: '5px 10px',
    backgroundColor: '#63a682',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const hasApplied = !!sessionStorage.getItem('appliedCoupon');

  return (
    <div className="main-add-to-cart">
      <Navbar />
      <InnerBanner title="Your Cart" backgroundImage={b1} />
      <div className="container" style={{ padding: '40px 20px' }}>
        {cartItems.length > 0 ? (
          <div style={{ display: 'block', gap: '30px' }}>
            {/* Cart Table */}
            <div style={{ width: '100%', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '20px' }}>
              <table border="1" cellPadding="12" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', fontSize: '16px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#63a682', color: '#fff' }}>
                    <th>Image</th><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#f1f1f1' }}>
                      <td><img src={item.image} alt={item.name} width="100" height="100" style={{ borderRadius: '8px' }} /></td>
                      <td>{item.name}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>
                        <button onClick={() => updateQuantity(i, -1)} style={btnStyle}>-</button>
                        <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(i, 1)} style={btnStyle}>+</button>
                      </td>
                      <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteItem(i)}
                          style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div style={{ width: '400px', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginLeft: 'auto' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #63a682', paddingBottom: '10px', color: '#63a682' }}>Cart Summary</h3>
              <table style={{ width: '100%', fontSize: '16px' }}>
                <tbody>
                  <tr><td>Subtotal</td><td style={{ textAlign: 'right' }}>${subtotal.toFixed(2)}</td></tr>
                  <tr><td>Shipping</td><td style={{ textAlign: 'right' }}>${shippingCost.toFixed(2)}</td></tr>
                  <tr>
                    <td>
                      Discount{' '}
                      {coupon ? (
                        discountType === 'percentage'
                          ? `(${discountPercent}% – ${coupon})`
                          : `(Fixed – ${coupon})`
                      ) : ''}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      -${discountAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>${finalTotal.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '20px' }}>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Coupon Code"
                  disabled={hasApplied}
                  style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }}
                />
                {!hasApplied ? (
                  <button onClick={handleApplyCoupon} style={{ ...btnStyle, width: '100%', fontWeight: 'bold' }}>
                    Apply Coupon
                  </button>
                ) : (
                  <button onClick={handleRemoveCoupon} style={{ ...btnStyle, width: '100%', backgroundColor: '#ff4d4f', fontWeight: 'bold' }}>
                    Remove Coupon
                  </button>
                )}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={checkout} style={{ ...btnStyle, padding: '12px', width: '100%', fontWeight: 'bold' }}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>Your cart is empty.</h3>
            <p>Please go back and add some products.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Addtocart;
