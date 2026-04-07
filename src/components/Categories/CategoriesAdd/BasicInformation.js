import React, { useState } from 'react';

function BasicInformation() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shippingCost, setShippingCost] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      shipping_cost: Number(shippingCost) || 0,
    };

    try {
      const token = sessionStorage.getItem('authToken');

      const res = await fetch('http://187.124.157.146:5001/api/categories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Category added successfully!');
        console.log('Server response:', result);
        setName('');
        setSlug('');
        setShippingCost('');
        window.location.href = '/categories-list';
      } else {
        alert(`Failed to add category: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting category. Check console.');
    }
  };

  return (
    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Basic information</h6>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Slug */}
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            {/* Shipping Cost */}
            <div className="col-md-6">
              <label className="form-label">Shipping Cost</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="e.g. $10"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                required
              />
            </div>

            {/* Description (optional) */}
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="ex. Lorem Ipsum has been the industry's standard..."
                style={{ width: '100%' }}
              />
            </div>

            {/* Submit */}
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary mt-3">
                Add Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default BasicInformation;
