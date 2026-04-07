import React, { useState } from 'react';
import '../../../assets/css/Footer.css';
import logo from '../../../assets/images/logo-footer.png';
import axios from 'axios';
import progress from '../../../assets/loader.gif'; 
import Image from "next/image";


const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <- loading state

  const handleSubscribe = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setIsLoading(true); // start loader
    try {
      await axios.post(
        'http://187.124.157.146:5001/api/stats/subscribe',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage('Thank you for subscribing!');
      setEmail('');
      // stop loader once message is set
      setIsLoading(false);

      // auto close after 2s
      setTimeout(() => {
        setMessage('');
        setShowModal(false);
      }, 2000);
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      setIsLoading(false); // stop loader on error
      alert('Subscription failed. Please try again later.');
    }
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <h4 style={{ marginBottom: '20px' }}>Subscribe to Newsletter</h4>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <button
              className="btn btn-primary"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Subscribe'}
            </button>

            <button
              className="btn btn-secondary ms-2"
              onClick={() => !isLoading && setShowModal(false)}
              disabled={isLoading}
            >
              Close
            </button>

            {message && <p className="mt-3 text-success">{message}</p>}

            {/* Loader Overlay inside modal (only when loading) */}
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#e6e6e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px'
                }}
              >
                <Image
                  src={progress}
                  alt="footerimage"
                  style={{ width: 60, height: 60, objectFit: 'contain',borderRadius:'100px' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-main-container">
        <div className="container" style={{ maxWidth: '1200px', padding: '20px 20px', color: '#fff' }}>
          <div className="row" style={{ display: 'flex',paddingTop:'40px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div className="newsletter-footer" style={{display:'none'}}>
              <h2 style={{ fontSize: '28px', letterSpacing: '2px' }}>NEWSLETTER</h2>
              <p style={{ margin: '10px 0 20px' }}>
                Receive Our Newsletter And Discover Our Stories, Collections, And Surprises.
              </p>
              <button className="banner-btn-one" onClick={() => setShowModal(true)}>Subscribe</button>
            </div>

            <div className="footer-col main-bottom-footer" style={{ flex: '1 1 350px', marginBottom: '30px' }}>
              <div className="footer-logo">
                <Image src={logo} alt="Logo" style={{ marginRight: '10px' }} />
              </div>
              <p style={{ marginTop: '0px', fontSize: '14px', lineHeight: '2' }}>
                For more than 35 years, Continental Home has been dedicated to bringing beautifully crafted, design‑forward home décor to retailers across the country. What began as a single idea and a commitment to hard work has grown into a trusted wholesale partner known for quality, craftsmanship, and exceptional customer experience.
              </p>
            </div>

            <div className="footer-col" style={{ flex: '1 1 400px', marginBottom: '30px', paddingLeft: '50px' }}>
              <h3 style={{marginBottom:'20px'}}>CATEGORIES</h3>
              <ul style={{ listStyle: 'none', padding: 0, columnCount:'2' }}>
                <li><a href="/new-arrivals" className="footer-menu">New Arrivals</a></li>
                 <li><a href="/floor-lamps" className="footer-menu">Floor Lamps</a></li>
                  <li><a href="/ceramic-lamp" className="footer-menu">Ceramic Lamps</a></li>
                 <li><a href="/driftwood-lamps" className="footer-menu">Driftwood Lamps</a></li>
                 <li><a href="/natural-vine-lamps" className="footer-menu">Natural Vine Lamps</a></li>
                 <li><a href="/rope-lamps" className="footer-menu">Rope Lamps</a></li>
                 <li><a href="/teak-lamps" className="footer-menu">Teak Lamps</a></li>
                 <li><a href="/havana-lamp-collection" className="footer-menu">Havana Collection</a></li>
                 <li><a href="/rope-lamps" className="footer-menu">Rope Collection</a></li>
                 <li><a href="/salvaged-unique-lamps" className="footer-menu">Salvaged & Unique</a></li>
                 <li><a href="/ceramic-vases" className="footer-menu">Ceramic Vases</a></li>
                 <li><a href="/small-ceramics" className="footer-menu">Small Ceramics</a></li>
                 <li><a href="/decorative-objects" className="footer-menu">Decorative Objects</a></li>
                 <li><a href="/sculptural-pieces" className="footer-menu">Sculptural Pieces</a></li>
               
                
              </ul>
            </div>

            <div className="footer-col" style={{ flex: '1 1 200px', marginBottom: '30px' }}>
              <h3 style={{marginBottom:'20px'}}>QUICK LINKS</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/" className="footer-menu">HOME</a></li>
                <li><a href="/about" className="footer-menu">ABOUT US</a></li>
                <li><a href="/shop" className="footer-menu">SHOP</a></li>
                {/* <li><a href="/blogs" className="footer-menu">BLOGS</a></li> */}
                <li><a href="/faqs" className="footer-menu">FAQ</a></li>
                <li><a href="/contact" className="footer-menu">CONTACT US</a></li>
              </ul>
            </div>

            <div className="footer-col" style={{ flex: '1 1 200px', marginBottom: '30px', paddingLeft: '0px' }}>
              <h3 style={{marginBottom:'20px'}}>REACH US</h3>
              <p><i className="fa fa-phone"></i> 603-886-3200</p>
              <p><i className="fa fa-envelope"></i> <a href="mailto:info@continentalhome.com" target="_blank" style={{color:'#fff'}}>info@continentalhome.com</a></p>
              <p><i className="fa fa-map"></i> 25 Front St Nashua, NH 03064</p>
            </div>
          </div>

          <div className="footer-copyright social_icons" style={{ textAlign: 'center', borderTop: '1px solid #555', paddingTop: '20px', marginTop: '20px' }}>
            <p>©Copyright | Continental Home | All Rights Reserved</p>
            <div style={{display:'none'}}>
              <a href="#"><i className="fa fa-instagram"></i></a>
              <a href="#"><i className="fa fa-twitter"></i></a>
              <a href="#"><i className="fa fa-linkedin"></i></a>
              <a href="#"><i className="fa fa-facebook"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
