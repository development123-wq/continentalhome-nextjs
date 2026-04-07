import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const Categories = ({ onCategoryChange, onSubcategoryChange }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://187.124.157.146:5001/api/categories?page=1&limit=20');
        const data = await response.json();

        let categoryArray = [];
        if (Array.isArray(data)) {
          categoryArray = data;
        } else if (data && data.categories && Array.isArray(data.categories)) {
          categoryArray = data.categories;
        } else {
          throw new Error('Unexpected API format');
        }

        const options = categoryArray.map((cat) => ({
          value: cat.id,
          label: cat.name,
          subcategories: cat.subcategories || [], // attach subcategories array if present
        }));

        setCategoryOptions(options);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // When categories change, update subcategory options
  useEffect(() => {
    // Extract all subcategories from selected categories
    const subs = selectedCategories.flatMap((cat) =>
      cat.subcategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
        categoryId: cat.value,
      }))
    );

    setSubcategoryOptions(subs);
    setSelectedSubcategories([]); // reset selected subcategories on category change

    // Inform parent of subcategories reset
    if (onSubcategoryChange) onSubcategoryChange([]);
  }, [selectedCategories, onSubcategoryChange]);

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected || []);
    if (onCategoryChange) {
      const selectedIds = (selected || []).map((item) => item.value);
      onCategoryChange(selectedIds);
    }
  };

  const handleSubcategoryChange = (selected) => {
    setSelectedSubcategories(selected || []);
    if (onSubcategoryChange) {
      const selectedIds = (selected || []).map((item) => item.value);
      onSubcategoryChange(selectedIds);
    }
  };

  return (
    <div className="p-3">
      <label className="form-label fw-semibold">Categories</label>

      {loading ? (
        <div className="text-muted">Loading categories...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <Select
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
          isMulti
          isSearchable
          placeholder="Select categories..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      )}

      <label className="form-label fw-semibold mt-4">Subcategories</label>

      {subcategoryOptions.length === 0 ? (
        <div className="text-muted">Select categories to see subcategories</div>
      ) : (
        <Select
          options={subcategoryOptions}
          value={selectedSubcategories}
          onChange={handleSubcategoryChange}
          isMulti
          isSearchable
          placeholder="Select subcategories..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      )}
    </div>
  );
};

export default Categories;
