import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const SmallCeramics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    const categoryId = catParam ? catParam.split(',')[0] : '';

    fetch(
      `http://187.124.157.146:5001/api/products?search=&page=1&limit=10&categoryId=${categoryId}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (Array.isArray(response.products)) {
          const shuffled = shuffleArray(response.products).slice(0, 10);
          setData(shuffled);
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
    <div
      className="main-Shoppage related-products-conatiner2"
      style={{ width: '100%', paddingTop: '0px' }}
    >
      <div className="product-conatiner" style={{ width: '100%' }}>
        <div className="row product_row" style={{ width: '100%' }}>
          {data.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {data.map((item) => (
                <SwiperSlide key={item.id}>
                  <a
                    href={`/productdetails?id=${item.id}&cat=${item.category_ids}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="product-define"
                      style={{ width: '100%', marginBottom: '20px' }}
                    >
                      <div
                        className="main-image-container"
                        style={{ textAlign: 'center' }}
                      >
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

export default SmallCeramics;
