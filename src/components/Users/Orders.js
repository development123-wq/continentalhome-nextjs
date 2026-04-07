import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Orders({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [showHelp, setShowHelp] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [complaintRes, setComplaintRes] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const customerId = sessionStorage.getItem('customerId');

    if (!token || !customerId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(
      `http://187.124.157.146:5001/api/orders/fcustomer/${customerId}?page=${page}&limit=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, rowsPerPage]);

  const handleSubmitComplaint = async () => {
    if (!complaintText.trim()) {
      alert('Please enter your complaint.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    const payload = {
      message: complaintText,
      isAdmin: 1,
      senderType: 'customer',
    };

    console.log("Submitting Complaint:", payload);

    try {
      const res = await fetch('http://187.124.157.146:5001/api/supports/customer/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.message || 'Failed to submit complaint');
      }

      setComplaintRes(data);
      setComplaintText('');
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { name: 'Order ID', selector: r => `#${r.id}`, sortable: true },
    { name: 'Item', selector: r => r.products?.[0]?.product_name || 'N/A', sortable: true },
    { name: 'Order Date', selector: r => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { name: 'Total', selector: r => `₹${r.order_total_inc_tax}`, sortable: true },
    {
      name: '',
      width: '60px',
      cell: row => (
        <span
          title="Need help?"
          style={{ cursor: 'pointer', color: '#0d6efd' }}
          onClick={e => {
            e.stopPropagation();
            setSelectedOrder(row);
            setComplaintRes(null);
            setComplaintText('');
            setShowHelp(true);
          }}
        >
          ❓
        </span>
      ),
    },
  ];

  return (
    <>
      <h4 className="mb-3">My Orders</h4>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          pagination
          paginationServer
          paginationTotalRows={orders.length}
          onChangePage={setPage}
          onChangeRowsPerPage={limit => {
            setRowsPerPage(limit);
            setPage(1);
          }}
          highlightOnHover
          pointerOnHover
          onRowClicked={row => onSelectOrder(row.id)}
          className="table table-hover align-middle mb-0"
        />
      )}

      {/* Complaint Modal */}
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Help for Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {complaintRes ? (
            <div className="alert alert-success">
              Complaint submitted successfully!
              <br />
              Complaint ID: <strong>#{complaintRes.complaint_id || 'N/A'}</strong>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Describe your issue</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handleSubmitComplaint}>
                Submit Your Complaint
              </Button>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHelp(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Orders;
