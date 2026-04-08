import React, { useState, useEffect } from 'react';

const Content = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch('http://187.124.157.146:5001/api/policies/privacy-policy');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setTitle(data.title || 'Refund Policy');
        setDescription(data.description || 'No description found.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <div className="main-aboutpage-content">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          {/* <h1>{title}</h1> */}
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </>
      )}
    </div>
  );
};

export default Content;
