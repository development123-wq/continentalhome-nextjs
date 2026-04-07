import React, { useEffect, useState } from 'react';

const AccountSettings = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
  });

  const token = sessionStorage.getItem('authToken');

  const styles = {
    container: {
      padding: '24px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      maxWidth: '600px',
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
      flexWrap: 'wrap',
    },
    label: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '16px',
      color: '#333',
      flex: 1,
      minWidth: '200px',
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
      backgroundColor: '#63a680',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      width: 'fit-content',
    },
  };

  const fetchProfile = () => {
    fetch('http://187.124.157.146:5001/api/customers/user/profiles', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile({
            first_name: data.profile.first_name || '',
            last_name: data.profile.last_name || '',
            email: data.profile.email || '',
            password: '',
            confirmPassword: '',
            company: data.profile.company || '',
            phone: data.profile.phone || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        alert('❌ Failed to fetch profile.');
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      company: profile.company,
      phone: profile.phone,
      password: profile.password,
      confirmPassword: profile.confirmPassword,
    };

    try {
      const res = await fetch('http://187.124.157.146:5001/api/customers/user/updateprofiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Update response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }

      alert('✅ Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Update failed: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Account Settings</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.row}>
          <label style={styles.label}>
            First Name:
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              style={styles.input}
              placeholder="John"
              required
            />
          </label>

          <label style={styles.label}>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Smith"
              required
            />
          </label>
        </div>

        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={styles.input}
            disabled
          />
        </label>

        <label style={styles.label}>
          Company:
          <input
            type="text"
            name="company"
            value={profile.company}
            onChange={handleChange}
            style={styles.input}
            placeholder="ABC Corp"
          />
        </label>

        <label style={styles.label}>
          Phone:
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={styles.input}
            placeholder="1234567890"
          />
        </label>

        <div style={styles.row}>
          <label style={styles.label}>
            New Password:
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="********"
            />
          </label>

          <label style={styles.label}>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="********"
            />
          </label>
        </div>

        <button type="submit" style={styles.button}>
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
