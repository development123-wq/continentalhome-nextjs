import React, { useState, useEffect } from 'react';

const Content = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const baseURL = 'http://187.124.157.146:5001/'; // Base URL for images

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/aboutus')
      .then((res) => res.json())
      .then((data) => {
        setAboutUsData(data.aboutUs);
      })
      .catch((err) => console.error('Error fetching about us data:', err));
  }, []);

  if (!aboutUsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-aboutpage-content">
      
      {/* About Us Section */}
      <div className="col-md-12 aboutus-content">


          <div className="col-md-6 right-container-content mobile-aboutus-image">
          <img
            src={baseURL + aboutUsData.banner_image.replace(/\\/g, '/')}
            alt="About Us Banner"
            style={{ maxWidth: '100%',  height: '500px',objectFit:'cover' }}
          />
        </div>

        <div className="col-md-6 left-container-content">
          <h1>
            About <span className="fancy-text">Continental Home</span>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: aboutUsData.description }} />
          <p><strong>Phone:</strong> 603-886-3200</p>
          <p><strong>Fax:</strong> 603-886-3210</p>
          <p><strong>Email:</strong> <a href="mailto:info@continentalhome.com" target="_blank">info@continentalhome.com</a></p>
        </div>
        <div className="col-md-6 right-container-content desktop-aboutus-image">
          <img
            src={baseURL + aboutUsData.banner_image.replace(/\\/g, '/')}
            alt="About Us Banner"
            style={{ maxWidth: '100%',  height: '500px',objectFit:'cover' }}
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="col-md-12 aboutus-content">
        <div className="col-md-6 right-container-content mission-about-image" style={{ paddingRight: '50px' }}>
          <img
            src={baseURL + aboutUsData.mission_image.replace(/\\/g, '/')}
            alt="Mission Banner"
            style={{ maxWidth: '100%',  height: '400px',objectFit:'cover' }}
          />
        </div>
        <div className="col-md-6 left-container-content">
          <h1>{aboutUsData.mission_title}</h1>
          <div dangerouslySetInnerHTML={{ __html: aboutUsData.mission_description }} />
        </div>
      </div>

      {/* Vision Section */}
      <div className="col-md-12 aboutus-content">

         <div className="col-md-6 right-container-content ourvision-about-us-mobile">
          <img
            src={baseURL + aboutUsData.vision_image.replace(/\\/g, '/')}
            alt="Vision Banner"
            style={{ maxWidth: '100%', height: '400px',objectFit:'cover' }}
          />
        </div>
        <div className="col-md-6 left-container-content">
          <h1>{aboutUsData.vision_title}</h1>
          <div dangerouslySetInnerHTML={{ __html: aboutUsData.vision_description }} />
        </div>
        <div className="col-md-6 right-container-content ourvision-about-us-desktop">
          <img
            src={baseURL + aboutUsData.vision_image.replace(/\\/g, '/')}
            alt="Vision Banner"
            style={{ maxWidth: '100%', height: '400px',objectFit:'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
