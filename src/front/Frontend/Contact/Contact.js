import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';

const Shop = () => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/contact')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data); // Debug log
        setContactData(data);
      })
      .catch(err => console.error('Error fetching contact data:', err));
  }, []);

  if (!contactData) return <div>Loading...</div>;

  // ✅ Extract src from mapContent if it's a full iframe tag
  let mapSrc = '';
  if (contactData.mapContent && contactData.mapContent.includes('iframe')) {
    const match = contactData.mapContent.match(/src="([^"]+)"/);
    if (match) {
      mapSrc = match[1];
    }
  } else {
    mapSrc = contactData.map_content; 
  }

  return (
    <div className="main-blogpage">
      <Navbar />
      <InnerBanner bannerImage={`http://187.124.157.146:5001/${contactData.banner_image}`} />

      <div className="container">
        <div className="col-md-12 social-contact-main-container">
          <div className="col-md-4 column-social-details">
            <i className="fa fa-phone"></i>
            <h3>Phone</h3>
            <h5>{contactData.phone}</h5>
          </div>
          <div className="col-md-4 column-social-details">
            <i className="fa fa-envelope"></i>
            <h3>Email</h3>
            <h5><a href="mailto:info@continentalhome.com" target="_blank">{contactData.email}</a></h5>
          </div>
          <div className="col-md-4 column-social-details">
            <i className="fa fa-map"></i>
            <h3>Address</h3>
            <h5>{contactData.address}</h5>
          </div>
        </div>

        <div className="col-md-12 contact-address-section">
          <div className="col-md-6 desktop-map-iframe">
            <div className="map">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title="map"
                  width="100%"
                  height="300"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <p>Map is not available.</p>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form">
              <h2>GET IN <span className="fancy-text">TOUCH</span></h2>
              <div className="col-md-12 fomr-input-field">
                <div className="col-md-12"><input type="text" placeholder=" Your Name*" required /></div>
                <div className="col-md-12"><input type="text" placeholder=" Phone*" required /></div>
              </div>
              <div className="col-md-12 fomr-input-field">
                <div className="col-md-12"><input type="email" placeholder=" Email Address*" required /></div>
                <div className="col-md-12"><input type="text" placeholder=" Order Number*" required /></div>
              </div>
              <div className="col-md-12">
                <div className="col-md-12"><input type="text" placeholder=" Company Name*" required /></div>
                <div className="col-md-12"><input type="text" placeholder=" RMA Number" required /></div>
              </div>
              <textarea placeholder=" Comments/Questions" required></textarea><br />
              <button type="submit" className="banner-btn-one">Send Request</button>
            </div>
          </div>

 <div className="col-md-6 mobile-map-iframe">
            <div className="map">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title="map"
                  width="100%"
                  height="300"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <p>Map is not available.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
