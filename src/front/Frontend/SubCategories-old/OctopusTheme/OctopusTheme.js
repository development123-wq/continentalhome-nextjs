import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import InnerBanner from '../../InnerBanner/InnerBanner';

const OctopusTheme = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/products?search=&page=1&limit=500&categoryId=23&subcategoryId=20')
      .then((res) => res.json())
      .then((response) => {
        console.log('Full API Response:', response);

        if (Array.isArray(response.products)) {
          setData(response.products);

          // Log each product to inspect structure
          response.products.forEach((item, index) => {
            console.log(`Product ${index + 1}:`, item);
          });
        } else {
          console.error('Unexpected API format', response);
          setData([]);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  }, []);

  return (
    <div className="main-Shoppage">
      <Navbar />
      <InnerBanner />
      <div className="product-conatiner">
        <div className="row product_row">
          <h2>
            Shop By <span className="fancy-text">Octopus Theme</span>
          </h2>
          <div className="col-md-12 product-section">
            {data.length > 0 ? (
              data.map((item) => (
                <a href={`/productdetails?id=${item.id}&cat=${item.category_ids}`}>
                <div className="product-define" key={item.id}>
                  <div className="main-image-container">
                    <img src={`http://187.124.157.146:5001/${item.main_image}`} alt={item.name} />
                  </div>
                  <h3>{item.name}</h3>
                  <p className="price">${item.price}</p>
                 
                  <button>
                    <i className="fa fa-shopping-cart"></i> Add To Cart
                  </button>
                </div>
                </a>
              ))
            ) : (
              <p>Loading products...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OctopusTheme;
