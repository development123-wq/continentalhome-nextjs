"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import b1 from "../../public/assets/images/banner/category-banner-back.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";

const Addtocart = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountType, setDiscountType] = useState(""); // 'percentage' | 'fixed' | ''
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ---------- Load initial state from sessionStorage ----------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      const savedCoupon = sessionStorage.getItem("appliedCoupon") || "";
      const savedType = sessionStorage.getItem("discountType") || "";
      const savedPercent = parseFloat(sessionStorage.getItem("discountPercent") || "0");
      const savedAmount = parseFloat(sessionStorage.getItem("discountAmount") || "0");

      setCartItems(Array.isArray(storedCart) ? storedCart : []);
      setCoupon(savedCoupon);
      setDiscountType(savedType);
      setDiscountPercent(Number.isFinite(savedPercent) ? savedPercent : 0);
      setDiscountAmount(Number.isFinite(savedAmount) ? savedAmount : 0);
      setHasApplied(!!savedCoupon);
    } catch (error) {
      console.error("Error loading cart data from sessionStorage:", error);
      setCartItems([]);
      setCoupon("");
      setDiscountType("");
      setDiscountPercent(0);
      setDiscountAmount(0);
      setHasApplied(false);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ---------- Fetch shipping cost per category ----------
  useEffect(() => {
    if (!isLoaded || !cartItems || cartItems.length === 0) {
      setShippingCost(0);
      return;
    }

    const fetchShipping = async () => {
      const categoryIds = [
        ...new Set(
          cartItems
            .map((item) => Number(item.categoryId))
            .filter((id) => Number.isFinite(id) && id > 0)
        ),
      ];

      if (categoryIds.length === 0) {
        setShippingCost(0);
        return;
      }

      let totalShipping = 0;

      for (const id of categoryIds) {
        try {
          const res = await axios.get(
            `http://187.124.157.146:5001/api/categories/${id}`
          );
          const shipping = parseFloat(res?.data?.category?.shipping_cost || 0);
          totalShipping += Number.isFinite(shipping) ? shipping : 0;
        } catch (err) {
          console.error(
            `Error fetching shipping cost for category ID ${id}:`,
            err?.response?.status || err.message
          );
        }
      }

      setShippingCost(totalShipping);
    };

    fetchShipping();
  }, [cartItems, isLoaded]);

  // ---------- Store cart + cart count ----------
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    sessionStorage.setItem("cart", JSON.stringify(cartItems));

    const totalItemCount = cartItems.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );
    sessionStorage.setItem("cartItemCount", totalItemCount.toString());
  }, [cartItems, isLoaded]);

  // ---------- Calculations ----------
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  // Discount subtotal par apply hoga
  const baseForDiscount = subtotal;

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal + shippingCost - discountAmount);
  }, [subtotal, shippingCost, discountAmount]);

  // ---------- Helpers ----------
  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: Math.max(1, Number(updated[index].quantity || 1) + delta),
      };
      return updated;
    });
  };

  const handleDeleteItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCouponStorage = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("appliedCoupon");
    sessionStorage.removeItem("discountType");
    sessionStorage.removeItem("discountPercent");
    sessionStorage.removeItem("discountAmount");
  };

  const handleRemoveCoupon = (showAlert = true) => {
    setCoupon("");
    setDiscountType("");
    setDiscountPercent(0);
    setDiscountAmount(0);
    setHasApplied(false);
    clearCouponStorage();

    if (showAlert) {
      alert("Coupon removed.");
    }
  };

  // ---------- Recalculate/remove coupon when subtotal changes ----------
  useEffect(() => {
    if (!isLoaded) return;
    if (!coupon || !discountType) return;

    if (baseForDiscount <= 0) {
      handleRemoveCoupon(false);
      return;
    }

    const savedPercent = Number(discountPercent || 0);
    let recalculated = 0;

    if (discountType === "percentage") {
      recalculated = (baseForDiscount * savedPercent) / 100;
    } else if (discountType === "fixed") {
      recalculated = Math.min(discountAmount, baseForDiscount);
    }

    recalculated = Number(recalculated.toFixed(2));
    setDiscountAmount(recalculated);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("discountAmount", recalculated.toFixed(2));
    }
  }, [subtotal, discountType, discountPercent, coupon, isLoaded]);

  // ---------- Apply coupon ----------
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      alert("Please enter coupon code.");
      return;
    }

    try {
      const res = await axios.get(
        `http://187.124.157.146:5001/api/coupons?page=1&limit=10&search=${encodeURIComponent(
          coupon.trim()
        )}`
      );

      const coupons = res?.data?.coupons || [];

      const match = coupons.find(
        (c) =>
          String(c.code || "").toLowerCase() === coupon.trim().toLowerCase() &&
          Number(c.is_active) === 1 &&
          new Date(c.expiry_date) > new Date()
      );

      if (!match) {
        alert("Invalid or expired coupon.");
        handleRemoveCoupon(false);
        return;
      }

      const type = String(match.discount_type || "").toLowerCase(); // fixed | percentage
      const value = parseFloat(match.discount_value) || 0;
      const maxCap = parseFloat(match.max_discount);

      let computed = 0;
      let appliedPercent = 0;

      if (type === "percentage") {
        computed = (baseForDiscount * value) / 100;

        if (Number.isFinite(maxCap) && maxCap > 0) {
          computed = Math.min(computed, maxCap);
        }

        appliedPercent = value;
        setDiscountType("percentage");
        setDiscountPercent(value);
      } else if (type === "fixed") {
        computed = Math.min(value, baseForDiscount);
        appliedPercent = 0;
        setDiscountType("fixed");
        setDiscountPercent(0);
      } else {
        alert("Unsupported coupon type.");
        handleRemoveCoupon(false);
        return;
      }

      computed = Number(computed.toFixed(2));
      setDiscountAmount(computed);
      setCoupon(match.code);
      setHasApplied(true);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("appliedCoupon", match.code);
        sessionStorage.setItem("discountType", type);
        sessionStorage.setItem("discountPercent", String(appliedPercent));
        sessionStorage.setItem("discountAmount", computed.toFixed(2));
      }

      alert(
        type === "percentage"
          ? `Coupon applied: ${value}% off`
          : `Coupon applied: $${value.toFixed(2)} off`
      );
    } catch (err) {
      console.error("Error applying coupon:", err);
      alert("Error applying coupon.");
      handleRemoveCoupon(false);
    }
  };

  // ---------- Proceed to checkout ----------
  const checkout = () => {
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("cart", JSON.stringify(cartItems));
      sessionStorage.setItem("subtotal", subtotal.toFixed(2));
      sessionStorage.setItem("shippingCost", shippingCost.toFixed(2));
      sessionStorage.setItem("discountType", discountType);
      sessionStorage.setItem("discountPercent", discountPercent.toString());
      sessionStorage.setItem("discountAmount", discountAmount.toFixed(2));
      sessionStorage.setItem("orderTotal", finalTotal.toFixed(2));
      sessionStorage.setItem("appliedCoupon", coupon);
    }

    router.push("/checkout");
  };

  const btnStyle = {
    padding: "5px 10px",
    backgroundColor: "#63a682",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  if (!isLoaded) {
    return (
      <div className="main-add-to-cart">
        <Navbar />
        <InnerBanner title="Your Cart" backgroundImage={b1} />
        <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
          <h3>Loading cart...</h3>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="main-add-to-cart">
      <Navbar />
      <InnerBanner title="Your Cart" backgroundImage={b1} />

      <div className="container" style={{ padding: "40px 20px" }}>
        {cartItems.length > 0 ? (
          <div style={{ display: "block", gap: "30px" }}>
            <div
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                padding: "20px",
                marginBottom: "20px",
                overflowX: "auto",
              }}
            >
              <table
                border="1"
                cellPadding="12"
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#63a682", color: "#fff" }}>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#f1f1f1",
                      }}
                    >
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          width="100"
                          height="100"
                          style={{ borderRadius: "8px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>${Number(item.price || 0).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => updateQuantity(i, -1)}
                          style={btnStyle}
                        >
                          -
                        </button>
                        <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(i, 1)}
                          style={btnStyle}
                        >
                          +
                        </button>
                      </td>
                      <td>${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteItem(i)}
                          style={{
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "400px",
                maxWidth: "100%",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                marginLeft: "auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  borderBottom: "2px solid #63a682",
                  paddingBottom: "10px",
                  color: "#63a682",
                }}
              >
                Cart Summary
              </h3>

              <table style={{ width: "100%", fontSize: "16px" }}>
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td style={{ textAlign: "right" }}>${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td style={{ textAlign: "right" }}>${shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>
                      Discount{" "}
                      {coupon
                        ? discountType === "percentage"
                          ? `(${discountPercent}% - ${coupon})`
                          : `(Fixed - ${coupon})`
                        : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      -${discountAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <strong>${finalTotal.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Coupon Code"
                  disabled={hasApplied}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                />

                {!hasApplied ? (
                  <button
                    onClick={handleApplyCoupon}
                    style={{ ...btnStyle, width: "100%", fontWeight: "bold" }}
                  >
                    Apply Coupon
                  </button>
                ) : (
                  <button
                    onClick={() => handleRemoveCoupon(true)}
                    style={{
                      ...btnStyle,
                      width: "100%",
                      backgroundColor: "#ff4d4f",
                      fontWeight: "bold",
                    }}
                  >
                    Remove Coupon
                  </button>
                )}
              </div>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  onClick={checkout}
                  style={{
                    ...btnStyle,
                    padding: "12px",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
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