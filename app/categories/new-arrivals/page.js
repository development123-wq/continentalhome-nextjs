"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import "@/components/style.css";

const BASE_URL = "http://187.124.157.146:5001/";

const SmallCeramics = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetch(
      `${BASE_URL}api/products?search=&page=1&limit=500&categoryId=16`
    )
      .then((res) => res.json())
      .then((response) => {
        if (Array.isArray(response.products)) {
          setData(response.products);
        } else {
          console.error("Unexpected API format", response);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(data.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductOpen = (slug) => {
    if (!slug) return;
    router.push(`/${slug}`);
  };

  return (
    <div className="shop-page-wrapper">
      <Navbar />
      <InnerBanner />

      <div className="shop-container">
        <main className="shop-content full-width-content">
          <h2 className="shop-page-title">
            Shop By <span className="fancy-text">New Arrivals</span>
          </h2>

          <div className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((item) => (
                <div className="product-card-item" key={item.id}>
                  <div className="p-card-inner">
                    <div className="p-img-holder">
                      <Link
                        href={`/${item.slug || ""}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <img
                          src={`${BASE_URL}${item.main_image}`}
                          alt={item.name}
                        />
                      </Link>
                    </div>

                    <div className="p-details">
                      <Link
                        href={`/${item.slug || ""}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <h5>{item.name}</h5>
                      </Link>

                      <p className="p-price">${item.price}</p>

                      <button
                        className="p-buy-now"
                        type="button"
                        onClick={() => handleProductOpen(item.slug)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Loading products...</p>
            )}
          </div>

          <div className="shop-pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SmallCeramics;