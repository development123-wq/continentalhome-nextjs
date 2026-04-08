"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import logo from "../../public/assets/images/logo.png";
import cartImg from "../../public/assets/images/cart.png";
import accountImg from "../../public/assets/images/account.png";
import wishlistImg from "../../public/assets/images/wishlist.png";
import "../../public/assets/css/Navbar.css";

const API_BASE = "http://187.124.157.146:5001";

const staticCategories = [
  { id: 1, name: "NEW ARRIVALS", slug: "categories/new-arrivals" },
  {
    id: 2,
    name: "LIGHTING",
    slug: "categories/lighting",
    subcategories: [
      { id: 21, name: "Table Lamps", slug: "categories/table-lamps", hasNested: true },
      { id: 22, name: "Floor Lamps", slug: "categories/floor-lamps", hasNested: false },
      { id: 23, name: "Lamp Collections", slug: "categories/lamp-collections", hasNested: true },
    ],
    nestedItems: {
      21: [
        { name: "Ceramic Lamps", slug: "categories/ceramic-lamps" },
        { name: "Driftwood Lamps", slug: "categories/driftwood-lamps" },
        { name: "Natural Vine Lamps", slug: "categories/natural-vine-lamps" },
        { name: "Rope Lamps", slug: "categories/rope-lamps" },
        { name: "Teak Lamps", slug: "categories/teak-lamps" },
        { name: "Capiz Lamps", slug: "categories/capiz-lamps" },
      ],
      23: [
        { name: "Havana Collection", slug: "categories/havana-lamp-collection" },
        { name: "Rope Collection", slug: "categories/new-rope-lamps" },
        { name: "Salvaged & Unique", slug: "categories/salvaged-unique-lamps" },
      ],
    },
  },
  {
    id: 3,
    name: "HOME DÉCOR",
    slug: "categories/home-decor",
    subcategories: [
      { id: 31, name: "Ceramic Vases", slug: "categories/ceramic-vases", hasNested: false },
      { id: 32, name: "Small Ceramics", slug: "categories/small-ceramics", hasNested: false },
      { id: 33, name: "Decorative Objects", slug: "categories/decorative-objects", hasNested: false },
      { id: 34, name: "Sculptural Pieces", slug: "categories/sculptural-pieces", hasNested: false },
    ],
  },
  {
    id: 4,
    name: "SHOP BY MATERIAL",
    slug: "shop",
    subcategories: [
      { id: 41, name: "Ceramic", slug: "categories/ceramic", hasNested: false },
      { id: 42, name: "Driftwood", slug: "categories/driftwood", hasNested: false },
      { id: 43, name: "Teak", slug: "categories/teak", hasNested: false },
      { id: 44, name: "Capiz", slug: "categories/capiz", hasNested: false },
      { id: 45, name: "Rope", slug: "categories/rope", hasNested: false },
      { id: 46, name: "Natural Vine", slug: "categories/natural-vine", hasNested: false },
    ],
  },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredSubcategoryId, setHoveredSubcategoryId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ FIX: false by default (SSR safe)
  const [isSearching, setIsSearching] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const searchRef = useRef(null);

  // ✅ FIX 1: SSR-safe isMobile — window Next.js server pe crash karta tha
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ FIX 2: Click outside → dropdown band hoga
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cart count
  useEffect(() => {
    const count = sessionStorage.getItem("cartItemCount");
    setCartCount(Number(count) || 0);
  }, []);

  // ✅ FIX 3: Debounced search — sahi API response parsing
  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`${API_BASE}/api/products`, {
          params: { search: trimmed, page: 1, limit: 10 },
        });

        // ✅ FIX 4: Multiple fallback keys — koi bhi API structure ho kaam karega
        const raw = res?.data;
        let products = [];
        if (Array.isArray(raw)) {
          products = raw;
        } else if (Array.isArray(raw?.products)) {
          products = raw.products;
        } else if (Array.isArray(raw?.data)) {
          products = raw.data;
        }

        setSearchResults(products.slice(0, 8));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Search error:", err?.response?.data || err.message);
        setSearchResults([]);
        setShowSearchDropdown(true);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getNestedItems = (categoryId, subId) => {
    const cat = staticCategories.find((c) => c.id === categoryId);
    return cat?.nestedItems?.[subId] || [];
  };

  const handleCatToggle = (e, id) => {
    if (isMobile) {
      e.stopPropagation();
      setHoveredCategoryId((prev) => (prev === id ? null : id));
      setHoveredSubcategoryId(null);
    }
  };

  const handleSubToggle = (e, id) => {
    if (isMobile) {
      e.stopPropagation();
      setHoveredSubcategoryId((prev) => (prev === id ? null : id));
    }
  };

  // ✅ FIX 5: Broken image fallback per product
  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="container" style={{ maxWidth: "100%" }}>
      <div className="row">
        <header>
          {/* ✅ FIX 6: position:relative + zIndex:1000 — dropdown hamesha visible rahega */}
          <nav
            className="navbar"
            style={{ padding: "10px", position: "relative", zIndex: 1000 }}
          >
            {/* LOGO */}
            <div className="logo cutom-logo-mobile">
              <a href="/">
                <Image
                  src={logo}
                  alt="Logo"
                  style={{ width: "230px", padding: "10px 0" }}
                />
              </a>
            </div>

            {/* HAMBURGER */}
            <div className="hamburger" onClick={() => setMenuOpen((o) => !o)}>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>

            {/* ✅ SEARCH BAR — zIndex:1100 taaki dropdown sab ke upar rahe */}
            <div
              ref={searchRef}
              className="search-bar"
              style={{ position: "relative", width: "100%", zIndex: 1100 }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center", 
                  width: "100%"
                  
                }}
              >
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="headersearch"
                  value={searchQuery}
                  autoComplete="off"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2)
                      setShowSearchDropdown(true);
                  }}
                  style={{ width: "100%", paddingRight: "44px" }}
                />
                {/* ✅ FIX 7: Search button — shop page pe redirect karta hai */}
                <button
                  type="button"
                  aria-label="Search"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#555",
                    fontSize: "16px",
                    padding: "4px 6px",
                  }}
                  onClick={() => {
                    const q = searchQuery.trim();
                    if (q.length >= 2) {
                      window.location.href = `/shop?search=${encodeURIComponent(q)}`;
                    }
                  }}
                >
                  <i className="fa fa-search" />
                </button>
              </div>

              {/* ✅ SEARCH RESULTS DROPDOWN */}
              {showSearchDropdown && (
                <ul
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    zIndex: 9999,
                    maxHeight: "380px",
                    overflowY: "auto",
                    listStyle: "none",
                    padding: "4px 0",
                    margin: 0,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  {isSearching ? (
                    <li
                      style={{
                        padding: "14px 16px",
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <i className="fa fa-spinner fa-spin" />
                      Searching...
                    </li>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => {
                      const pid = product.id || product._id;
                      const imgSrc = imgErrors[pid]
                        ? "/placeholder.jpg"
                        : `${API_BASE}/${product.main_image}`;

                      return (
                        <li
                          key={pid}
                          style={{ borderBottom: "1px solid #f3f3f3" }}
                        >
                          <a
                            href={`/productdetails?id=${pid}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 14px",
                              textDecoration: "none",
                              color: "#222",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f8f8f8")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                            onClick={() => {
                              setShowSearchDropdown(false);
                              setSearchQuery("");
                            }}
                          >
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "6px",
                                overflow: "hidden",
                                flexShrink: 0,
                                background: "#f0f0f0",
                              }}
                            >
                              <Image
                                src={imgSrc}
                                alt={product.name || "Product"}
                                width={48}
                                height={48}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                                onError={() => handleImgError(pid)}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "14px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#777",
                                  marginTop: "2px",
                                }}
                              >
                                ${product.price ?? "N/A"}
                              </div>
                            </div>
                            <i
                              className="fa fa-arrow-right"
                              style={{
                                fontSize: "12px",
                                color: "#bbb",
                                flexShrink: 0,
                              }}
                            />
                          </a>
                        </li>
                      );
                    })
                  ) : (
                    <li
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#999",
                        fontSize: "14px",
                      }}
                    >
                      No products found for &quot;{searchQuery}&quot;
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* USER ACTIONS */}
            <div
              className="user-actions custom-header-account"
              style={{ display: "flex", alignItems: "center" }}
            >
              <a href="/wishlist" className="account">
                <span className="account-icon">
                  <Image
                    src={wishlistImg}
                    className="topbar-img"
                    style={{ width: "20px" }}
                    alt="Wishlist"
                  />
                </span>
                <span className="account-text">Wishlist</span>
              </a>

              <a href="/sign-in" className="account">
                <span className="account-icon">
                  <Image
                    src={cartImg}
                    className="topbar-img"
                    style={{ width: "20px" }}
                    alt="Account"
                  />
                </span>
                <span className="account-text">Account</span>
              </a>

              <a
                href="/add-to-cart"
                className="cart"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className="cart-icon">
                  <Image
                    src={accountImg}
                    className="topbar-img"
                    style={{ width: "20px" }}
                    alt="Cart"
                  />
                </span>
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-10px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "0 6px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
                <span
                  className="cart-text"
                  style={{ marginLeft: "8px", fontSize: "18px" }}
                >
                  Cart
                </span>
              </a>
            </div>
          </nav>
        </header>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="row nav-bottom">
        <div
          className="col-md-12 bottom_header_row"
          style={{
            display: "flex",
            margin: "auto",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <div className="col-md-8" style={{ padding: "7px", margin: "auto" }}>
            <ul
              className={`nav-links ${menuOpen ? "active" : ""}`}
              style={{ marginBottom: "0px" }}
            >
              <li>
                <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
              </li>
              <li>
                <a href="/about" onClick={() => setMenuOpen(false)}>About Us</a>
              </li>
              <li>
                <a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a>
              </li>

              <li
                style={{ position: "relative" }}
                onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
                onMouseLeave={() => {
                  if (!isMobile) {
                    setIsDropdownOpen(false);
                    setHoveredCategoryId(null);
                    setHoveredSubcategoryId(null);
                  }
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => isMobile && setIsDropdownOpen((o) => !o)}
                >
                  <a href="#">
                    Categories{" "}
                    <i
                      className={`fa ${
                        isDropdownOpen ? "fa-angle-up" : "fa-angle-down"
                      }`}
                    />
                  </a>
                </div>

                {isDropdownOpen && (
                  <div
                    className="categoriessubmenu"
                    style={{
                      position: isMobile ? "static" : "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#fff",
                      boxShadow: isMobile ? "none" : "0 8px 25px rgba(0,0,0,0.15)",
                      zIndex: 1200,
                      width: isMobile ? "100%" : "250px",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      padding: "8px 0",
                      maxHeight: isMobile ? "60vh" : "unset",
                      overflowY: isMobile ? "auto" : "visible",
                    }}
                  >
                    {staticCategories.map((category) => (
                      <div
                        key={category.id}
                        style={{ position: "relative" }}
                        onMouseEnter={() =>
                          !isMobile && setHoveredCategoryId(category.id)
                        }
                      >
                        <div
                          className="categoriessubmenudiv"
                          style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid #f5f5f5",
                            backgroundColor:
                              hoveredCategoryId === category.id
                                ? "#f9f9f9"
                                : "transparent",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <a
                            href={`/${category.slug}`}
                            onClick={() => setMenuOpen(false)}
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#333",
                              textTransform: "uppercase",
                              textDecoration: "none",
                              flexGrow: 1,
                            }}
                          >
                            {category.name}
                          </a>
                          {category.subcategories && (
                            <i
                              className={`fa ${
                                hoveredCategoryId === category.id
                                  ? "fa-angle-up"
                                  : "fa-angle-down"
                              }`}
                              style={{
                                fontSize: "14px",
                                color: "#999",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => handleCatToggle(e, category.id)}
                            />
                          )}
                        </div>

                        {category.subcategories &&
                          hoveredCategoryId === category.id && (
                            <div
                              style={{
                                position: isMobile ? "static" : "absolute",
                                top: 0,
                                left: isMobile ? "0" : "100%",
                                backgroundColor: isMobile ? "#fdfdfd" : "#fff",
                                boxShadow: isMobile
                                  ? "none"
                                  : "0 8px 25px rgba(0,0,0,0.15)",
                                zIndex: 1300,
                                width: isMobile ? "100%" : "250px",
                                borderRadius: "8px",
                                border: isMobile ? "none" : "1px solid #eee",
                                padding: isMobile ? "0 0 0 15px" : "10px 0",
                              }}
                            >
                              {category.subcategories.map((sub) => (
                                <div
                                  key={sub.id}
                                  style={{
                                    padding: "0 12px",
                                    backgroundColor:
                                      hoveredSubcategoryId === sub.id
                                        ? "#f9f9f9"
                                        : "transparent",
                                  }}
                                  onMouseEnter={() =>
                                    !isMobile &&
                                    setHoveredSubcategoryId(sub.id)
                                  }
                                >
                                  <div
                                    className="categoriessubmenudiv2"
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      padding: "8px 0",
                                    }}
                                  >
                                    <a
                                      href={`/${sub.slug}`}
                                      onClick={() => setMenuOpen(false)}
                                      style={{
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        textDecoration: "none",
                                        flexGrow: 1,
                                      }}
                                    >
                                      {sub.name}
                                    </a>
                                    {sub.hasNested && (
                                      <i
                                        className={`fa ${
                                          hoveredSubcategoryId === sub.id
                                            ? "fa-angle-down"
                                            : "fa-angle-right"
                                        }`}
                                        style={{
                                          color: "#999",
                                          padding: "5px 10px",
                                          cursor: "pointer",
                                        }}
                                        onClick={(e) =>
                                          handleSubToggle(e, sub.id)
                                        }
                                      />
                                    )}
                                  </div>

                                  {hoveredSubcategoryId === sub.id &&
                                    getNestedItems(category.id, sub.id)
                                      .length > 0 && (
                                      <div
                                        className="subcategorysub"
                                        style={{
                                          position: isMobile
                                            ? "static"
                                            : "absolute",
                                          top: 0,
                                          left: isMobile ? "0" : "100%",
                                          backgroundColor: "#fff",
                                          width: isMobile ? "100%" : "240px",
                                          borderRadius: "8px",
                                          border: isMobile
                                            ? "none"
                                            : "1px solid #eee",
                                          padding: isMobile
                                            ? "5px 0 10px 15px"
                                            : "12px 0",
                                          zIndex: 1400,
                                          boxShadow: isMobile
                                            ? "none"
                                            : "0 8px 25px rgba(0,0,0,0.15)",
                                        }}
                                      >
                                        {getNestedItems(
                                          category.id,
                                          sub.id
                                        ).map((item) => (
                                          <div
                                            key={item.slug}
                                            style={{ padding: "5px 12px" }}
                                          >
                                            <a
                                              href={`/${item.slug}`}
                                              onClick={() => {
                                                setMenuOpen(false);
                                                setIsDropdownOpen(false);
                                              }}
                                              style={{
                                                color: "#777",
                                                textDecoration: "none",
                                                fontSize: "13px",
                                                display: "block",
                                              }}
                                            >
                                              {item.name}
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <a href="/faqs" onClick={() => setMenuOpen(false)}>Faq</a>
              </li>
              <li>
                <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;