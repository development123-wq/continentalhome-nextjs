import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Details = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    if (!id) {
      setError('No blog ID provided');
      setLoading(false);
      return;
    }

    fetch(`http://187.124.157.146:5001/api/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blog data');
        return res.json();
      })
      .then(data => {
        setBlog(data.blog); // Adjusted based on your API response
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container py-5">Loading blog...</div>;
  if (error) return <div className="container py-5 text-danger">Error: {error}</div>;
  if (!blog) return <div className="container py-5">No blog found.</div>;

  return (
    <div className="main-blog-details">
      <Navbar />

      <style>{`
        .blog-description h2 {
          margin-top: 40px;
          font-size: 28px;
          font-weight: bold;
        }

        .blog-description h3 {
          margin-top: 30px;
          font-size: 24px;
        }

        .blog-description p,
        .blog-description li {
          font-size: 18px;
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .blog-description ul,
        .blog-description ol {
          padding-left: 20px;
        }

        .blog-description img {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
        }

        .short-description {
          font-size: 20px;
          color: #555;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="container mt-5 mb-5">
        <h1 className="mb-3">{blog.title}</h1>
        <p className="text-muted mb-2">
          <i className="fa fa-user-o"></i> {blog.author_name} |{' '}
          <i className="fa fa-clock-o"></i> {new Date(blog.publish_date_time).toLocaleDateString()}
        </p>

       

        <img
          src={`http://187.124.157.146:5001/${blog.image}`}
          alt={blog.title}
          className="img-fluid rounded mb-4"
          style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
        />

        <div className="blog-description" dangerouslySetInnerHTML={{ __html: blog.description }}></div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;
