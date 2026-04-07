import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Images from '../../assets/images/verify.svg';

function Verification() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Get token from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Missing token in URL.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Both fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://187.124.157.146:5001/api/customers/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    password: password,
                    confirmPassword: confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Show success popup
                setShowSuccess(true);
            } else {
                setError(data.message || 'Something went wrong.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOkayClick = () => {
        navigate('/sign-in');
    };

    return (
        <div className="w-100 p-3 p-md-5 card border-0 shadow-sm" style={{ maxWidth: '32rem' }}>
            <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                <div className="col-12 text-center mb-5">
                    <img src={Images} className="w240 mb-4" alt="" />
                    <h1>Reset Password</h1>
                    <span>Enter your new password below to reset your account.</span>
                </div>

                <div className="col-12 mt-2">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="col-12 mt-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div className="col-12 text-danger text-center mt-3">
                        {error}
                    </div>
                )}

                <div className="col-12 text-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-lg btn-block btn-light lift text-uppercase"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'RESET PASSWORD'}
                    </button>
                </div>

                <div className="col-12 text-center mt-4">
                    <span>Back to <a href="/sign-in" className="text-secondary">Sign in</a></span>
                </div>
            </form>

            {/* ✅ Success Modal */}
            {showSuccess && (
                <div
                    style={{
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
                    }}
                >
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '2rem',
                        borderRadius: '10px',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <h4>Password reset successfully!</h4>
                        <p>You can now log in with your new password.</p>
                        <button className="btn btn-primary mt-3" onClick={handleOkayClick}>
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Verification;
