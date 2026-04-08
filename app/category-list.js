import React from 'react'
import '../public/assets/css/category.css'
import cat1 from '../public/assets/images/category/tablelampcategory.png' 
import cat2 from '../public/assets/images/category/driftwood.png'
import cat3 from '../public/assets/images/category/cat-3.png'
import cat4 from '../public/assets/images/category/cat-4.png'
import cat5 from '../public/assets/images/category/teaklampcategory.png'
import Image from "next/image";


const CategoryList=()=>{
    return(

        <div className="category-conatiner">
            <div className="row category_row">
                <div className="col-md-12">
                    <h2>Shop By <span className="fancytext">Category</span></h2>
                </div>
                <div className="col-md-12 category-section" style={{gap:'40px'}}>
                    <a href="/productdetails?id=1331&cat=14"><div className="category-define" style={{width:'100%'}}><Image src={cat2} alt="cate1"></Image><h4>Driftwood Lamps</h4></div></a>
                    <a href="/productdetails?id=1330"><div className="category-define" style={{width:'100%'}}><Image src={cat1} alt="cate2"></Image><h4>Table Lamps</h4></div></a>                  
                    <a href="https://www.faire.com/brand-portal/my-shop/products/p_7yxk8kpb3a?page=1&productType=ALL&query=v248&showCatalogUpdateTooltip=false&showCatalogUploadSuccessModal=false&sortBy=A_TO_Z"><div className="category-define" style={{width:'100%'}}><Image src={cat3} alt="cate5"></Image><h4>Ceramic Lamps</h4></div></a>
                    <a href="/productdetails?id=1178&cat=51"><div className="category-define" style={{width:'100%'}}><Image src={cat4} alt="cate3"></Image><h4>Floor Lamps</h4></div></a>
                    <a href="/productdetails?id=1355&cat=13 "><div className="category-define" style={{width:'100%'}}><Image src={cat5} alt="cate4"></Image><h4>Teak Lamps</h4></div></a>
                </div>
            </div>


            {/* <div className="banner-home category-bg">
        <div className="category-banner-text">
           
            <h1 className="category-heading">Get <span className="fancy-text">10% OFF</span><br/>on your First Order</h1>
        
            <button className="banner-btn-one-1" onClick={()=>window.location.href='/shop'}>View All Products</button>
            
        
        </div>
        </div> */}




            
        </div>
        
        
        

    )
}

export default CategoryList;