import React, { useEffect, useState } from 'react';

function BasicInformation() {
    const [categoryData, setCategoryData] = useState({
        name: '',
        slug: '',
        description: '',
        shipping_cost: ''
    });
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');

    useEffect(() => {
        fetch(`http://187.124.157.146:5001/api/categories/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.category) {
                    setCategoryData({
                        name: data.category.name || '',
                        slug: data.category.slug || '',
                        description: data.category.description || '',
                        shipping_cost: data.category.shipping_cost || ''
                    });
                }
            })
            .catch(err => {
                console.error("Error fetching category:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('authToken');
            const res = await fetch(`http://187.124.157.146:5001/api/categories/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            const contentType = res.headers.get('content-type');

            if (!res.ok) {
                const text = await res.text();
                console.error("Server error response:", text);
                alert("Failed to update category.");
                return;
            }

            if (contentType && contentType.includes('application/json')) {
                const result = await res.json();
                alert("Category updated successfully!");
                window.location.href = "/categories-list";
            } else {
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Error updating category.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">Basic information</h6>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={categoryData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Category Page Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={`${categoryData.name} Page`}
                                readOnly
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Category Identifier URL</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text">https://continentalhome.com/</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="slug"
                                    value={`/category/${categoryData.slug}`}
                                    onChange={(e) => {
                                        const newSlug = e.target.value.replace("/category/", "");
                                        setCategoryData(prev => ({ ...prev, slug: newSlug }));
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Category Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={categoryData.description}
                                onChange={handleChange}
                                placeholder="Category description (Optional)"
                                style={{ height: '200px' }}
                            ></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Shipping Cost</label>
                            <input
                                type="number"
                                className="form-control"
                                name="shipping_cost"
                                value={categoryData.shipping_cost}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <br />
                    <input
                        className="btn btn-primary btn-set-task w-sm-100 text-uppercase px-5"
                        type="submit"
                        value="Update Category"
                    />
                </form>
            </div>
        </>
    );
}

export default BasicInformation;
