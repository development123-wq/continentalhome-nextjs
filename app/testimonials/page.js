import React from 'react'
import '../../public/assets/css/testimonials.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



const testimonials = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Ravi Kumar",
      feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
      role: "Business Owner",
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Priya Sharma",
      feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
      role: "Marketing Manager",
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Amit Verma",
      feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
      role: "Logistics Head",
    },
    {
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Amit Verma",
        feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        role: "Logistics Head",
      },
      {
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Amit Verma",
        feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        role: "Logistics Head",
      },
      {
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Amit Verma",
        feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        role: "Logistics Head",
      },
      {
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Amit Verma",
        feedback: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        role: "Logistics Head",
      },
  ]; 

const Testimonials=()=>{
    return (

        <div className="max-w-3xl mx-auto testimonials-container">
            <div className="content-banner-text">
      <h2 className="text-2xl font-bold text-center mb-6">What Our <span className="fancy-text">Clients Say</span><br/> About Us</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="shadow-xl rounded-2xl p-6 text-center">
            <img className="testimonials-thumb" src={item.image}/>
            <div className="testimonials-items">
              
              <h4 className="font-semibold clients-name">{item.name}</h4>
              <span className="text-sm text-gray-500 clients-role">{item.role}</span><br/>
              <div className="review-stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>

              </div>
              <p className="text-lg italic mb-4 clients-description">“{item.feedback}”</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
    )

}
export default Testimonials;