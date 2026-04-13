"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import axios from "axios";
import RelatedProducts from "@/components/related/RelatedProducts";
import { usePathname } from "next/navigation";

const cleanText = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/\uFFFD/g, "")
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const stripHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (String(path).startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

const getKeywordsContent = (value, product) => {
  const raw = cleanText(value);
  if (raw) return raw;
  return [product?.name, product?.sku].filter(Boolean).join(", ");
};

export default function ProductDetailsClient() {
  const pathname = usePathname();
  const imageBoxRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const slug = useMemo(() => {
    if (!pathname) return "";
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
  }, [pathname]);

  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        setLoading(true);
        setNotFoundState(false);

        const safeSlug = String(slug || "").trim();

        if (!safeSlug) {
          setProduct(null);
          setNotFoundState(true);
          return;
        }

        const encodedSlug = encodeURIComponent(safeSlug);
        const url = `/api/products/slug/${encodedSlug}`;

        const res = await axios.get(url, {
          headers: { Accept: "application/json" },
          timeout: 15000,
        });

        const data = res?.data;
        const prod = data?.product || data?.data || data;

        if (prod && (prod.id || prod.slug || prod.name)) {
          const cleanedProduct = {
            ...prod,
            name: cleanText(prod?.name),
            description: prod?.description || "No description available",
            sku: cleanText(prod?.sku),
            meta_title: cleanText(prod?.meta_title || prod?.metaTitle),
            meta_keyword: cleanText(prod?.meta_keyword || prod?.metaKeyword),
            meta_description: cleanText(
              prod?.meta_description || prod?.metaDescription
            ),
          };

          setProduct(cleanedProduct);
          setSelectedImage(getImageUrl(prod?.main_image));
          setNotFoundState(false);
        } else {
          setProduct(null);
          setNotFoundState(true);
        }
      } catch (error) {
        console.error("Product fetch error =>", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
        });

        setProduct(null);

        if (error?.response?.status === 404) {
          setNotFoundState(true);
        } else {
          setNotFoundState(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductBySlug();
  }, [slug]);

  const handleMouseMove = (e) => {
    const box = imageBoxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product) return;

    const productData = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedImage || getImageUrl(product.main_image),
      price: product.price,
      quantity,
    };

    const existingCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) => item.id === productData.id || item.slug === productData.slug
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += productData.quantity;
    } else {
      existingCart.push(productData);
    }

    sessionStorage.setItem("cart", JSON.stringify(existingCart));
    window.location.href = "/add-to-cart";
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (!product) return;

    const payload = {
      guestId: "abc-1234",
      productId: Number(product?.id),
      quantity,
    };

    try {
      const res = await axios.post("/api/wishlists/add", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      });

      console.log("Wishlist Response:", res.data);
      alert(`Product "${product.name}" has been added successfully!`);
    } catch (err) {
      console.error("Wishlist API Error:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert("Failed to add to wishlist.");
    }
  };

  const pageTitle = product?.meta_title || product?.name || "Product Details";
  const pageDescription =
    product?.meta_description ||
    stripHtml(product?.description) ||
    "Product details page";
  const pageKeywords = getKeywordsContent(product?.meta_keyword, product);
  const pageImage = selectedImage || getImageUrl(product?.main_image);
  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        {pageImage && <meta property="og:image" content={pageImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {pageImage && <meta name="twitter:image" content={pageImage} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Head>

      <div className="product-page">
        <Navbar />

        {!notFoundState && <InnerBanner />}

        <div className="product-wrapper">
          {loading ? (
            <p className="status-text">Loading product...</p>
          ) : notFoundState ? (
            <div className="not-found-box">
              <h1>404</h1>
              <h2>Page Not Found</h2>
              <p>Sorry, the product you are looking for does not exist.</p>
              <a href="/products" className="back-btn">
                Back to Products
              </a>
            </div>
          ) : product ? (
            <div className="product-grid">
              <div className="left-section">
                <div
                  className="main-image-box"
                  ref={imageBoxRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={
                      selectedImage ||
                      getImageUrl(product.main_image) ||
                      "/default-product.png"
                    }
                    alt={product.name || "Product image"}
                    className={`main-product-image ${isZoomed ? "zoomed" : ""}`}
                    style={{
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>

                {Array.isArray(product.images) && product.images.length > 0 && (
                  <div className="thumb-list">
                    {product.images.map((img, index) => {
                      const imgUrl = getImageUrl(img);
                      return (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`Product ${index + 1}`}
                          className={`thumb-image ${
                            selectedImage === imgUrl ? "active" : ""
                          }`}
                          onClick={() => setSelectedImage(imgUrl)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="right-section">
                <h1 className="product-title">
                  {product.name || "Unnamed Product"}
                </h1>
                <p className="product-price">${product.price ?? 0}</p>

                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{
                    __html: product.description || "No description available",
                  }}
                />

                <form onSubmit={handleAddToCart}>
                  <div className="quantity-box">
                    <label>Quantity</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <input type="number" value={quantity} readOnly />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="submit" className="buy-btn">
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="wish-btn"
                      onClick={handleWishlistClick}
                    >
                      Wishlist
                    </button>
                  </div>
                </form>

                <div className="product-info">
                  <p>
                    <strong>Product Code:</strong> {product.sku || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="status-text">Something went wrong.</p>
          )}
        </div>

        {!notFoundState && (
          <div
            style={{ maxWidth: "1200px", margin: "auto", marginBottom: "30px" }}
          >
            <h2
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Related Products
            </h2>
            <RelatedProducts />
          </div>
        )}

        <Footer />

        <style jsx>{`
          .product-page {
            background: #f8faf8;
          }

          .product-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .not-found-box {
            text-align: center;
            background: #fff;
            border: 1px solid #e4efe8;
            border-radius: 16px;
            padding: 80px 20px;
          }

          .not-found-box h1 {
            font-size: 72px;
            color: #63a682;
            margin: 0 0 10px;
            line-height: 1;
          }

          .not-found-box h2 {
            font-size: 28px;
            color: #1f2d26;
            margin-bottom: 10px;
          }

          .not-found-box p {
            color: #4b5d53;
            margin-bottom: 20px;
            font-size: 16px;
          }

          .back-btn {
            display: inline-block;
            padding: 12px 22px;
            border-radius: 10px;
            background: #63a682;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
          }

          .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
          }

          .left-section,
          .right-section {
            background: #ffffff;
            border: 1px solid #e4efe8;
            border-radius: 16px;
            padding: 24px;
          }

          .left-section {
            position: sticky;
            top: 20px;
            align-self: start;
          }

          .main-image-box {
            width: 100%;
            height: 520px;
            background: #fff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            overflow: hidden;
          }

          .main-product-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            transition: transform 0.25s ease;
            cursor: zoom-in;
          }

          .main-product-image.zoomed {
            transform: scale(2);
            cursor: zoom-out;
          }

          .thumb-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 16px;
          }

          .thumb-image {
            width: 78px;
            height: 78px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid transparent;
            cursor: pointer;
            background: #f4f8f5;
            transition: 0.2s ease;
          }

          .thumb-image.active,
          .thumb-image:hover {
            border-color: #63a682;
          }

          .product-title {
            font-size: 32px;
            line-height: 1.2;
            margin-bottom: 12px;
            color: #1f2d26;
            font-weight: 700;
          }

          .product-price {
            font-size: 28px;
            font-weight: 700;
            color: #63a682;
            margin-bottom: 20px;
          }

          .product-description {
            color: #4b5d53;
            line-height: 1.7;
            margin-bottom: 20px;
            font-size: 15px;
          }

          .product-info {
            background: #f4f8f5;
            border-radius: 12px;
            padding: 14px 16px;
            margin-top: 20px;
            color: #31443a;
          }

          strong {
            color: #000 !important;
          }

          .product-info p {
            margin: 6px 0;
          }

          .quantity-box {
            margin-bottom: 24px;
          }

          .quantity-box label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #1f2d26;
          }

          .quantity-controls {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .quantity-controls button {
            width: 42px;
            height: 42px;
            border: none;
            border-radius: 10px;
            background: #63a682;
            color: #ffffff;
            font-size: 22px;
            cursor: pointer;
          }

          .quantity-controls input {
            width: 70px;
            height: 42px;
            text-align: center;
            border: 1px solid #cfe0d5;
            border-radius: 10px;
            font-size: 16px;
            background: #ffffff;
            color: #1f2d26;
          }

          .button-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .buy-btn,
          .wish-btn {
            min-width: 160px;
            height: 48px;
            border-radius: 10px;
            padding: 0 20px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          }

          .buy-btn {
            border: none;
            background: #63a682;
            color: #ffffff;
          }

          .wish-btn {
            background: #eef6f1;
            color: #63a682;
            border: 1px solid #63a682;
          }

          .status-text {
            text-align: center;
            font-size: 18px;
            color: #4b5d53;
            padding: 60px 0;
          }

          @media (max-width: 768px) {
            .product-grid {
              grid-template-columns: 1fr;
            }

            .left-section {
              position: static;
              top: auto;
            }

            .main-image-box {
              height: 380px;
            }

            .main-product-image.zoomed {
              transform: none;
            }

            .product-title {
              font-size: 26px;
            }

            .product-price {
              font-size: 24px;
            }

            .not-found-box h1 {
              font-size: 52px;
            }

            .not-found-box h2 {
              font-size: 22px;
            }
          }
        `}</style>
      </div>
    </>
  );
}