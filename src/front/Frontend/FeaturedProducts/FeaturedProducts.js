import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../../../assets/css/banner.css';

const API_URL = 'http://187.124.157.146:5001/api/banners';
const FILE_BASE = 'http://187.124.157.146:5001/';

const Banner = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadBanners() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const items = [];
        (data || []).forEach((b) => {
          (b.images || []).forEach((img, idx) => {
            const clean = String(img || '').trim();
            const url = clean.startsWith('http')
              ? clean
              : FILE_BASE + (clean.startsWith('/') ? clean.slice(1) : clean);
            items.push({
              id: `${b.id}-${idx}`,
              title: b.title || '',
              image: url,
            });
          });
        });

        if (alive) setSlides(items);
      } catch (e) {
        if (alive) setErr('Failed to load banners.');
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadBanners();
    return () => { alive = false; };
  }, []);

  // Title ke last 3 words fancy-text me wrap
  const renderFancyTitle = (title) => {
    const t = (title || '').trim().replace(/\s+/g, ' ');
    if (!t) return null;

    const parts = t.split(' ');
    const k = Math.min(3, parts.length); // agar 3 se kam words hon to jitne hain utne hi
    const normal = parts.slice(0, parts.length - k).join(' ');
    const fancy = parts.slice(parts.length - k).join(' ');

    return (
      <h1 className="banner-title">
        {normal && <>{normal} </>}
        <span className="fancy-text">{fancy}</span>
      </h1>
    );
  };

  const hasSlides = slides.length > 0;

  return (
    <div className="container-banner">
      {loading && (
        <div className="banner-home skeleton">
          <div className="banner-text"><h3>Loading…</h3></div>
        </div>
      )}

      {!loading && !hasSlides && (
        <div className="banner-home fallback">
          <div className="banner-text"><h3>{err || 'No banners found'}</h3></div>
        </div>
      )}

      {hasSlides && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          speed={700}
          className="banner-swiper"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id}>
              <div
                className="banner-home"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.05) 100%), url(${s.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                aria-label={s.title}
              >
                <div className="banner-text">
                  {renderFancyTitle(s.title)}
                  <div className="banner-btn">
                    <button className="banner-btn-one" onClick={() => navigate('/shop')}>
                      View All Products
                    </button>
                    <button className="banner-btn-two" onClick={() => navigate('/shop')}>
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;
