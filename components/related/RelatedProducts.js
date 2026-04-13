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
      className="main-Shoppage related-products-conatiner2 most-popular-pro"
      style={{ width: '100%', paddingTop: '0px' }}
    >
      <style>{`
        .sc-wrap {
          width: 100%;
        }

        .sc-slide-card {
          width: 100%;
        }

        .sc-card-inner {
          background: #fff;
          border: 1px solid #63a682;
          border-radius: 0px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .sc-card-inner:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.10);
        }

        .sc-img-holder {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          height: 280px;
          background: #ffffff;
          overflow: hidden;
        }

        .sc-img-holder img {
          max-width: 80%;
          max-height: 80%;
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          display: block;
          transition: transform 0.35s ease;
        }

        .sc-card-inner:hover .sc-img-holder img {
          transform: scale(1.05);
        }

        .sc-details {
          padding: 18px 16px 20px;
          text-align: center;
        }

        .sc-details h5 {
          font-size: 16px;
          font-weight: 600;
          color: #1f1f1f;
          line-height: 1.4;
          margin: 0 0 10px;
          min-height: 44px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sc-price {
          font-size: 18px;
          font-weight: 700;
          color: red;
          margin: 0 0 14px;
        }

        .sc-buy-now {
          background: #63a682;
          color: #fff;
          border: none;
          border-radius: 0px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width:100%;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .sc-buy-now:hover {
          background: #c89b63;
          color: #fff;
        }

        .sc-loading {
          text-align: center;
          font-size: 15px;
          color: #777;
          padding: 30px 0;
        }

        @media (max-width: 767px) {
          .sc-img-holder {
            height: 220px;
            padding: 16px;
          }

          .sc-details {
            padding: 16px 14px 18px;
          }

          .sc-details h5 {
            font-size: 15px;
            min-height: 42px;
          }

          .sc-price {
            font-size: 17px;
          }

          .sc-buy-now {
            width: 100%;
            padding: 10px 16px;
            background:#63a682;
          }
         
        }
      `}</style>

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
                  <div className="sc-wrap">
                    <a
                      href={`/${item.slug || ""}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="sc-slide-card">
                        <div className="sc-card-inner">
                          <div className="sc-img-holder">
                            <img
                              src={`http://187.124.157.146:5001/${item.main_image}`}
                              alt={item.name}
                            />
                          </div>

                          <div className="sc-details">
                            <h5>{item.name}</h5>
                            <p className="sc-price">${item.price}</p>

                           
                          </div>
                           <button
                              className="sc-buy-now"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/productdetails?id=${item.id}&cat=${item.category_ids}`;
                              }}
                            >
                              Buy Now
                            </button>
                        </div>
                      </div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="sc-loading">Loading products...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallCeramics;