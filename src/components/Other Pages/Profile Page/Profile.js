import React, { useEffect, useState } from 'react';
import Avatar4 from '../../../assets/images/lg/avatar4.svg';
import { Modal } from 'react-bootstrap';

function Profile() {
    const [ismodal, setIsmodal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        company_name: '',
        contact_person: '',
        mobile_number: '',
        address: '',
    });

    const getToken = () => {
        return (
            localStorage.getItem('adminToken') ||
            localStorage.getItem('token') ||
            localStorage.getItem('admin_token') ||
            ''
        );
    };

    const parseResponse = async (response) => {
        const text = await response.text();

        if (!text) return {};

        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error(text);
        }
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = getToken();

            const response = await fetch('http://187.124.157.146:5001/api/admin/get-admin-profile', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await parseResponse(response);

            if (!response.ok) {
                throw new Error(result?.message || 'Failed to fetch profile');
            }

            const data = result?.data || result;

            setProfileData({
                name: data?.name || '',
                company_name: data?.company_name || '',
                contact_person: data?.contact_person || '',
                mobile_number: data?.mobile_number || '',
                address: data?.address || '',
            });
        } catch (error) {
            console.error('Fetch profile error:', error);
            alert(error.message || 'Profile fetch failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const token = getToken();

        const payload = {
            name: profileData.name?.trim() || '',
            company_name: profileData.company_name?.trim() || '',
            contact_person: profileData.contact_person?.trim() || '',
            mobile_number: profileData.mobile_number?.trim() || '',
            address: profileData.address?.trim() || '',
        };

        if (!payload.name) {
            alert('Name is required');
            return;
        }

        try {
            setSaving(true);

            const response = await fetch('http://187.124.157.146:5001/api/admin/update-admin-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await parseResponse(response);

            if (!response.ok) {
                throw new Error(result?.message || 'Profile update failed');
            }

            alert(result?.message || 'Profile updated successfully');
            setIsmodal(false);
            fetchProfile();
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card profile-card flex-column mb-3">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">Profile</h6>
            </div>

            {loading ? (
                <div className="card-body text-center py-5">
                    <span className="text-muted">Loading...</span>
                </div>
            ) : (
                <div className="card-body d-flex profile-fulldeatil flex-column">
                    <div className="profile-block text-center w220 mx-auto">
                        <a href="#!">
                            <img
                                src={Avatar4}
                                alt=""
                                className="avatar xl rounded img-thumbnail shadow-sm"
                            />
                        </a>

                        <button
                            className="btn btn-primary"
                            onClick={() => setIsmodal(true)}
                            style={{ position: 'absolute', top: '15px', right: '15px' }}
                        >
                            <i className="icofont-edit"></i>
                        </button>

                        <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
                            <span className="text-muted small">Admin ID : PXL-0001</span>
                        </div>
                    </div>

                    <div className="profile-info w-100">
                        <h6 className="mb-0 mt-2 fw-bold d-block fs-6 text-center">
                            {profileData.name}
                        </h6>

                        <span className="py-1 fw-bold small-11 mb-0 mt-1 text-muted text-center mx-auto d-block">
                            {profileData.company_name}
                        </span>

                        <div className="row g-2 pt-2">
                            <div className="col-xl-12">
                                <div className="d-flex align-items-center">
                                    <i className="icofont-user"></i>
                                    <span className="ms-2">{profileData.contact_person}</span>
                                </div>
                            </div>

                            <div className="col-xl-12">
                                <div className="d-flex align-items-center">
                                    <i className="icofont-phone"></i>
                                    <span className="ms-2">{profileData.mobile_number}</span>
                                </div>
                            </div>

                            <div className="col-xl-12">
                                <div className="d-flex align-items-center">
                                    <i className="icofont-location-pin"></i>
                                    <span className="ms-2">{profileData.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={ismodal} onHide={() => setIsmodal(false)} style={{ display: 'block' }}>
                <div className="modal-content">
                    <Modal.Header className="modal-header" closeButton>
                        <h5 className="modal-title fw-bold">Edit Profile</h5>
                    </Modal.Header>

                    <Modal.Body className="modal-body">
                        <div className="deadline-form">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="row g-3 mb-3">
                                    <div className="col-sm-12">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-sm-12">
                                        <label className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="company_name"
                                            value={profileData.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label">Contact Person</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="contact_person"
                                            value={profileData.contact_person}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label">Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="mobile_number"
                                            value={profileData.mobile_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-sm-12">
                                        <label className="form-label">Address</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer px-0 pb-0">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsmodal(false)}
                                    >
                                        Done
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
}

export default Profile;