import React, { useEffect, useState } from 'react';
import '../../../assets/css/contentpart.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';

const ContentPart = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios
      .get('http://187.124.157.146:5001/api/featureds')
      .then((res) => setBanners(res.data))
      .catch((err) => {
        console.error('Error loading featured banners:', err);
      });
  }, []);

  return (
    <div className="content-conatiner">
      <div className="row content_row">
        <div className="col-md-12 content-section">
          <div className="content-define content-define-one">
            <div className="btn-div-content">
              <h4>Rope Lamp</h4>
              <button className="banner-btn-one" onClick={() => window.location.href = '/rope-lamps'}>View All Products</button>
            </div>
          </div>
          <div className="content-define content-define-two">
            <div className="btn-div-content">
              <h4>Ceramic Plates</h4>
              <button className="banner-btn-one" onClick={() => window.location.href = '/ceramic-plates'}>View All Products</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto product-best-offer-container">
        <div className="content-banner-text content-section-banner">
          <h2 className="text-2xl font-bold text-center mb-6">
            Elevate Your Space with <span className="fancy-text">Elegant</span><br /> Home Decor
          </h2>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop
          >
            {banners.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="shadow-xl rounded-2xl p-6 text-center container-img-banner">
                  <img
                    src={`http://187.124.157.146:5001/${item.image}`}
                    alt={item.title}
                    style={{ width: '100%', height: '470px', objectFit: 'cover' }}
                  />
                  <br />
                  <button
                    className="banner-btn-one-1 container-btn-banner"
                    onClick={() => window.location.href = item.link}
                  >
                    Buy Now
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="banner-home category-bg-bottom">
        <div className="category-banner-text">
          <h1 className="category-heading-bottom">
            Discover the <span className="fancy-text">Perfect</span> Blend of<br />
            Elegance & Functionality
          </h1>
          <button className="banner-btn-one-1" onClick={() => window.location.href = '/small-ceramics'}>Explore Now</button>
        </div>
      </div>

      <div className="row content_row">
        <div className="col-md-12 content-section mobile-main-bottom-sec">
          <div className="content-define bottom-left-twin-sec mobile-bottom-left-twin-sec">
            <div className="btn-div-content">
              <h4>Stylish, Sleek, And <span className="fancy-text">Perfect For Bedside</span><br />Or Workspace Ambiance</h4>
              <button className="banner-btn-one" onClick={() => window.location.href = '/rope-lamps'}>Buy Now</button>
            </div>
          </div>
          <div className="bottom-right-twin-sec">
            <div className="top-right-banner">
              <div className="btn-div-content-twin">
                <h4>Classic <span className="fancy-text">Designs</span> With<br /> A Modern Twist</h4>
                <button className="banner-btn-one" onClick={() => window.location.href = '/ceramic-vases'}>Buy Now</button>
              </div>
            </div>
            <div className="bottom-right-banner">
              <div className="btn-div-content-twin">
                <h4><span className="fancy-text">Handpicked</span> Pieces<br /> That Stand Out</h4>
                <button className="banner-btn-one" onClick={() => window.location.href = '/natural-vine-lamps'}>Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPart;
