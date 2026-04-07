import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfileSetting() {
    const [formData, setFormData] = useState({
        name: '',
        company_name: '',
        contact_person: '',
        mobile_number: '',
        address: '',
        website_url: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // FIXED: Login wala token fetch karega (sessionStorage.authToken)
    const getToken = () => {
        let token = sessionStorage.getItem('authToken'); // Login me yahi store kiya
        if (!token) {
            token = localStorage.getItem('token'); // Backup
        }
        return token;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getProfile = async () => {
        try {
            setLoading(true);
            setMessage('');

            const token = getToken();
            
            // DEBUG: Token check
            if (!token) {
                const sessionToken = sessionStorage.getItem('authToken');
                const localToken = localStorage.getItem('token');
                alert(`❌ Token nahi mila!\nsessionStorage.authToken: ${sessionToken ? 'Haan' : 'Nahi'}\nlocalStorage.token: ${localToken ? 'Haan' : 'Nahi'}\n\nPehle Login karo!`);
                setMessage('Token nahi mila. Please login karo pehle.');
                return;
            }

            // alert(`✅ Token mil gaya: ${token.substring(0, 30)}...`);

            const response = await axios.get(
                'http://187.124.157.146:5001/api/admin/get-admin-profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Full API Response:', response.data);

            const profileData = response?.data?.data || response?.data || {};

            setFormData((prev) => ({
                ...prev,
                name: profileData.name || '',
                company_name: profileData.company_name || '',
                contact_person: profileData.contact_person || '',
                mobile_number: profileData.mobile_number || '',
                address: profileData.address || '',
                website_url: profileData.website_url || '',
                country: profileData.country || '',
                state: profileData.state || '',
                city: profileData.city || '',
                postal_code: profileData.postal_code || '',
                email: profileData.email || '',
                password: ''
            }));

            // setMessage('✅ Profile data load ho gaya!');

        } catch (error) {
            console.error('❌ Profile API Error:', error);
            
            let errorMsg = 'Profile data load nahi ho paaya';
            
            if (error.response) {
                if (error.response.status === 401) {
                    errorMsg = '❌ Token invalid/expired hai. Dobara login karo.';
                } else {
                    errorMsg = `❌ Server Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
                }
                console.error('Response Error:', error.response.data);
            } else if (error.request) {
                errorMsg = '❌ Server down hai (187.124.157.146:5001) ya network issue';
            } else {
                errorMsg = `❌ ${error.message}`;
            }
            
            setMessage(errorMsg);
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage('');

            const token = getToken();
            if (!token) {
                setMessage('❌ Token nahi mila. Login karo.');
                return;
            }

            const payload = {
                name: formData.name,
                company_name: formData.company_name,
                contact_person: formData.contact_person,
                mobile_number: formData.mobile_number,
                address: formData.address,
                website_url: formData.website_url,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                postal_code: formData.postal_code,
                email: formData.email
            };

            if (formData.password?.trim()) {
                payload.password = formData.password;
            }

            const response = await axios.put(
                'http://187.124.157.146:5001/api/admin/update-admin-profile',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage(response?.data?.message || 'Profile updated Successfully');
            setFormData((prev) => ({ ...prev, password: '' }));
            
        } catch (error) {
            console.error('Update Error:', error);
            setMessage(error?.response?.data?.message || '❌ Profile update fail ho gaya');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">Profile Settings</h6>
            </div>

            <div className="card-body">
                {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-success'}`} role="alert">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 mb-0">Profile load ho raha hai...</p>
                    </div>
                ) : (
                    <form className="row g-4" onSubmit={handleSubmit}>
                        <div className="col-sm-6">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">User Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">New Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">
                                    Company Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">Contact Person</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">
                                    Mobile Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">Address</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">Website URL</label>
                                <div className="input-group">
                                    <span className="input-group-text">http://</span>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">Country</label>
                                <select
                                    className="form-control"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select Country --</option>
                                    <option value="India">India</option>
                                    <option value="Afghanistan">Afghanistan</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">State/Province</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">City</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold">Postal Code</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary text-uppercase px-5 py-2 fw-bold"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'SAVE CHANGES'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ProfileSetting;