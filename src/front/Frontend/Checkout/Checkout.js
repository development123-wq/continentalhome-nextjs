import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';
import b1 from '../../../assets/images/banner/category-banner-back.jpg';
import progress from '../../../assets/loader.gif';

// 20 countries
const COUNTRY_OPTIONS = [
  'United States',
  'India',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Brazil',
  'Mexico',
  'Japan',
  'China',
  'Singapore',
  'United Arab Emirates',
  'Netherlands',
  'Switzerland',
  'South Africa',
  'New Zealand',
  'Saudi Arabia',
];

// 20 states (US focus, including New Hampshire)
const STATE_OPTIONS = [
  'New Hampshire',
  'California',
  'Texas',
  'New York',
  'Florida',
  'Illinois',
  'Pennsylvania',
  'Ohio',
  'Georgia',
  'North Carolina',
  'Michigan',
  'New Jersey',
  'Virginia',
  'Washington',
  'Arizona',
  'Massachusetts',
  'Tennessee',
  'Indiana',
  'Missouri',
  'Maryland',
];

const Checkout = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const [billing, setBilling] = useState({ name: '', email: '', phone: '' });

  const [shipping, setShipping] = useState({
    address: '',
    zip: '',
    city: '',
    state: 'New Hampshire',
    country: 'United States',
  });

  const [billingAddress, setBillingAddress] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    state: 'New Hampshire',
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  // Payment state
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // session derived
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [storeCredit] = useState(0);
  const [giftAmount] = useState(0);
  const [giftCode] = useState('GIFT123');
  const [giftExpiry] = useState('2025-12-31');

  const [paymentMethod] = useState('Credit Card');
  const [orderNotes] = useState('Deliver ASAP');
  const [customerMsg] = useState('Please leave at the front door.');
  const [feeDetails] = useState('5% processing fee');

  const [cartItems, setCartItems] = useState([]);

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // errors for required fields
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (storedUser?.email) {
      setBilling({
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
      });

      setBillingAddress((p) => ({
        ...p,
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        name: storedUser.name || '',
      }));
    }

    const savedCoupon = sessionStorage.getItem('appliedCoupon') || '';
    const savedPercent = parseFloat(sessionStorage.getItem('discountPercent')) || 0;
    const savedAmount = parseFloat(sessionStorage.getItem('discountAmount')) || 0;
    const savedShip = parseFloat(sessionStorage.getItem('shippingCost')) || 0;

    setCouponCode(savedCoupon);
    setDiscountPercent(savedPercent);
    setDiscountAmount(savedAmount);
    setShippingCost(savedShip);
  }, []);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress((prev) => ({
        ...prev,
        name: billing.name || '',
        email: billing.email || '',
        phone: billing.phone || '',
        address: shipping.address || '',
        city: shipping.city || '',
        state: shipping.state || 'New Hampshire',
      }));
    }
  }, [sameAsShipping, shipping, billing]); // controlled sync pattern [web:2][web:7]

  const calc = (price, qty) => Number(price) * Number(qty || 1);
  const subtotal = cartItems.reduce((a, i) => a + calc(i.price, i.quantity), 0);
  const tax = 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount - storeCredit - giftAmount + tax);

  const productDetails = cartItems
    .map(
      (p) =>
        `Product ID: ${p.id}, Product Qty: ${p.quantity}, Product SKU: ${p.sku || ''}, Product Name: ${
          p.name
        }, Product Weight: ${p.weight || 0}, Product Variation Details: , Product Unit Price: ${
          p.price
        }, Product Total Price: ${calc(p.price, p.quantity).toFixed(2)}`
    )
    .join('|');

  const onlyDigits = (s) => (s || '').replace(/\D+/g, '');

  const luhnValid = (num) => {
    const s = onlyDigits(num);
    if (s.length < 13 || s.length > 19) return false;
    let sum = 0;
    let dbl = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let d = parseInt(s[i], 10);
      if (Number.isNaN(d)) return false;
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const expiryValid = (val) => {
    const m = /^(\d{2})\/(\d{2})$/.exec((val || '').trim());
    if (!m) return false;
    const mm = parseInt(m[1], 10);
    const yy = parseInt(m[2], 10);
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    const expDate = new Date(year, mm, 0, 23, 59, 59, 999);
    const now = new Date();
    return expDate >= now;
  };

  const cvvValid = (v) => /^\d{3,4}$/.test(onlyDigits(v));

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  const phoneOk = (v) => String(v || '').trim().length >= 7;

  const validate = (section, fields) => {
    const newErr = {};
    const pick = section === 'billing' ? billing : section === 'shipping' ? shipping : billingAddress;

    fields.forEach((f) => {
      const key = `${section}.${f}`;
      const val = String(pick[f] ?? '').trim();
      if (!val) newErr[key] = 'Required';
      if (f === 'email' && val && !emailOk(val)) newErr[key] = 'Enter a valid email';
      if (f === 'phone' && val && !phoneOk(val)) newErr[key] = 'Enter a valid phone';
    });

    return newErr;
  };

  const validatePayment = () => {
    const newErr = {};
    const { cardNumber, expiry, cvv } = payment;

    if (!cardNumber) newErr['payment.cardNumber'] = 'Required';
    else if (!luhnValid(cardNumber)) newErr['payment.cardNumber'] = 'Enter a valid card number';

    if (!expiry) newErr['payment.expiry'] = 'Required';
    else if (!expiryValid(expiry)) newErr['payment.expiry'] = 'Enter a valid expiry (MM/YY)';

    if (!cvv) newErr['payment.cvv'] = 'Required';
    else if (!cvvValid(cvv)) newErr['payment.cvv'] = 'Enter a valid CVV (3-4 digits)';

    setErrors((prev) => ({ ...prev, ...newErr }));
    return Object.keys(newErr).length === 0;
  };

  const validateStep = (stepNum) => {
    let stepErr = {};
    if (stepNum === 1) {
      stepErr = validate('billing', ['name', 'email', 'phone']);
    } else if (stepNum === 2) {
      stepErr = validate('shipping', ['address', 'zip', 'city', 'state', 'country']);
    } else if (stepNum === 3) {
      if (sameAsShipping) return true;
      stepErr = validate('billingAddress', ['name', 'address', 'phone', 'email', 'city', 'state']);
    } else if (stepNum === 4) {
      return validatePayment();
    }
    setErrors((prev) => ({ ...prev, ...stepErr }));
    return Object.keys(stepErr).length === 0;
  };

  const tryGoNext = () => {
    if (validateStep(activeStep)) setActiveStep((n) => n + 1);
  };

  const fieldError = (section, f) => errors[`${section}.${f}`];

  const makePayload = () => {
    const [first, ...lastArr] = (billing.name || '').trim().split(' ');
    const last = lastArr.join(' ');

    const sanitizedCard = (payment.cardNumber || '').replace(/\D/g, '');
    const sanitizedCvv = (payment.cvv || '').replace(/\D/g, '');
    const sanitizedExp = (payment.expiry || '').trim();

    return {
      customer_name: billing.name,
      customer_email: billing.email,
      customer_phone: billing.phone,
      order_status: 'pending',
      subtotal: Number(subtotal.toFixed(2)),
      shipping_cost: Number(shippingCost.toFixed(2)),
      ship_method: 'FedEx',
      store_credit_redeemed: storeCredit,
      gift_certificate_amount_redeemed: giftAmount,
      gift_certificate_code: giftCode,
      gift_certificate_expiration_date: giftExpiry,

      coupon_details: couponCode || null,
      coupon_cast: couponCode ? Number(Number(discountAmount).toFixed(2)) : 0,

      payment_method: paymentMethod,
      total_quantity: cartItems.reduce((a, i) => a + i.quantity, 0),
      total_shipped: 0,
      date_shipped: null,
      order_currency_code: 'USD',
      exchange_rate: 1.0,
      order_notes: orderNotes,
      customer_message: customerMsg,
      billing: {
        first_name: first || '',
        last_name: last || '',
        company: '',
        street_1: billingAddress.address,
        street_2: '',
        suburb: billingAddress.city,
        state: billingAddress.state,
        zip: shipping.zip,
        country: shipping.country,
        phone: billingAddress.phone,
        email: billingAddress.email,
      },
      shipping: {
        first_name: first || '',
        last_name: last || '',
        company: '',
        street_1: shipping.address,
        street_2: '',
        suburb: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country,
        phone: billing.phone,
        email: billing.email,
      },
      product_details: productDetails,
      refund_amount: 0,
      channel_id: 1,
      channel_name: 'Web',
      fee_details: feeDetails,
      grand_total: Number(total.toFixed(2)),

      card_number: sanitizedCard,
      card_cvv: sanitizedCvv,
      card_expiry: sanitizedExp,
    };
  };

  const placeOrder = async () => {
    const ok1 = validateStep(1);
    const ok2 = validateStep(2);
    const ok3 = validateStep(3);
    const ok4 = validateStep(4);

    if (!ok1 || !ok2 || !ok3 || !ok4) {
      alert('Please fill all required fields.');
      if (!ok1) setActiveStep(1);
      else if (!ok2) setActiveStep(2);
      else if (!ok3) setActiveStep(3);
      else setActiveStep(4);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowLoginPopup(true);
      return;
    } else {
      setShowModal(true);
    }

    try {
      await axios.post('http://187.124.157.146:5001/api/orders/create', makePayload(), {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setShowModal(false);
      alert('Your order has been created 🎉');

      sessionStorage.removeItem('cart');
      setCartItems([]);
      sessionStorage.removeItem('authToken');

      navigate('/add-to-cart');
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Access denied') || err.response?.status === 401) {
        sessionStorage.removeItem('authToken');
        setShowLoginPopup(true);
      } else {
        console.error('Order error', msg);
        alert('Failed to create order. Please try again.');
      }
      setShowModal(false);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://187.124.157.146:5001/api/customers/logincustomer', {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data?.token) {
        sessionStorage.setItem('authToken', res.data.token);
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            name: (res.data.customer.first_name || '') + ' ' + (res.data.customer.last_name || ''),
            email: res.data.customer.email,
            phone: '',
          })
        );
        setShowLoginPopup(false);
        alert('Login successful!');
        placeOrder();
      } else {
        alert(res.data?.message || 'Login failed');
      }
    } catch (err) {
      alert('Login error: ' + (err.response?.data?.message || err.message));
    }
  };

  const onChange = (set, section) => (e) => {
    const { name, value } = e.target;
    set((p) => ({ ...p, [name]: value }));

    const key = `${section}.${name}`;
    if (errors[key]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  const steps = ['Billing Details', 'Shipping Details', 'Billing Address', 'Payment Method'];

  const renderStepButton = (i, txt) => {
    const active = i === activeStep;
    const tryJump = () => {
      if (i > activeStep && !validateStep(activeStep)) return;
      setActiveStep(i);
    };

    return (
      <div
        key={i}
        onClick={tryJump}
        style={{
          cursor: 'pointer',
          padding: 10,
          marginBottom: 10,
          borderRadius: 4,
          background: active ? '#63a682' : '#f0f0f0',
          color: active ? '#fff' : '#333',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: active ? '#fff' : '#63a682',
            color: active ? '#63a682' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          {i}
        </div>
        {txt}
      </div>
    );
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: 8,
    margin: '8px 0 6px',
    border: `1px solid ${hasError ? '#ff4d4f' : '#ccc'}`,
    borderRadius: 4,
    outline: 'none',
  });

  const ErrorMsg = ({ msg }) =>
    msg ? <div style={{ color: '#ff4d4f', fontSize: 12, marginBottom: 10 }}>{msg}</div> : null;

  const L = (obj, set, section) => (f, type = 'text') => {
    const err = fieldError(section, f);
    return (
      <label key={f} style={{ width: '100%', display: 'block' }}>
        {f.charAt(0).toUpperCase() + f.slice(1)}:
        <br />
        <input
          required
          type={type}
          name={f}
          value={obj[f] || ''}
          onChange={onChange(set, section)}
          style={inputStyle(Boolean(err))}
          aria-invalid={Boolean(err)}
          disabled={section === 'billingAddress' && sameAsShipping}
        />
        <ErrorMsg msg={err} />
      </label>
    );
  };

  const LPayment = (f, label, opts = {}) => {
    const err = errors[`payment.${f}`];

    const handleChange = (e) => {
      let v = e.target.value;

      if (f === 'cardNumber') {
        v = v.replace(/\D/g, '').slice(0, 19);
      } else if (f === 'expiry') {
        v = v.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      } else if (f === 'cvv') {
        v = v.replace(/\D/g, '').slice(0, 4);
      }

      setPayment((p) => ({ ...p, [f]: v }));

      const key = `payment.${f}`;
      if (errors[key]) {
        setErrors((prev) => {
          const n = { ...prev };
          delete n[key];
          return n;
        });
      }
    };

    return (
      <label key={f} style={{ width: '100%', display: 'block' }}>
        {label}:
        <br />
        <input
          type={opts.type || 'text'}
          inputMode={opts.inputMode || 'text'}
          value={payment[f] || ''}
          onChange={handleChange}
          style={inputStyle(Boolean(err))}
          aria-invalid={Boolean(err)}
          placeholder={opts.placeholder || ''}
          required
        />
        <ErrorMsg msg={err} />
      </label>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <>
            <h2>Billing Details</h2>
            {['name'].map(L(billing, setBilling, 'billing'))}
            {['email'].map((f) => L(billing, setBilling, 'billing')(f, 'email'))}
            {['phone'].map(L(billing, setBilling, 'billing'))}
          </>
        );

      case 2:
        return (
          <>
            <h2>Shipping Details</h2>

            {['address', 'zip', 'city'].map(L(shipping, setShipping, 'shipping'))}

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '12px 0 18px',
              }}
            >
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              Billing address is the same as shipping address
            </label>

            <label style={{ width: '100%', display: 'block' }}>
              State:
              <br />
              <select
                name="state"
                value={shipping.state}
                onChange={onChange(setShipping, 'shipping')}
                style={inputStyle(Boolean(fieldError('shipping', 'state')))}
                required
              >
                <option value="">Select State</option>
                {STATE_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ErrorMsg msg={fieldError('shipping', 'state')} />
            </label>

            <label style={{ width: '100%', display: 'block' }}>
              Country:
              <br />
              <select
                name="country"
                value={shipping.country}
                onChange={onChange(setShipping, 'shipping')}
                style={inputStyle(Boolean(fieldError('shipping', 'country')))}
                required
              >
                <option value="">Select Country</option>
                {COUNTRY_OPTIONS.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              <ErrorMsg msg={fieldError('shipping', 'country')} />
            </label>
          </>
        );

      case 3:
        return (
          <>
            <h2>Billing Address</h2>

            {sameAsShipping && (
              <p style={{ color: '#63a682', marginBottom: 15 }}>
                Billing address has been copied from shipping details.
              </p>
            )}

            {['name', 'address'].map(L(billingAddress, setBillingAddress, 'billingAddress'))}
            {['email'].map((f) => L(billingAddress, setBillingAddress, 'billingAddress')(f, 'email'))}
            {['phone', 'city'].map(L(billingAddress, setBillingAddress, 'billingAddress'))}

            <label style={{ width: '100%', display: 'block' }}>
              State:
              <br />
              <select
                name="state"
                value={billingAddress.state}
                onChange={onChange(setBillingAddress, 'billingAddress')}
                style={inputStyle(Boolean(fieldError('billingAddress', 'state')))}
                required
                disabled={sameAsShipping}
              >
                <option value="">Select State</option>
                {STATE_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ErrorMsg msg={fieldError('billingAddress', 'state')} />
            </label>
          </>
        );

      case 4:
        return (
          <>
            <h2>Payment Details</h2>
            <p>
              Payment Method: <strong>{paymentMethod}</strong>
            </p>

            {LPayment('cardNumber', 'Credit Card Number', {
              inputMode: 'numeric',
              placeholder: '1234567890123456',
            })}
            {LPayment('expiry', 'Expiry (MM/YY)', {
              inputMode: 'numeric',
              placeholder: 'MM/YY',
            })}
            {LPayment('cvv', 'CVV', {
              type: 'password',
              inputMode: 'numeric',
              placeholder: '3-4 digits',
            })}

            <button
              onClick={placeOrder}
              style={{
                background: '#63a682',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 5,
                marginTop: 15,
              }}
            >
              Place Order
            </button>
          </>
        );

      default:
        return null;
    }
  };

  const Btn = ({ grey, onClick, txt }) => (
    <button
      onClick={onClick}
      style={{
        background: grey ? '#888' : '#63a682',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: 5,
      }}
    >
      {txt}
    </button>
  );

  return (
    <div className="main-add-to-cart">
      <Navbar />
      <InnerBanner title="Checkout" backgroundImage={b1} />

      <div style={{ display: 'flex', maxWidth: 1200, margin: '30px auto', gap: 20 }}>
        <div style={{ width: 240, padding: 20, borderRight: '1px solid #ddd' }}>
          {steps.map((s, idx) => renderStepButton(idx + 1, s))}
        </div>

        <div
          style={{
            flex: 1,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            background: '#fafafa',
          }}
        >
          {renderStepContent()}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            {activeStep > 1 && (
              <Btn grey onClick={() => setActiveStep((n) => Math.max(1, n - 1))} txt="Previous" />
            )}
            {activeStep < 4 && <Btn onClick={tryGoNext} txt="Next" />}
          </div>
        </div>

        <div>
          {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: '#e5eff1',
                  padding: '30px 50px',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                <img src={progress} alt="loading" style={{ width: '100px' }} />
                <br />
                Please wait a moment...
                <br /> We are creating your order.
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            background: '#fff',
            height: 'fit-content',
          }}
        >
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    marginBottom: 15,
                    padding: 10,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                  }}
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 4,
                      marginRight: 10,
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{it.name}</p>
                    <p style={{ margin: 0 }}>Qty: {it.quantity}</p>
                    <p style={{ margin: 0 }}>Price: ${Number(it.price).toFixed(2)}</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      Subtotal: ${calc(it.price, it.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <hr />
              <p>
                <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Shipping:</strong> ${shippingCost.toFixed(2)}
              </p>
              {/* {couponCode ? (
                <p>
                  <strong>
                    Discount ({discountPercent}% – {couponCode}):
                  </strong>{' '}
                  -${discountAmount.toFixed(2)}
                </p>
              ) : (
                <p>
                  <strong>Discount:</strong> -$0.00
                </p>
              )} */}
              <h4>
                <strong style={{color:'#63a682'}}>Total Amount:  ${total.toFixed(2)}</strong>
              </h4>
            </>
          )}
        </div>
      </div>

      {showLoginPopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: '#fff', padding: 30, borderRadius: 8, width: 320 }}>
            <h3 style={{ marginTop: 0 }}>Login to continue</h3>
            <input
              required
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{ width: '100%', padding: 10, marginBottom: 10 }}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: '100%', padding: 10, marginBottom: 20 }}
            />
            <button
              onClick={handleLogin}
              style={{
                background: '#63a682',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 5,
                width: '100%',
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;