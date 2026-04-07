import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (!orderId) {
      setError('No order selected.');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('authToken');
    fetch(`http://187.124.157.146:5001/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
      })
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h4 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!order) return null;

  const productCols = [
    { name: '#', cell: (_r, i) => i + 1, width: 60 },
    { name: 'Product', selector: r => r.product_name },
    { name: 'Qty', selector: r => r.quantity },
    { name: 'Price', selector: r => `$${r.price}` },
    { name: 'Subtotal', selector: r => `$${r.quantity * r.price}` },
  ];

  return (
    <>
      {/* Header with Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Order #{order.id}</h4>
        <button className="btn btn-success" onClick={() => setShowInvoice(true)}>
          Download Invoice
        </button>
      </div>

      {/* Main Details stay visible */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Shipping</div>
            <div className="card-body">
              <p className="mb-0">{order.shipping_first_name} {order.shipping_last_name}</p>
              <p className="mb-0">{order.shipping_address1}</p>
              {order.shipping_address2 && <p className="mb-0">{order.shipping_address2}</p>}
              <p className="mb-0">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p className="mb-0">{order.shipping_country}</p>
              <p className="mb-0">Phone: {order.shipping_phone}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Payment & Totals</div>
            <div className="card-body">
              <p><strong>Method:</strong> {order.payment_method || 'Online'}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Subtotal:</strong> ${order.order_total_ex_tax}</p>
              <p><strong>Tax:</strong> ${order.order_tax}</p>
              <p><strong>Shipping:</strong> ${order.order_shipping}</p>
              <h5><strong>Total:</strong> ${order.order_total_inc_tax}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header fw-bold">Items</div>
        <div className="card-body">
          <DataTable
            data={order.products || []}
            columns={productCols}
            dense
            noHeader
            highlightOnHover
          />
        </div>
      </div>

      {/* Modal Popup */}
      <Modal show={showInvoice} onHide={() => setShowInvoice(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice - Order #{order.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={printRef}>
            <div className="text-center mb-3">
              <img src="../../src/assets/images/logo.png" alt="Logo" style={{ maxHeight: '60px' }} />
            </div>

            <div className="d-flex justify-content-between mb-3">
              <div>
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
              <div>
                <p><strong>Due:</strong> —</p>
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <div>
                <h6>Bill To</h6>
                <p className="mb-0">{order.shipping_first_name} {order.shipping_last_name}</p>
                <p className="mb-0">{order.shipping_address1}</p>
                <p className="mb-0">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                <p className="mb-0">{order.shipping_country}</p>
                <p className="mb-0">Phone: {order.shipping_phone}</p>
              </div>
              <div>
                <h6>Ship To</h6>
                <p className="mb-0">{order.shipping_first_name} {order.shipping_last_name}</p>
                <p className="mb-0">{order.shipping_address1}</p>
                <p className="mb-0">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                <p className="mb-0">{order.shipping_country}</p>
                <p className="mb-0">Phone: {order.shipping_phone}</p>
              </div>
            </div>

            <h6>Ordered Products</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end mt-3">
              <p><strong>Subtotal:</strong> ${order.order_total_ex_tax}</p>
              <p><strong>Shipping:</strong> ${order.order_shipping}</p>
              <p><strong>Tax:</strong> ${order.order_tax}</p>
              <h5><strong>Total:</strong> ${order.order_total_inc_tax}</h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handlePrint}>Download PDF</Button>
          <Button variant="secondary" onClick={() => setShowInvoice(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderDetails;
