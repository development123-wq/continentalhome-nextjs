import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import ImageSrc from '../../assets/images/logo.png';

function Signup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    address_first_name_1: '',
    address_last_name_2: '',
    address_city_1: '',
    address_country_1: '',
    address_state_1: '',
    address_zip_1: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Password match check
      if (updated.password && updated.confirmPassword) {
        setPasswordMismatch(updated.password !== updated.confirmPassword);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://187.124.157.146:5001/api/customers/registercustomer', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const loginRes = await axios.post(
        'http://187.124.157.146:5001/api/customers/logincustomer',
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { token, user } = loginRes.data;
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('user', JSON.stringify(user));

      alert('Registration & login successful!');
      window.location.href = '/users';
    } catch (err) {
      console.error(err);
      alert('Registration or login failed!');
    }
  };

  const inputStyle = {
    flex: 1,
    marginRight: '10px',
    marginBottom: '15px',
    position: 'relative'
  };

  const inputField = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '6px'
  };

  const toggleIconStyle = {
    position: 'absolute',
    top: '40px',
    right: '12px',
    cursor: 'pointer',
    color: '#666'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a href="/">
              <img src={ImageSrc} alt="Logo" style={{ paddingBottom: '30px' }} />
            </a>
            <h1>Create your account</h1>
            <span>Free access to our dashboard.</span>
          </div>

          {/* Name & Email */}
          <div style={{ display: 'flex' }}>
            <div style={inputStyle}>
              <label>First Name</label>
              <input type="text" name="first_name" onChange={handleChange} required style={inputField} />
            </div>
            <div style={inputStyle}>
              <label>Last Name</label>
              <input type="text" name="last_name" onChange={handleChange} required style={inputField} />
            </div>
            <div style={{ ...inputStyle, marginRight: 0 }}>
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} required style={inputField} />
            </div>
          </div>

          {/* Password Fields */}
          <div style={{ display: 'flex' }}>
            <div style={inputStyle}>
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimum 8+ characters"
                style={inputField}
              />
              <span style={toggleIconStyle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            <div style={{ ...inputStyle, marginRight: 0 }}>
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimum 8+ characters"
                style={{
                  ...inputField,
                  borderColor: passwordMismatch ? 'red' : '#ccc'
                }}
              />
              <span style={toggleIconStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {passwordMismatch && (
                <p style={{ color: 'red', fontSize: '13px', marginTop: '5px' }}>
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          {/* Company & Address Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={inputStyle}>
              <label>Company</label>
              <input type="text" name="company" onChange={handleChange} style={inputField} />
            </div>
            <div style={inputStyle}>
              <label>Phone</label>
              <input type="text" name="phone" onChange={handleChange} style={inputField} />
            </div>
            <div style={inputStyle}>
              <label>Address First Name</label>
              <input type="text" name="address_first_name_1" onChange={handleChange} style={inputField} />
            </div>
            <div style={{ ...inputStyle, marginRight: 0 }}>
              <label>Address Last Name</label>
              <input type="text" name="address_last_name_2" onChange={handleChange} style={inputField} />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={inputStyle}>
              <label>City</label>
              <input type="text" name="address_city_1" onChange={handleChange} style={inputField} />
            </div>
            <div style={inputStyle}>
              <label>Country</label>
              <input type="text" name="address_country_1" onChange={handleChange} style={inputField} />
            </div>
            <div style={inputStyle}>
              <label>State</label>
              <input type="text" name="address_state_1" onChange={handleChange} style={inputField} />
            </div>
            <div style={{ ...inputStyle, marginRight: 0 }}>
              <label>Zip Code</label>
              <input type="text" name="address_zip_1" onChange={handleChange} style={inputField} />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" required />
              I accept the <Link to="#">Terms and Conditions</Link>
            </label>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '12px 40px',
                backgroundColor: '#63a682',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              SIGN UP
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account? <Link to="/sign-in">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
