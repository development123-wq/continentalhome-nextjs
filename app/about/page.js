"use client";
import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import Content from './Content/Content';


const About=()=>{
    return (
        <div className="main-aboutpage">
        <Navbar/>
        <InnerBanner/>
        <Content/>
        <Footer/>
        </div>
    )
}

export default About;