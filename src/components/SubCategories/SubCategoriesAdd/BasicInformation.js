import React, { useEffect, useState } from 'react';
import Select from 'react-select';

function BasicInformation() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);

  // 🔄 Fetch Parent Categories
  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/categories?search=&page=1&limit=1000')
      .then((res) => res.json())
      .then((data) => {
        const options = (data?.categories || []).map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategories(options);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  // Submit to Subcategory API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      categoryId: selectedParentCategory?.value,
    };

    if (!payload.name || !payload.categoryId) {
      alert('Both subcategory name and parent category are required.');
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');

      const res = await fetch('http://187.124.157.146:5001/api/subcategories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Subcategory added successfully!');
        setName('');
        setSelectedParentCategory(null);
        window.location.href = '/subcategories-list'; // Or change route if needed
      } else {
        alert(`Failed to add subcategory: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting subcategory. Check console.');
    }
  };

  return (
    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Add Subcategory</h6>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">

            {/* Parent Category Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Parent Category</label>
              <Select
                options={categories}
                value={selectedParentCategory}
                onChange={setSelectedParentCategory}
                placeholder="Select parent category..."
                isClearable
              />
            </div>

            {/* Subcategory Name */}
            <div className="col-md-6">
              <label className="form-label">Subcategory Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter subcategory name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary mt-3">
                Add Subcategory
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default BasicInformation;
