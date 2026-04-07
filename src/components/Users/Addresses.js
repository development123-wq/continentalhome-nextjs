import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Addresses = () => {
  const [address, setAddress] = useState({
    address_first_name_1: '',
    address_last_name_2: '',
    address_city_1: '',
    address_country_1: '',
    address_state_1: '',
    address_zip_1: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const styles = {
    container: {
      padding: '24px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      maxWidth: '700px',
      margin: '0 auto',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '16px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    row: {
      display: 'flex',
      gap: '16px',
    },
    label: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      fontSize: '16px',
      color: '#333',
    },
    input: {
      marginTop: '6px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '14px',
    },
    button: {
      marginTop: '20px',
      padding: '10px 16px',
      backgroundColor: '#63a682',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      width: 'fit-content',
    },
    message: {
      marginTop: '10px',
      fontSize: '14px',
    },
  };

  const fetchAddress = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        'http://187.124.157.146:5001/api/customers/user/address',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.address) {
        setAddress(res.data.address);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch address');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await axios.put(
        'http://187.124.157.146:5001/api/customers/user/updateaddress',
        JSON.stringify(address),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ API Response:', response.data);
      setSuccessMsg('Address updated successfully!');
      setError('');
      alert('Address updated successfully!');
    } catch (err) {
      console.error('❌ Update failed:', err.response?.data || err.message);
      setError('Failed to update address');
      setSuccessMsg('');
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (loading) return <div style={styles.container}>Loading address...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Addresses</h2>

      <form style={styles.form}>
        <div style={styles.row}>
          <label style={styles.label}>
            First Name:
            <input
              type="text"
              name="address_first_name_1"
              value={address.address_first_name_1}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Last Name:
            <input
              type="text"
              name="address_last_name_2"
              value={address.address_last_name_2}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            City:
            <input
              type="text"
              name="address_city_1"
              value={address.address_city_1}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            State:
            <input
              type="text"
              name="address_state_1"
              value={address.address_state_1}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Country:
            <input
              type="text"
              name="address_country_1"
              value={address.address_country_1}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Zip Code:
            <input
              type="text"
              name="address_zip_1"
              value={address.address_zip_1}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        <button type="button" onClick={handleUpdate} style={styles.button}>
          Update Address
        </button>

        {error && <div style={{ ...styles.message, color: 'red' }}>{error}</div>}
        {successMsg && <div style={{ ...styles.message, color: 'green' }}>{successMsg}</div>}
      </form>
    </div>
  );
};

export default Addresses;
