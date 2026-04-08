"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getPosts } from './APIData.js';
import InnerBanner from '../InnerBanner/InnerBanner';
import cat1 from '../../public/assets/images/category/cat-1.png';
import cat2 from '../../public/assets/images/category/cat-2.png';
import cat3 from '../../public/assets/images/category/cat-3.png';
import cat4 from '../../public/assets/images/category/cat-4.png';
import cat5 from '../../public/assets/images/category/cat-5.png';

const Shop = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    getPosts().then((posts) => {
      console.log('API Response:', posts);

      if (Array.isArray(posts.products)) {
        setData(posts.products);
      } else {
        console.error('Unexpected API format', posts);
        setData([]);
      }
    });
  }, []);


  return (
    <div className="main-Shoppage">
      <Navbar />
      <InnerBanner />
      <div className="product-conatiner">
        <div className="row product_row">
          <div className="col-md-12 product-section">
            {data.length > 0 ? data.map((item) => (

              <div className="product-define">
                <div className="main-image-container">
                <img src={item.main_image}></img></div>
                <h3>{item.name}</h3>
                <p className="price">${item.price}</p>
                <button><i className="fa fa-shopping-cart"></i> Add To Cart</button>
              </div>



            )) : <p></p>}




          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
