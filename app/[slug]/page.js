"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import { getProductById } from "../product-details/APIData.js";
import RelatedProducts from "../related/RelatedProducts";
import axios from "axios";

const BASE_URL = "http://187.124.157.146:5001/";

// Utility function for cleaning text
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/�/g, "")
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// slug -> product fetch
const getProductBySlug = async (slug) => {
  try {
    const res = await fetch(
      `${BASE_URL}api/products?search=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch product by slug");

    const data = await res.json();
    const products = data?.products || [];

    const exactMatch = products.find(
      (item) => item?.slug?.toLowerCase() === slug?.toLowerCase()
    );

    return exactMatch || null;
  } catch (err) {
    console.error("Slug fetch error:", err);
    return null;
  }
};

// ZoomImage component
const ZoomImage = ({ src, width = 500, height = 500 }) => {
  const [backgroundPos, setBackgroundPos] = useState("0% 0%");
  const [isHover, setIsHover] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPos(`${x}% ${y}%`);
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
        cursor: "zoom-in",
        backgroundImage: `url(${src})`,
        backgroundSize: isHover ? "200%" : "100%",
        backgroundPosition: backgroundPos,
        backgroundRepeat: "no-repeat",
        transition: "background-size 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
};

const ProductDetails = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);

        if (!slug) {
          if (isMounted) {
            setProduct(null);
            setSelectedImage(null);
            setLoading(false);
          }
          return;
        }

        const slugProduct = await getProductBySlug(slug);

        if (!slugProduct?.id) {
          if (isMounted) {
            setProduct(null);
            setSelectedImage(null);
            setLoading(false);
          }
          return;
        }

        const res = await getProductById(slugProduct.id);
        const prod = res?.product || res;

        if (isMounted) {
          if (prod && prod.id) {
            const cleanedProduct = {
              ...prod,
              name: cleanText(prod.name),
              description: cleanText(prod.description),
              sku: cleanText(prod.sku),
            };

            setProduct(cleanedProduct);
            setSelectedImage(
              prod?.main_image ? `${BASE_URL}${prod.main_image}` : null
            );
          } else {
            setProduct(null);
            setSelectedImage(null);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) {
          setProduct(null);
          setSelectedImage(null);
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!product) return;

    const productData = {
      id: product.id,
      categoryId: product.categoryId || product.category_id || null,
      name: product.name,
      slug: product.slug || slug,
      image: selectedImage || `${BASE_URL}${product.main_image}`,
      price: product.price,
      quantity: quantity,
    };

    const existingCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) => String(item.id) === String(productData.id)
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += productData.quantity;
    } else {
      existingCart.push(productData);
    }

    sessionStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/add-to-cart");
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();

    if (!product?.id) return;

    const payload = {
      guestId: "abc-1234",
      productId: Number(product.id),
      quantity: quantity,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}api/wishlists/add`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Wishlist Response:", res.data);
      alert(`Product "${product.name}" has been added successfully!`);
    } catch (err) {
      console.error("API Error:", err?.response?.data || err.message);
      alert("Failed to add to wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="main-productdetailspage">
        <Navbar />
        <InnerBanner />
        <div className="product-container">
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="main-productdetailspage">
        <Navbar />
        <InnerBanner />
        <div className="product-container">
          <p>Product not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="main-productdetailspage">
      <Navbar />
      <InnerBanner />

      <div className="product-container">
        <div className="row product_row">
          <div className="col-md-12 product-section">
            <div
              className="col-md-12 productdetails-main-container"
              style={{ width: "100%" }}
            >
              <div
                className="col-md-6 main-image-container main2-image-container"
                style={{
                  background: "#fff",
                  margin: "20px",
                  height: "710px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ZoomImage
                  src={selectedImage || `${BASE_URL}${product.main_image}`}
                  width={400}
                  height={400}
                />

                {Array.isArray(product.images) && product.images.length > 0 && (
                  <div
                    className="gallery-thumbnails"
                    style={{
                      display: "flex",
                      marginTop: "15px",
                      gap: "10px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {product.images.map((img, index) => {
                      const imageUrl = `${BASE_URL}${img}`;
                      return (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          onClick={() => setSelectedImage(imageUrl)}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            border:
                              selectedImage === imageUrl
                                ? "2px solid #007bff"
                                : "1px solid #ccc",
                            cursor: "pointer",
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="col-md-6 productdetails-section">
                <h3 className="product-title">{product.name}</h3>
                <p className="price">${product.price}</p>

                <div
                  className="product-desc"
                  dangerouslySetInnerHTML={{
                    __html: product.description || "No description available",
                  }}
                />

                <p>
                  <b>Product Code:</b> {product.sku}
                </p>

                <form className="form-atc" onSubmit={handleAddToCart}>
                  <label>Quantity</label>
                  <br />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                      marginTop: "5px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      style={{
                        width: "50px",
                        textAlign: "center",
                        margin: "0 10px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button type="submit">Buy Now</button>
                  <button type="button" onClick={handleWishlistClick}>
                    <i className="fa fa-heart"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-12 related-products-conatiner">
            <h2>
              Related <span className="fancy-text">Products</span>
            </h2>
            <RelatedProducts />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;