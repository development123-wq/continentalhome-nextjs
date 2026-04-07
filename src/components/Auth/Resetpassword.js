import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

function Resetpassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (token) {
      if (!password || !confirmPassword) {
        return setError('Please fill in all fields.');
      }
      if (password !== confirmPassword) {
        return setError('Passwords do not match.');
      }
    } else {
      if (!email) {
        return setError('Please enter your email.');
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        token
          ? 'http://187.124.157.146:5001/api/customers/reset-password'
          : 'http://187.124.157.146:5001/api/customers/forget-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            token
              ? { password, confirmPassword, token }
              : { email }
          ),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowPopup(true);
        if (!token) setEmail('');
        else {
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToInbox = () => {
    window.open('https://mail.google.com/', '_blank');
  };

  return (
    <div className="w-100 p-3 p-md-5 card border-0 shadow-sm" style={{ maxWidth: '32rem' }}>
      <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
        <div className="col-12 text-center mb-4">
          <h1>{token ? 'Reset Password' : 'Forgot Password?'}</h1>
          <span>
            {token
              ? 'Enter your new password and confirm it.'
              : `Enter the email address you used when you joined and we'll send you instructions to reset your password.`}
          </span>
        </div>

        {!token && (
          <div className="col-12">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {token && (
          <>
            <div className="col-12">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-lg"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="col-12 mt-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control form-control-lg"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="col-12 text-danger text-center mt-2">{error}</div>
        )}

        <div className="col-12 text-center mt-4">
          <button
            type="submit"
            className="btn btn-lg btn-block btn-light lift text-uppercase"
            disabled={loading}
          >
            {loading ? 'Please wait...' : token ? 'Reset Password' : 'Submit'}
          </button>
        </div>

        {!token && (
          <div className="col-12 text-center mt-4">
            <span className="text-muted">
              <a href="/sign-in" className="text-secondary">Back to Sign in</a>
            </span>
          </div>
        )}
      </form>

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h4>{token ? 'Password Reset Successfully' : 'Check Your Email'}</h4>
            <p>{token ? 'Your password has been updated.' : 'We\'ve sent password reset instructions to your inbox.'}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={token ? () => window.location.href = '/sign-in' : goToInbox}
            >
              {token ? 'Go to Sign In' : 'Go to Email'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resetpassword;
