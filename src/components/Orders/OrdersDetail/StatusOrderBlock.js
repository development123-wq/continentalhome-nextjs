import React, { useState } from 'react';
import axios from 'axios';

function StatusOrderBlock({ order }) {
    const [status, setStatus] = useState(order?.order_status || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = sessionStorage.getItem('authToken'); // ✅ Get token

    try {
        const response = await axios.post(
            'http://187.124.157.146:5001/api/orders/change-order-status',
            {
                order_id: order?.id,
                order_status: status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` // ✅ Pass token here
                }
            }
        );
        alert('Order status updated successfully!');
    } catch (error) {
        console.error('Failed to update status:', error.response || error.message);
        alert('Failed to update status');
    }

    setIsSubmitting(false);
};


    return (
        <div className="card mb-3">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">Status Orders</h6>
            </div>
            <div className="card-body">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-12">
                            <label className="form-label">Order ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={order?.id || ''}
                                readOnly
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Order Status</label>
                            <select className="form-select" value={status} onChange={handleStatusChange}>
                                <option value="Progress">Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="shipped">Shipped</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Quantity</label>
                            <input
                                type="text"
                                className="form-control"
                                value={order?.total_quantity || ''}
                                readOnly
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Order Transaction</label>
                            <select className="form-select" disabled>
                                <option value="Completed">Completed</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                className="form-control"
                                id="comment"
                                rows="4"
                                defaultValue={order?.order_notes || 'No comments'}
                                readOnly
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary mt-4 text-uppercase"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StatusOrderBlock;
