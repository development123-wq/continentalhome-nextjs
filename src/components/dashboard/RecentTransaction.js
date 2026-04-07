import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function RecentTransaction() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            name: 'Order ID',
            selector: row => `#${row.id}`,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.billing_first_name,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => `$${row.order_total_inc_tax || 0}`,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.order_status || 'Pending',
            sortable: true,
        }
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    'http://187.124.157.146:5001/api/orders?search=&status=&page=1&limit=2534'
                );
                const allOrders = response.data.orders || [];
                setOrders([...allOrders].reverse()); // Reverse order here
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center bg-transparent border-bottom-0">
                <h6 className="m-0 fw-bold">Recent Orders</h6>
            </div>
            <div className="card-body">
                <div id="myDataTable_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable
                                title="Recent Orders"
                                columns={columns}
                                data={orders}
                                progressPending={loading}
                                highlightOnHover
                                pagination
                                defaultSortFieldId="createdAt"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentTransaction;
