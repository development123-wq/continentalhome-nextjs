import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/Navbar.css';
import logo from '../../../assets/images/logo.png';
import cart from '../../../assets/images/cart.png';
import account from '../../../assets/images/account.png';
import wishlist from '../../../assets/images/wishlist.png';


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const count = sessionStorage.getItem('cartItemCount');
    setCartCount(Number(count) || 0);
  }, []);

  useEffect(() => {
    axios
      .get('http://187.124.157.146:5001/api/categories?search=&page=1&limit=500')
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get(`http://187.124.157.146:5001/api/products?search=${searchQuery}&page=1&limit=500`)
        .then((res) => {
          if (Array.isArray(res.data.products)) {
            setSearchResults(res.data.products);
            setShowSearchDropdown(true);
          }
        })
        .catch((err) => {
          console.error('Search error:', err);
          setSearchResults([]);
          setShowSearchDropdown(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="row">
        <header>
          <nav className="navbar" style={{ padding: '10px' }}>
            <div className="logo cutom-logo-mobile">
              <a href="/"><img src={logo} alt="Logo" /></a>
            </div>

            
            <div className="search-bar" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for products..."
                className="headersearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button><i className="fa fa-search"></i></button>

              {showSearchDropdown && searchResults.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  zIndex: 999,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}
                    >
                      <a
                        href={`/productdetails?id=${product.id}`}
                        style={{
                          textDecoration: 'none',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onClick={() => setShowSearchDropdown(false)}
                      >
                        <img
                          src={`http://187.124.157.146:5001/${product.main_image}`}
                          alt={product.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                        <div style={{ display: 'grid' }}>
                          <span>{product.name}</span>
                          <span style={{ fontSize: '12px', color: '#666' }}>${product.price}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <div className="user-actions custom-header-account" style={{ display: 'flex', alignItems: 'center' }}>
               <a href="/wishlist" className="account">
                <span className="account-icon"><img src={wishlist} className="topbar-img" style={{width:'20px'}}/></span>
                <span className="account-text">Wishlist</span>
              </a>
              <a href="/sign-in" className="account">
                <span className="account-icon"><img src={cart} className="topbar-img" style={{ width: '20px' }} /></span>
                <span className="account-text">Account</span>
              </a>

              <a href="/add-to-cart" className="cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span className="cart-icon" style={{ fontSize: '28px' }}><img src={account} className="topbar-img" style={{ width: '20px' }} /></span>

                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '0 6px',
                    boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                  }}>{cartCount}</span>
                )}

                <span className="cart-text" style={{ marginLeft: '8px', fontSize: '18px' }}>Cart</span>
              </a>
            </div>
          </nav>
        </header>
      </div>

      {/* Navigation Links */}
      <div className="row nav-bottom">
        <div className="col-md-12 bottom_header_row" style={{ display: 'flex', margin: 'auto', width: '100%', maxWidth: '1200px' }}>
          <div className="col-md-12" style={{ padding: '7px',width:'auto',margin:'auto' }}>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`} style={{ marginBottom: '0px' }}>
              <li><a href="/" onClick={() => setMenuOpen(false)}>Home</a></li>
              <li><a href="/about" onClick={() => setMenuOpen(false)}>About Us</a></li>
              <li><a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a></li>

              <li
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => {
                  setIsDropdownOpen(false);
                  setHoveredCategoryId(null);
                }}
                style={{ position: 'relative' }}
              >
                <a href="#">Categories <i className="fa fa-angle-down"></i></a>

                {isDropdownOpen && (
                  <ul
                    className="shop-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      backgroundColor: '#fff',
                      padding: 0,
                      listStyle: 'none',
                      margin: 0,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      minWidth: '250px',
                    }}
                  >
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        onMouseEnter={() => setHoveredCategoryId(category.id)}
                        onMouseLeave={() => setHoveredCategoryId(null)}
                        style={{ padding: '8px 16px', position: 'relative' }}
                      >
                        <a href={`/${category.slug}`}>{category.name}</a>

                        {category.subcategories.length > 0 && hoveredCategoryId === category.id && (
                          <ul className="subcat-menu">
                            {category.subcategories.map((sub) => (
                              <li key={sub.id} style={{ padding: '8px 16px' }}>
                                <a className="subcat" href={`/${sub.slug}`}>{sub.name}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li style={{display:'none' }}><a href="/blogs" onClick={() => setMenuOpen(false)}>Blogs</a></li>
              <li><a href="/faqs" onClick={() => setMenuOpen(false)}>Help</a></li>
              <li><a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            </ul>
          </div>

          {/* <div className="col-md-4 social_icons custom_social_icons" style={{ padding: '7px' }}>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '0rem',
              color: 'white',
              margin: '0rem',
              justifyContent: 'end',
              display:'none' 
            }}>
              <li><i className="fa fa-instagram"></i></li>
              <li><i className="fa fa-twitter"></i></li>
              <li><i className="fa fa-linkedin"></i></li>
              <li><i className="fa fa-facebook"></i></li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
