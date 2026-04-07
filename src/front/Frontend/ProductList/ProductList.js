import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../assets/css/productlist.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const shuffleArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/products') 
      .then((res) => res.json())
      .then((data) => {
        let items = [];

        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data.products)) {
          items = data.products;
        }

        const shuffled = shuffleArray(items).slice(0, 10); 
        setProducts(shuffled);
      })
      .catch((err) => console.error('API Error:', err));
  }, []);

  return (
    <div className="product-conatiner">
      <div className="row product_row">
        <div className="col-md-12">
          <h2>
            Most Popular <span className="fancytext">Products</span>
          </h2>
        </div>
        <div className="col-md-12 product-section popular-products">
          {products.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                 0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    },
  }}
              loop
            >
              {products.map((product, index) => (
                <SwiperSlide key={index}>
                  <a href={`/productdetails?id=${product.id}`}>
                    <div className="product-define" style={{ width: '95%' }}>
                      <img
                        src={`http://187.124.157.146:5001/${product.main_image}`}
                        alt={product.name || 'Product'}
                        style={{ maxWidth: '230px', borderRadius: '20px',height:'230px',objectFit:'contain',padding:'10px' }}
                      />
                      <h3>{product.name || 'No Name'}</h3>
                      <p className="price">${product.price || '0.00'}</p>
                      <button>Buy Now</button>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
