import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';
import axios from 'axios';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allProducts, selectedCategory, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    paginateData();
  }, [filteredData, page]);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('http://187.124.157.146:5001/api/products?search=&page=1&limit=5000');
      if (res.data && Array.isArray(res.data.products)) {
        setAllProducts(res.data.products);
      }
    } catch (error) { console.error(error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://187.124.157.146:5001/api/categories');
      setCategories(res.data.categories || []);
    } catch (err) { console.error(err); }
  };

  const applyFilters = () => {
    let temp = [...allProducts];
    if (selectedCategory) temp = temp.filter(item => item.category_name === selectedCategory);
    if (minPrice) temp = temp.filter(item => parseFloat(item.price) >= parseFloat(minPrice));
    if (maxPrice) temp = temp.filter(item => parseFloat(item.price) <= parseFloat(maxPrice));

    if (sortOrder === 'asc') temp.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOrder === 'desc') temp.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredData(temp);
    setPage(1);
  };

  const paginateData = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedData(filteredData.slice(start, end));
  };

  const handleWishlistClick = async (productId, e, itemName) => {
    e.preventDefault();
    try {
      await axios.post('http://187.124.157.146:5001/api/wishlists/add', {
        guestId: 'abc-1234', productId: Number(productId), quantity: '1'
      });
      alert(`Added ${itemName} to wishlist!`);
    } catch (err) { alert('Failed to add.'); }
  };

  return (
    <div className="shop-page-wrapper">
      <Navbar />
      <InnerBanner />

      <div className="shop-container">
        {/* SIDEBAR */}
        <aside className="shop-sidebar">
          <div className="filter-box">
            <h4 className="filter-head">Filters</h4>
            <hr />
            
            {/* <div className="filter-item">
              <label>Category</label>
              <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>
                ))}
              </select>
            </div> */}

            <div className="filter-item">
              <label>Sort By</label>
              <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Default</option>
                <option value="asc">Name: A-Z</option>
                <option value="desc">Name: Z-A</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Price Range</label>
              <div className="price-grid">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <button className="clear-btn" onClick={() => {setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); setSortOrder('');}}>
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="shop-content">
          <div className="product-grid">
            {paginatedData.length > 0 ? paginatedData.map((item) => (
              <div className="product-card-item" key={item.id}>
                <div className="p-card-inner">
                  <div className="p-img-holder">
                    <a href={`/productdetails?id=${item.id}`}><img src={`http://187.124.157.146:5001/${item.main_image}`} alt={item.name} /></a>
                    <button className="wish-heart" onClick={(e) => handleWishlistClick(item.id, e, item.name)}>
                      <i className="fa fa-heart"></i>
                    </button>
                  </div>
                  <div className="p-details">
                    <a href={`/productdetails?id=${item.id}`}><h5>{item.name}</h5></a>
                    <p className="p-price">${item.price}</p>
                    <button className="p-buy-now">Buy Now</button>
                  </div>
                </div>
              </div>
            )) : <p className="no-data">No products found.</p>}
          </div>

          {/* Pagination */}
          <div className="shop-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>Page {page}</span>
            <button disabled={page * itemsPerPage >= filteredData.length} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </main>
      </div>

      <Footer />

      <style>{`
        .shop-container {
          display: flex; /* Yeh line overlap fix karegi */
          max-width: 1400px;
          margin: 40px auto;
          padding: 0 20px;
          gap: 30px;
          align-items: flex-start;
        }

        /* Sidebar Styling */
        .shop-sidebar {
          width: 300px;
          flex-shrink: 0;
          position: sticky;
          top: 20px;
        }
        .filter-box {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
        }
        .filter-head { font-weight: bold; margin-bottom: 5px; }
        .filter-item { margin-top:20px }
        .filter-item label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
        .price-grid { display: flex; gap: 10px; }
        .price-grid input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .clear-btn {  margin-top:20px;width: 100%; padding: 10px; background: #63a68210; color: #63a682; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }

        /* Grid Styling */
        .shop-content { flex-grow: 1; }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        /* Card Styling */
        .product-card-item { background: #fff; border: 1px solid #63a682; overflow: hidden; transition: 0.3s; }
        .product-card-item:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .p-img-holder { position: relative; height: 280px; background: #f9f9f9; }
        .p-img-holder img { width: 100%; height: 100%; object-fit: cover; }
        .wish-heart { position: absolute; top: 15px; right: 15px; background: #fff; border: none; width: 35px; height: 35px; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; }
        .wish-heart:hover { color: red; }
        .p-details { padding-top: 20px;padding-bottom:0px; text-align: center; }
        .p-details a { text-decoration: none; color: #333; }
        .p-details h5 { font-size: 16px; margin-bottom: 10px; height: 55px; overflow: hidden; }
        .p-price { font-size: 18px; font-weight: bold; color: red;margin-bottom:10px; }
        .p-buy-now { background: #63a682; color: #fff; border: none;width:100%; padding: 8px 25px; cursor: pointer; }
        .form-select{width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;}

        /* Pagination */
        .shop-pagination { margin-top: 40px; display: flex; justify-content: center; align-items: center; gap: 20px; }
        .shop-pagination button { padding: 8px 20px; border: 1px solid #000; background: #fff; cursor: pointer; }
        .shop-pagination button:disabled { opacity: 0.3; }

        @media (max-width: 992px) {
          .shop-container { flex-direction: column; }
          .shop-sidebar { width: 100%; position: relative; }
        }
      `}</style>
    </div>
  );
};

export default Shop;