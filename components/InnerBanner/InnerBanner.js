"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "../../public/assets/css/common.css";
import Image from "next/image";

const InnerBanner = () => {
  const pathname = usePathname();

  const [pageTitle, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [isInvalidPage, setIsInvalidPage] = useState(false);

  const pageTitles = {
    "/": "Home",
    "/about": "About Us",
    "/privacy-policy": "Privacy Policy",
    "/terms-and-conditions": "Terms and Conditions",
    "/shop": "All Products",
    "/blogs": "Our Blogs",
    "/contact": "Contact Us",
    "/faqs": "Frequently Asked Questions",
    "/categories/small-ceramics": "Small Ceramics",
    "/categories/home-decor": "Home Decor",
    "/categories/ceramic-lamps": "Ceramic Lamps",
    "/categories/ceramic": "Ceramic",
    "/categories/ceramic-vases": "Ceramic Vases",
    "/categories/driftwood-lamps": "Drift Wood Lamps",
    "/categories/floor-lamps": "Floor Lamps",
    "/categories/havana-lamp-collection": "Havana Lamp Collection",
    "/categories/lamp-collections": "Lamp Collection",
    "/categories/natural-vine": "Natural Vine",
    "/categories/decorative-objects": "Decorative Objects",
    "/categories/sculptural-pieces": "Sculptural Pieces",
    "/categories/new-ceramics": "New Ceramics",
    "/categories/new-arrivals": "New Arrivals",
    "/categories/rope-lamps": "Rope Lamps",
    "/categories/rope": "Rope",
    "/categories/salvaged-unique-lamps": "Salvaged Unique Lamps",
    "/categories/teak-lamps": "Teak Lamps",
    "/categories/teak": "Teak",
    "/categories/lighting": "Lighting",
    "/categories/product-details": "Product Details",
    "/add-to-cart": "Cart",
    "/categories/table-lamps": "Table Lamps",
    "/categories/octopus-theme": "Octopus Theme",
    "/categories/green-ceramics": "Green Ceramics",
    "/categories/earth-tone-ceramics": "Earth Tone Ceramics",
    "/categories/cream-ceramics": "Cream Ceramics",
    "/categories/ceramic-platters": "Ceramic Platters",
    "/categories/ceramic-plates": "Ceramic Plates",
    "/categories/ceramic-bowls": "Ceramic Bowls",
    "/categories/blue-ceramics": "Blue Ceramics",
    "/categories/white-ceramic-lamps": "White Ceramic Lamps",
    "/categories/earth-tone-ceramic-lamps": "Earth Tone Ceramic Lamps",
    "/categories/cream-ceramic-lamps": "Cream Ceramic Lamps",
    "/categories/ceramic-pineapple-lamps": "Ceramic Pineapple Lamps",
    "/categories/ceramic-coral-lamps": "Ceramic Coral Lamps",
    "/categories/blue-ceramic-lamps": "Blue Ceramic Lamps",
    "/categories/new-wooden-lamps": "New Wooden Lamps",
    "/categories/new-rope-lamps": "New Rope Lamps",
    "/categories/driftwood-table-lamps": "Driftwood Table Lamps",
    "/categories/driftwood-floor-lamps": "Driftwood Floor Lamps",
    "/categories/driftwood": "Driftwood",
    "/categories/unique-lamps": "Unique Lamps",
    "/categories/salvaged-lamps": "Salvaged Lamps",
    "/checkout": "Checkout",
    "/product-details": "Product Detail",
    "/users": "Welcome Back Dear!",
    "/categories/capiz-lamps": "Capiz Lamps",
    "/categories/capiz": "Capiz",
    "/refund-return": "Refund Policy",
    "/tnc": "Terms & Conditions",
    "/wishlist": "Wishlist",
  };

  const pageBackgrounds = {
    "/": "home.jpg",
    "/about": "about.jpg",
    "/users": "about.jpg",
    "/blogs": "about.jpg",
    "/faqs": "about.jpg",
    "/wishlist": "about.jpg",
    "/refund-return": "about.jpg",
    "/terms-and-conditions": "about.jpg",
    "/privacy-policy": "about.jpg",
    "/contact": "about.jpg",
    "/shop": "banner-bottom.jpg",

    "/categories/small-ceramics": "small-ceramics.jpg",
    "/categories/home-decor": "small-ceramics.jpg",

    "/categories/ceramic-lamps": "ceramic-lamp.jpg",
    "/categories/ceramic": "ceramic-lamp.jpg",
    "/categories/white-ceramic-lamps": "ceramic-lamp.jpg",
    "/categories/earth-tone-ceramic-lamps": "ceramic-lamp.jpg",
    "/categories/cream-ceramic-lamps": "ceramic-lamp.jpg",
    "/categories/ceramic-pineapple-lamps": "ceramic-lamp.jpg",
    "/categories/ceramic-coral-lamps": "ceramic-lamp.jpg",
    "/categories/blue-ceramic-lamps": "ceramic-lamp.jpg",

    "/categories/ceramic-vases": "ceramic-vases.jpg",
    "/categories/octopus-theme": "ceramic-vases.jpg",
    "/categories/green-ceramics": "ceramic-vases.jpg",
    "/categories/earth-tone-ceramics": "ceramic-vases.jpg",
    "/categories/cream-ceramics": "ceramic-vases.jpg",
    "/categories/ceramic-platters": "ceramic-vases.jpg",
    "/categories/ceramic-plates": "ceramic-vases.jpg",
    "/categories/ceramic-bowls": "ceramic-vases.jpg",
    "/categories/blue-ceramics": "ceramic-vases.jpg",

    "/categories/driftwood-lamps": "driftwood-lamps.jpg",
    "/categories/driftwood-table-lamps": "driftwood-lamps.jpg",
    "/categories/table-lamps": "driftwood-lamps.jpg",
    "/categories/driftwood-floor-lamps": "driftwood-lamps.jpg",
    "/categories/driftwood": "driftwood-lamps.jpg",

    "/categories/floor-lamps": "floor-lamps.jpg",
    "/categories/havana-lamp-collection": "havana.jpg",
    "/categories/lamp-collections": "havana.jpg",
    "/categories/natural-vine": "vine-lamps.jpg",

    "/categories/new-ceramics": "new-arrivals.jpg",
    "/categories/decorative-objects": "new-ceramics.jpg",
    "/categories/sculptural-pieces": "new-ceramics.jpg",
    "/categories/new-arrivals": "new-arrivals.jpg",
    "/categories/new-wooden-lamps": "new-arrivals.jpg",
    "/categories/new-rope-lamps": "new-arrivals.jpg",

    "/categories/capiz-lamps": "Capiz-banner.jpg",
    "/categories/capiz": "Capiz-banner.jpg",

    "/categories/rope-lamps": "rope-lamps.jpg",
    "/categories/rope": "rope-lamps.jpg",

    "/categories/salvaged-unique-lamps": "salvaged.jpg",
    "/categories/unique-lamps": "salvaged.jpg",
    "/categories/salvaged-lamps": "salvaged.jpg",

    "/categories/teak-lamps": "teak-lamps.jpg",
    "/categories/teak": "teak-lamps.jpg",
    "/categories/lighting": "teak-lamps.jpg",

    "/product-details": "product-details.jpg",
    "/checkout": "salvaged.jpg",
    "/add-to-cart": "salvaged.jpg",
    "/tnc": "salvaged.jpg",
  };

  const formatSlugToTitle = (path) => {
    const cleanPath = (path || "/").split("?")[0].split("#")[0];
    const lastSegment = cleanPath.split("/").filter(Boolean).pop() || "Page Not Found";

    return lastSegment
      .replace(/-/g, " ")
      .replace(/[_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const path = pathname || "/";
    const isValidPage = Object.prototype.hasOwnProperty.call(pageTitles, path);
    const isProductDynamic = path.startsWith("/product/") || path.startsWith("/products/");
    const isCategoryDynamic = path.startsWith("/categories/");

    if (isValidPage) {
      const title = pageTitles[path];
      const image = pageBackgrounds[path] || "default-banner.jpg";

      setTitle(title);
      setBannerImage(image);
      setIsInvalidPage(false);
      document.title = title;
    } else if (isProductDynamic) {
      setTitle("Product Details");
      setBannerImage("product-details.jpg");
      setIsInvalidPage(false);
      document.title = "Product Details";
    } else if (isCategoryDynamic) {
      const dynamicTitle = formatSlugToTitle(path);

      setTitle(dynamicTitle);
      setBannerImage("category-banner.jpg");
      setIsInvalidPage(false);
      document.title = dynamicTitle;
    } else {
      const invalidTitle = formatSlugToTitle(path);

      setTitle(invalidTitle);
      setBannerImage("404-banner.jpg");
      setIsInvalidPage(true);
      document.title = invalidTitle;
    }
  }, [pathname]);

  return (
    <div className={`inner-container-banner ${isInvalidPage ? "invalid-page-banner" : ""}`}>
      <div
        className="inner-banner"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.15) 65%, rgba(0, 0, 0, 0.25) 100%),
            url(/images/banners/${bannerImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          padding: "80px 40px",
          minHeight: "320px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="inner-banner-text">
          <h1 style={{ margin: 0 }}>{pageTitle}</h1>
          <div className="inner-banner-bottom">
            <p>Home - {pageTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerBanner;