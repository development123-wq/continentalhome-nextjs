// src/components/common/DownloadModal.js
import React from 'react';
import html2pdf from 'html2pdf.js';
import logo from '../../public/assets/images/logo.png';

function DownloadModal({ show, onClose, order }) {
  if (!show || !order) return null;

  const {
    id,
    order_date,
    order_status,
    billing_first_name,
    billing_last_name,
    billing_company,
    billing_street_1,
    billing_street_2,
    billing_suburb,
    billing_state,
    billing_zip,
    billing_country,
    billing_phone,
    shipping_first_name,
    shipping_last_name,
    shipping_company,
    shipping_street_1,
    shipping_street_2,
    shipping_suburb,
    shipping_state,
    shipping_zip,
    shipping_country,
    shipping_phone,
    products,
    subtotal_inc_tax,
    tax_total,
    shipping_cost_inc_tax,
    order_total_inc_tax,
    // coupon-related fields are accessed via `order` below (not destructured)
  } = order;

  // ---------- Helpers & derived values ----------
  const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number.parseFloat(v) || 0);
  const money = (v) => `$${num(v).toFixed(2)}`;

  const subtotalInc = num(subtotal_inc_tax);                 // e.g. 75.00
  const shippingInc = num(shipping_cost_inc_tax);            // e.g. 0.00
  const taxTotal = num(tax_total);
  const totalIncTax = num(order_total_inc_tax);              // e.g. 55.00

  const couponCode = order.coupon_details || '-';            // e.g. "Summer29"
  const subAfterCoupon = order.sub_total_inc_coupon !== undefined
    ? num(order.sub_total_inc_coupon)                        // e.g. 55.00
    : Math.max(0, subtotalInc - num(order.coupon_discount_value));

  const couponValue = order.sub_total_inc_coupon !== undefined
    ? Math.max(0, subtotalInc - subAfterCoupon)              // 75 - 55 = 20
    : num(order.coupon_discount_value);                      // fallback if API sends value separately

  const handleDownload = () => {
    const element = document.getElementById('invoice-content');

    html2pdf().set({
      margin: 0.5,
      filename: `invoice_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }).from(element).save();
  };

  return (
    <div
      className="modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999999,
        overflowY: 'auto',
      }}
    >
      <div style={{ marginTop: '35%', marginBottom: '2%', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', width: '100%' }}>
        <div
          id="invoice-content"
          className="modal-content"
          style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '700px',
            width: '95%',
            height: 'auto',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <h2 style={{ textAlign: 'left', marginBottom: '50px', fontSize: '28px' }}>
            <img src={logo} alt="Logo" style={{ maxHeight: '50px' }} />
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p><strong>Order ID:</strong> #{id}</p>
              <p><strong>Date:</strong> {new Date(order_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order_status}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Due:</strong> —</p>
            </div>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '48%' }}>
              <h4 style={{ marginBottom: '6px', fontSize: '18px' }}>Bill To</h4>
              <p style={{ margin: 0 }}>{billing_first_name} {billing_last_name}</p>
              {billing_company && <p style={{ margin: 0 }}>{billing_company}</p>}
              <p style={{ margin: 0 }}>{billing_street_1}</p>
              {billing_street_2 && <p style={{ margin: 0 }}>{billing_street_2}</p>}
              <p style={{ margin: 0 }}>{billing_suburb}, {billing_state} {billing_zip}</p>
              <p style={{ margin: 0 }}>{billing_country}</p>
              <p style={{ margin: 0 }}>Phone: {billing_phone}</p>
            </div>

            <div style={{ width: '48%' }}>
              <h4 style={{ marginBottom: '6px', fontSize: '18px' }}>Ship To</h4>
              <p style={{ margin: 0 }}>{shipping_first_name} {shipping_last_name}</p>
              {shipping_company && <p style={{ margin: 0 }}>{shipping_company}</p>}
              <p style={{ margin: 0 }}>{shipping_street_1}</p>
              {shipping_street_2 && <p style={{ margin: 0 }}>{shipping_street_2}</p>}
              <p style={{ margin: 0 }}>{shipping_suburb}, {shipping_state} {shipping_zip}</p>
              <p style={{ margin: 0 }}>{shipping_country}</p>
              <p style={{ margin: 0 }}>Phone: {shipping_phone}</p>
            </div>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Ordered Products</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #444' }}>
                <th align="left" style={{ padding: '10px 0' }}>Product</th>
                <th align="center" style={{ padding: '10px 0' }}>Qty</th>
                <th align="right" style={{ padding: '10px 0' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '8px 0' }}>{product.product_name}</td>
                  <td align="center" style={{ padding: '8px 0' }}>{product.product_qty}</td>
                  <td align="right" style={{ padding: '8px 0' }}>{money(product.product_total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}></div>
            <div style={{ width: '45%', textAlign: 'right' }}>
              <h5 style={{ fontSize: '18px' }}>Summary</h5>
              <p><strong>Subtotal:</strong> {money(subtotalInc)}</p>

              {/* NEW: Coupon Details */}
              <p><strong>Coupon Code:</strong> {couponCode}</p>
              {couponValue > 0 && (
                <p><strong>Coupon Value (-):</strong> -{money(couponValue)}</p>
              )}
              {order.sub_total_inc_coupon !== undefined && (
                <p><strong>Subtotal After Coupon:</strong> {money(subAfterCoupon)}</p>
              )}

              <p><strong>Shipping:</strong> {money(shippingInc)}</p>
              <p><strong>Tax:</strong> {money(taxTotal)}</p>

              <p style={{ marginTop: '8px' }}>
                <strong>Total (Inc Tax):</strong> {money(totalIncTax)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="btn btn-success me-2" onClick={handleDownload}>Download PDF</button>
          <button
            className="btnoneclose"
            style={{ background: '#ffffff', color: '#000', padding: '10px 20px', border: '1px solid #ffffff', borderRadius: '7px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;
