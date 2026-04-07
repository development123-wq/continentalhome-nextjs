import React, { useEffect, useState } from 'react';

function BasicInformation() {
  const [categoryData, setCategoryData] = useState({
    name: '',
    slug: '',
    description: '',
    shipping_cost: '',
    category_name: '',
    category_id: '', // ✅ NEW: add this
  });

  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  // ✅ Fetch Subcategory Details
  useEffect(() => {
    fetch(`http://187.124.157.146:5001/api/subcategories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.subcategory) {
          setCategoryData({
            name: data.subcategory.name || '',
            slug: data.subcategory.slug || '',
            description: data.subcategory.description || '',
            shipping_cost: data.subcategory.shipping_cost || '',
            category_name: data.subcategory.category_name || '',
            category_id: data.subcategory.category_id || '', // ✅ NEW: get category ID
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching subcategory:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('authToken');

      const payload = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        shipping_cost: categoryData.shipping_cost,
        categoryId: categoryData.category_id, // ✅ This is what the API expects
      };

      const res = await fetch(`http://187.124.157.146:5001/api/subcategories/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        const text = await res.text();
        console.error('Server error response:', text);
        alert('Failed to update subcategory.');
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        await res.json();
        alert('Subcategory updated successfully!');
        window.location.href = '/subcategories-list';
      } else {
        alert('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      alert('Error updating subcategory.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Edit Subcategory</h6>
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
                name="name"
                value={categoryData.name}
                onChange={handleChange}
              />
            </div>

            {/* Page Title */}
            <div className="col-md-6">
              <label className="form-label">Subcategory Page Title</label>
              <input
                type="text"
                className="form-control"
                value={`${categoryData.name} Page`}
                readOnly
              />
            </div>

            {/* Slug */}
            <div className="col-md-12">
              <label className="form-label">Subcategory Identifier URL</label>
              <div className="input-group mb-3">
                <span className="input-group-text">https://continentalhome.com/</span>
                <input
                  type="text"
                  className="form-control"
                  name="slug"
                  value={`${categoryData.slug}`}
                  onChange={(e) => {
                    const newSlug = e.target.value.replace('/', '');
                    setCategoryData((prev) => ({ ...prev, slug: newSlug }));
                  }}
                />
              </div>
            </div>

           

            {/* Parent Category Name */}
            <div className="col-md-6">
              <label className="form-label">Parent Category</label>
              <input
                type="text"
                className="form-control"
                value={categoryData.category_name}
                readOnly
              />
            </div>
          </div>

          <br />
          <input
            className="btn btn-primary btn-set-task w-sm-100 text-uppercase px-5"
            type="submit"
            value="Update Subcategory"
          />
        </form>
      </div>
    </>
  );
}

export default BasicInformation;
