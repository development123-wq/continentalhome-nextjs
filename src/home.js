import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InnerBanner from '@/components/banner/page';
import CategoryList from '@/app/category-list';
import ProductList from '@/app/product-list';
import ContentPart from '@/app/content-part';


const Home=()=>{
    return (
        <div>
        <Navbar/>
        <InnerBanner/>
        <CategoryList />
        <ProductList />
        <ContentPart />
        <Footer />
        </div>
    )
}

export default Home;