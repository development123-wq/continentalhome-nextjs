import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import InnerBanner from '../../InnerBanner/InnerBanner';

const CeramicPlatters = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/products?search=&page=1&limit=500&categoryId=23&subcategoryId=15')
      .then((res) => res.json())
      .then((response) => {
        if (Array.isArray(response.products)) {
          setData(response.products);
        } else {
          console.error('Unexpected API format', response);
          setData([]);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(data.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="main-Shoppage">
      <Navbar />
      <InnerBanner />
      <div className="product-conatiner">
        <div className="row product_row">
          <h2>
            Shop By <span className="fancy-text">Ceramic Platters</span>
          </h2>

          <div
            className="product-section"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              gap: '10px',
            }}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((item) => (
                <a
                  href={`/productdetails?id=${item.id}&cat=${item.category_ids}`}
                  key={item.id}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    className="product-define"
                    style={{
                      width: '260px',
                      marginBottom: '20px',
                    }}
                  >
                    <div className="main-image-container" style={{ textAlign: 'center' }}>
                      <img
                        src={`http://187.124.157.146:5001/${item.main_image}`}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                    <h3>{item.name}</h3>
                    <p className="price">${item.price}</p>
                    <button>
                      Buy Now
                    </button>
                  </div>
                </a>
              ))
            ) : (
              <p>Loading products...</p>
            )}
          </div>

          {/* Pagination Buttons */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="prev-btn" onClick={handlePrev} disabled={currentPage === 1} style={{ marginRight: '10px' }}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="next-btn" onClick={handleNext} disabled={currentPage === totalPages} style={{ marginLeft: '10px' }}>
              Next
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CeramicPlatters;
