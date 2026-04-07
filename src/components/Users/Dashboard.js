import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [stats, setStats] = useState({ total_amount: '0', total_orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const savedCustomer = sessionStorage.getItem('authCustomer');

    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }

    axios
      .get('http://187.124.157.146:5001/api/stats/customer-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const statsData = res.data.stats || {};
        setStats({
          total_amount: statsData.total_amount || '0',
          total_orders: statsData.total_orders || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats');
        setLoading(false);
      });
  }, []);

  const styles = {
    container: {
      padding: '24px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    cardRow: {
      display: 'flex',
      gap: '20px',
      marginTop: '10px',
      flexWrap: 'wrap',
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '12px',
      padding: '16px 20px',
      width: '260px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    },
    icon: {
      fontSize: '20px',
      padding: '14px',
      borderRadius: '8px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '48px',
      height: '48px',
      fontWeight: 'bold',
    },
    info: {
      marginLeft: '14px',
    },
    title: {
      fontSize: '18px',
      color: '#333',
      fontWeight: 500,
      marginBottom: '4px',
    },
    value: {
      fontSize: '16px',
      color: '#333',
    },
    greenCard: {
      backgroundColor: '#d4ede4',
    },
    redCard: {
      backgroundColor: '#fbd5d5',
    },
    greenIcon: {
      backgroundColor: '#2f855a',
    },
    redIcon: {
      backgroundColor: '#e53e3e',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
    loading: {
      color: '#555',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>
      <p>
        Welcome to your dashboard,{' '}
        <span>
          {customer ? `${customer.first_name} ${customer.last_name}` : 'Guest'}
        </span>
        !
      </p>

      {loading && <p style={styles.loading}>Loading your stats...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.cardRow}>
          {/* Total Revenue */}
          <div style={{ ...styles.card, ...styles.greenCard }}>
            <div style={{ ...styles.icon, ...styles.greenIcon }}>$</div>
            <div style={styles.info}>
              <div style={styles.title}>Total Revenue</div>
              <div style={styles.value}>${parseFloat(stats.total_amount || 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Total Orders */}
          <div style={{ ...styles.card, ...styles.redCard }}>
            <div style={{ ...styles.icon, ...styles.redIcon }}>📦</div>
            <div style={styles.info}>
              <div style={styles.title}>Total Orders</div>
              <div style={styles.value}>{stats.total_orders}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
