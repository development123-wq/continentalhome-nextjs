import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';

const Shop = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://187.124.157.146:5001/api/blogs?search=&page=1&limit=10')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        setBlogs(data.blogs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-blogpage">
      <Navbar />
      <InnerBanner />

      <div className="product-container">
        <div className="row product_row">
          <div className="col-md-12 product-section blog-section">
            {blogs.length === 0 && <p>No blogs found.</p>}
            {blogs.map(blog => (
              
              <div key={blog.id} className="product-define">
                
                {/* Construct image URL (assuming base URL) */}
                <a href={`/details?id=${blog.id}`}>
                <img src={`http://187.124.157.146:5001/${blog.image}`} alt={blog.title} style={{width:'100%',borderRadius:'10px',marginBottom:'10px',height:'250px',objectFit:'cover'}}/>                
                <h3 className="blog-page-title">{blog.title}</h3></a>
                <p className="description">{blog.short_description}</p>
                <p className="description">
                  <i className="fa fa-clock-o"></i> {new Date(blog.publish_date_time).toLocaleDateString()} |{' '}
                  <i className="fa fa-user-o"></i> {blog.author_name}
                </p>
                <button onClick={()=>window.location.href=`/details?id=${blog.id}`}><i className="fa fa-book"></i> Read More</button>
             

              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
