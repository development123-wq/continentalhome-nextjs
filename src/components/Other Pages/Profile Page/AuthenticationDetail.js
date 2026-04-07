import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function AuthenticationDetail() {
    const [isModal, setIsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                'http://187.124.157.146:5001/api/admin/get-admin-profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response?.data?.data || response?.data || {};

            setProfile({
                name: data?.name || '',
                email: data?.email || '',
            });
        } catch (error) {
            console.error('Profile fetch error:', error);
            alert(error?.response?.data?.message || 'Profile fetch nahi hua');
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setFormData({
            password: '',
            confirmPassword: '',
        });
        setIsModal(true);
    };

    const closeModal = () => {
        setIsModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!formData.password || !formData.confirmPassword) {
            alert('Password aur Confirm Password required hai');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Password match nahi kar raha');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: profile.name,
                password: formData.password,
            };

            const response = await axios.put(
                'http://187.124.157.146:5001/api/admin/update-admin-profile',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert(response?.data?.message || 'Password updated successfully');
            closeModal();
        } catch (error) {
            console.error('Password update error:', error);
            alert(error?.response?.data?.message || 'Password update nahi ho raha');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card auth-detailblock">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">Authentication Details</h6>
                <button className="btn btn-primary" onClick={openModal}>
                    <i className="icofont-edit"></i>
                </button>
            </div>

            <div className="card-body">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label col-6 col-sm-5">Email :</label>
                            <span><strong>{profile.email || '-'}</strong></span>
                        </div>

                        <div className="col-12">
                            <label className="form-label col-6 col-sm-5">Login Password :</label>
                            <span><strong>********</strong></span>
                        </div>

                        <div className="col-12">
                            <label className="form-label col-6 col-sm-5">Last Login:</label>
                            <span><strong>-</strong></span>
                        </div>

                        <div className="col-12">
                            <label className="form-label col-6 col-sm-5">Last Password change:</label>
                            <span><strong>-</strong></span>
                        </div>
                    </div>
                )}
            </div>

            <Modal show={isModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Authentication</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row g-3">
                        <div className="col-sm-12">
                            <label className="form-label">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profile.email}
                                disabled
                            />
                        </div>

                        <div className="col-sm-12">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="col-sm-12">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AuthenticationDetail;