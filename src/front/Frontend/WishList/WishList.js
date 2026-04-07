import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import InnerBanner from '../InnerBanner/InnerBanner';
import b1 from '../../../assets/images/banner/category-banner-back.jpg';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const guestId = 'abc-1234';

  /* Fetch wishlist */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://187.124.157.146:5001/api/wishlists?guestId=${guestId}`
        );
        setWishlistItems(Array.isArray(res.data?.items) ? res.data.items : []);
      } catch (err) {
        console.error('Error fetching wishlist:', err?.response || err);
        setWishlistItems([]);
      }
    })();
  }, []);

  /* DELETE item */
  const handleDelete = async (productId) => {
    const token = sessionStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      await axios.delete(
        'http://187.124.157.146:5001/api/wishlists/remove',
        {
          headers,
          data: { guestId, productId },
        }
      );

      setWishlistItems((prev) =>
        prev.filter((it) => it.product_id !== productId)
      );
      alert('Item removed from wishlist successfully.');
    } catch (err) {
      console.error('Error removing item:', err?.response || err);
      alert(
        `Failed to remove item.${
          err?.response?.data?.message ? '\n' + err.response.data.message : ''
        }`
      );
    }
  };

  return (
    <>
      <Navbar />
      <InnerBanner name="Wishlist" image={b1} />

      <div style={{ padding: 30 }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <thead>
            <tr style={{ background: '#63a682', color: '#fff' }}>
              <th style={th}>Image</th>
              <th style={th}>Product ID</th>
              <th style={th}>Price</th>
              <th style={th}>Total</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.length ? (
              wishlistItems.map((it, idx) => (
                <tr
                  key={it.product_id}
                  style={{ background: idx % 2 ? '#f8f8f8' : '#fff' }}
                >
                  <td style={td}>
                    <img
                      src={`http://187.124.157.146:5001/${it.main_image}`}
                      alt=""
                      style={imgStyle}
                    />
                  </td>
                  <td style={td}>#{it.product_id}</td>
                  <td style={td}>${it.price}</td>
                  <td style={td}>${it.price}</td>
                  <td style={td}>
                    <button
                      style={delBtn}
                      onClick={() => handleDelete(it.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>
                  No wishlist items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
}

const th = { padding: 15, textAlign: 'left' };
const td = { padding: 15, textAlign: 'left', verticalAlign: 'middle' };
const imgStyle = {
  width: 100,
  height: 100,
  objectFit: 'contain',
  borderRadius: 10,
};
const delBtn = {
  padding: '8px 15px',
  background: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default Wishlist;
