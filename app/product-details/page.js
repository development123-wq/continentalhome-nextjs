"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import { getProductById } from "./APIData.js";
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

const ProductDetails = ({ params }) => {
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);

        if (!id) {
          if (isMounted) {
            setProduct(null);
            setLoading(false);
          }
          return;
        }

        const res = await getProductById(id);
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
            setSelectedImage(`${BASE_URL}${prod.main_image}`);
          } else {
            console.error("Product not found or API error:", res);
            setProduct(null);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) {
          setProduct(null);
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!product) return;

    const productData = {
      id: product.id,
      categoryId: product.categoryId || product.category_id || null,
      name: product.name,
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
        "http://187.124.157.146:5001/api/wishlists/add",
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

  return (
    <div className="main-ProductDetailspage">
      <Navbar />
      <InnerBanner />

      <div className="product-container">
        <div className="row product_row">
          <div className="col-md-12 product-section">
            {loading ? (
              <p>Loading product...</p>
            ) : product ? (
              <div
                className="col-md-12 product-details-main-container"
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

                <div className="col-md-6 product-details-section">
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
            ) : (
              <p>Product not found.</p>
            )}
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