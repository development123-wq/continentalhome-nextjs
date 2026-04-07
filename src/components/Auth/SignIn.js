import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ImageSrc from "../../assets/images/logo.png";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      navigate('/users');
      window.location.reload();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://187.124.157.146:5001/api/customers/logincustomer', {
        email,
        password
      });

      const { message, customer, token } = response.data;

      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('customerId', customer.id);
      sessionStorage.setItem('customerEmail', customer.email);
      sessionStorage.setItem('customerName', `${customer.first_name} ${customer.last_name}`);
      sessionStorage.setItem('loginMessage', message);

      navigate('/users');
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div className="w-100 p-3 card border-0 shadow-sm" style={{ maxWidth: "32rem", paddingTop: '1rem' }}>
        <form className="row g-1 p-md-4 signin-form" onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <div className="col-12 text-center mb-0">
            <a href="/"><img src={ImageSrc} alt="Logo" style={{ paddingBottom: '30px' }} /></a>
            <h1>Sign in</h1>
            <span>Free access to our dashboard.</span>
          </div>

          {error && (
            <div className="col-12">
              <div className="alert alert-danger text-center">{error}</div>
            </div>
          )}

          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg lift"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="mb-2">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>Password</span>
                <Link className="text-secondary" to="/reset-password">Forgot Password?</Link>
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg lift"
                  placeholder="***************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">SIGN IN</button>
          </div>

          <div className="col-12 text-center mt-4">
            <span>Don't have an account yet? <Link to="/sign-up" className="text-secondary">Sign up here</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
