import React, { useState, useEffect } from 'react';

function Categories() {
    const [categories, setCategories] = useState([]); // To store categories
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle errors if the fetch fails

    useEffect(() => {
        // Fetch categories data from the API
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://187.124.157.146:5001/api/categories?page=1&limit=20');
                
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                console.log('API Response:', data); // Log the response to check its structure

                // Check if the data is an array or if it's wrapped in a property like 'data' or 'categories'
                if (Array.isArray(data)) {
                    setCategories(data); // If it's an array, update state with categories
                } else if (data && data.categories && Array.isArray(data.categories)) {
                    setCategories(data.categories); // If it's an object with 'categories' as an array
                } else {
                    setError('Invalid data format received');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []); // Empty dependency array, so it runs only once when the component mounts

    return (
        <>
            <div className="card-header py-3 d-flex justify-content-between align-items-center bg-transparent border-bottom-0">
                <h6 className="m-0 fw-bold">Categories</h6>
            </div>
            <div className="card-body">
                <label className="form-label">Categories Select</label>
                <select className="form-select" size="3" >
                    {loading ? (
                        <option>Loading...</option> // Display loading text until data is fetched
                    ) : error ? (
                        <option>{error}</option> // Display error if something went wrong
                    ) : (
                        categories.map((category, index) => (
                            <option key={index} value={category.id}>
                                {category.name} {/* Assuming category has 'id' and 'name' */}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </>
    );
}

export default Categories;
