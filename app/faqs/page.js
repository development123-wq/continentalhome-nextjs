"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import '../../public/assets/css/faqs.css';

const Shop = () => {
  const [activeSubIndex, setActiveSubIndex] = useState(null);
  const [activeMainIndex, setActiveMainIndex] = useState(null);

  // reusable link JSX
  const accountLink = (
    <Link to="/sign-in" style={{ color: 'inherit', textDecoration: 'underline' }}>
      My Account / Order Status
    </Link>
  );

  const faqs = [
    {
      question: 'Order Status',
      subQuestions: [
        {
          question: 'Has my order shipped?',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to check your orders status.
            </>
          ),
        },
        {
          question: 'How do I track my order?',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to track your order.
            </>
          ),
        },
        {
          question: 'An item is missing from my shipment.',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to track your order status.
              Be sure that all of the items in your order have shipped already. If you order displays your
              Package Tracking Numbers, check with the shipper to confirm that your packages were delivered.
              If your packages each show a status of "delivered", please contact customer service for assistance.
            </>
          ),
        },
        {
          question: 'My product is missing parts.',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to track your order status.
              Be sure that all of the items in your order have shipped already. If you order displays your
              Package Tracking Numbers, check with the shipper to confirm that your packages were delivered.
              If your packages each show a status of "delivered", please contact customer service for assistance.
            </>
          ),
        },
        {
          question: 'When will my backorder arrive?',
          answer:
            'Backordered items are those which our suppliers are unable to predict when they will have more in stock, but as soon as they do, we will be able to ship the item to you.',
        },
      ],
    },

    {
      question: 'My Account',
      subQuestions: [
        {
          question: 'How do I create an account?',
          answer: (
            <>
              1) Click the {accountLink} link at the top right side of our site.{"\n"}
              2) Enter your email address.{"\n"}
              3) Select "I am a new customer".{"\n\n"}
              Then simply follow the prompts to complete setting up your account. Your information is NEVER sold
              to any other company and is kept completely private. Please view our Privacy Policy for more information.
            </>
          ),
        },
        {
          question: 'How do I edit my account information?',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to edit your account information.
            </>
          ),
        },
        {
          question: 'How much is my shipping?',
          answer:
            'Shipping is automatically calculated prior to submitting your payment information. Simply add items to your cart and proceed to the Checkout page where you will be offered Shipping Method choices and their prices.',
        },
        {
          question: 'I forgot my password.',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site. Under the login box you'll see
              a link that says "Forgot your password? Click here". That link will send an email to you with your password.
            </>
          ),
        },
        {
          question: 'How do I return my product?',
          answer: (
            <>
              Please click <Link to="/refund-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>here</Link> for more
              information on returning an item.
            </>
          ),
        },
        {
          question: 'I received the wrong product.',
          answer:
            'If you feel that you have received the wrong product, please contact customer service within 72 hours of receiving the product.',
        },
      ],
    },

    {
      question: 'International Shipping',
      subQuestions: [
        {
          question: 'Do you ship to my country?',
          answer: (
            <>
              Please create an account by clicking the {accountLink} link at the top right hand side of our site.
              During signup we'll ask for your shipping address details including country. If your country is not
              in the dropdown menu of available countries, unfortunately we cannot ship to your country at this time.
            </>
          ),
        },
        {
          question: 'What are my payment choices?',
          answer:
            'During the checkout process you may choose any of our current payment options and continue to place your order. Please note that we will not ship your order until we receive payment from you.',
        },
        {
          question: 'When will my order ship and what are my shipping charges?',
          answer:
            'Shipping is automatically calculated prior to submitting your payment information. Simply add items to your cart and proceed to the Checkout page where you will be offered Shipping Method choices and their prices. We will ship your order shortly after we receive payment from you.',
        },
        {
          question: 'What is the return policy?',
          answer: (
            <>
              Please see our{' '}
              <Link to="/terms-and-conditions" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Terms & Conditions
              </Link>{' '}
              for complete details regarding our return policy.
            </>
          ),
        },
      ],
    },

    {
      question: 'Guarantees',
      subQuestions: [
        {
          question: 'Low Price Guarantee',
          answer:
            'It is our commitment to provide you with the best value, at the best price. We value your business and strive to keep our prices low.',
        },
        {
          question: 'Privacy Policy',
          answer: (
            <>
              We value your privacy. Please view our{' '}
              <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>{' '}
              for complete details on how we use the information we collect.
            </>
          ),
        },
        {
          question: 'Security',
          answer:
            'This website is protected with SSL (secure socket layer) encryption, the highest standard in Internet security.',
        },
      ],
    },

    {
      question: 'Pricing and Billing',
      subQuestions: [
        {
          question: 'I have a question on my charges.',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to review your orders. You may
              compare your order history on our website, with your financial records. If you have further questions
              or concerns, please contact customer service for further assistance.
            </>
          ),
        },
        {
          question: 'I need a copy of my receipt/invoice.',
          answer: (
            <>
              Click the {accountLink} link at the top right hand side of our site to print invoices.
            </>
          ),
        },
        {
          question: 'When will my credit appear on my account?',
          answer: 'Credits usually take 7-10 business days from the time we receive your item(s).',
        },
        {
          question: 'When will my credit card be charged?',
          answer: 'Your credit card will be charged within 24 hours prior to shipment of your item(s).',
        },
      ],
    },

    {
      question: "Buyer's Guide",
      subQuestions: [
        {
          question: 'How do I find my product?',
          answer:
            "To find the product(s) you're looking for, you may (1) use the navigation menus on the top, left & bottom of our website. (2) type a keyword into the SEARCH box. If you have any trouble locating a product, feel free to contact customer service for assistance.",
        },
        {
          question: 'How do I navigate the site?',
          answer:
            'To navigate this website, simply click on a category you might be interested in. Categories are located on the top, left & bottom of our website. QUICK TIP: Place your mouse cursor over anything you think could be a clickable link. You’ll notice that anytime you scroll over something that is a link, your mouse cursor will become a "hand". Whereas scrolling over anything that is NOT a link will leave your cursor as an "arrow". You may also type a keyword into the SEARCH box to quickly find a specific product. If you have any trouble locating a product, feel free to contact customer service for assistance.',
        },
      ],
    },

    {
      question: 'Additional Support',
      subQuestions: [
        {
          question: 'How do I contact you?',
          answer: (
            <>
              Please click{' '}
              <Link to="/contact" style={{ color: 'inherit', textDecoration: 'underline' }}>
                here
              </Link>{' '}
              for our company contact information.
            </>
          ),
        },
      ],
    },
  ];

  const toggleMainFAQ = (index) => {
    if (activeMainIndex === index) {
      setActiveMainIndex(null);
      setActiveSubIndex(null);
    } else {
      setActiveMainIndex(index);
      setActiveSubIndex(null);
    }
  };

  const toggleSubFAQ = (mainIndex, subIndex) => {
    setActiveSubIndex(activeSubIndex === subIndex ? null : subIndex);
  };

  return (
    <div className="main-blogpage">
      <Navbar />
      <InnerBanner />

      <div className="col-md-12 faqs-section">
        {faqs.map((faq, mainIndex) => (
          <div key={mainIndex} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
            <h3
              onClick={() => toggleMainFAQ(mainIndex)}
              style={{ cursor: 'pointer', marginBottom: '5px' }}
            >
              {faq.question}
            </h3>

            {activeMainIndex === mainIndex && (
              <div style={{ paddingLeft: '10px', color: '#555', marginBottom: '10px' }}>
                {faq.subQuestions.map((subQuestion, subIndex) => {
                  const isObject = typeof subQuestion === 'object' && subQuestion.question;

                  return (
                    <div key={subIndex} style={{ marginBottom: '8px' }}>
                      <div
                        onClick={() => toggleSubFAQ(mainIndex, subIndex)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: activeSubIndex === subIndex ? '#63a682' : 'transparent',
                          color: activeSubIndex === subIndex ? '#fff' : '#555',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <span style={{ flex: 1 }}>{isObject ? subQuestion.question : subQuestion}</span>

                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: activeSubIndex === subIndex ? '#fff' : '#f0f0f0',
                            color: activeSubIndex === subIndex ? '#63a682' : '#666',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {activeSubIndex === subIndex ? '−' : '+'}
                        </span>
                      </div>

                      {activeSubIndex === subIndex && (
                        <div style={{ paddingLeft: '10px', color: '#555', margin: '5px 0 0 0', fontSize: '14px' }}>
                          {isObject ? (
                            <p
                              style={{
                                whiteSpace: 'pre-line',
                                background: '#63a682',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '10px',
                                margin: '5px 0 0 0',
                              }}
                            >
                              {subQuestion.answer}
                            </p>
                          ) : (
                            <p style={{ margin: '5px 0 0 0' }}>No FAQ content found</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;