"use client";

import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PageHeader1(props) {
    const {
        pagetitle, righttitle, link, routebutton, modalbutton, button,
        invoicetab, changelog, Orderdetail, productgrid, productlist,
        documentation, cantactus, onSearch
    } = props;

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value); // send search query to parent
        }
    };

    return (
        <div className="row align-items-center">
            <div className="border-0 mb-4 w-100">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap gap-2">
                    <h3 className="fw-bold mb-0">{pagetitle}</h3>

                    {/* Search Bar */}
                    {
                        onSearch &&
                        <div style={{ minWidth: '250px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    }

                    {routebutton && (
                        <div className="col-auto d-flex w-sm-100">
                            <Link to={process.env.PUBLIC_URL + link} className="btn btn-primary btn-set-task w-sm-100">
                                <i className="icofont-plus-circle me-2 fs-6"></i>{righttitle}
                            </Link>
                        </div>
                    )}

                    {modalbutton && modalbutton()}

                    {button && (
                        <button type="submit" className="btn btn-primary btn-set-task w-sm-100 text-uppercase px-5">
                            Save
                        </button>
                    )}

                    {invoicetab && (
                        <div className="col-auto py-2 w-sm-100">
                            <Nav className="nav nav-tabs tab-body-header rounded invoice-set" role="tablist">
                                <Nav.Item className="nav-item"><Nav.Link className="nav-link" eventKey="first" href="#Invoice-list">Invoice List</Nav.Link></Nav.Item>
                                <Nav.Item className="nav-item"><Nav.Link className="nav-link" eventKey="second" href="#Invoice-Simple">Simple invoice</Nav.Link></Nav.Item>
                                <Nav.Item className="nav-item"><Nav.Link className="nav-link" eventKey="third" href="#Invoice-Email">Email invoice</Nav.Link></Nav.Item>
                            </Nav>
                        </div>
                    )}

                    {changelog && (
                        <div className="col-auto mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="#!" className="btn btn-white border lift me-1">Get Support</Link>
                            <Link to="#!" className="btn btn-primary border lift">Our Portfolio</Link>
                        </div>
                    )}

                    {documentation && (
                        <div className="row align-items-center">
                            <div className="col"></div>
                            <div className="col-auto">
                                <a href="https://themeforest.net/user/pixelwibes" className="btn btn-white border lift">Download</a>
                                <Link to={process.env.PUBLIC_URL + "/dashboard"} className="btn btn-dark lift">Go to Dashboard</Link>
                            </div>
                        </div>
                    )}

                    {Orderdetail && (
                        <div className="col-auto d-flex btn-set-task w-sm-100 align-items-center">
                            <select className="form-select">
                                <option>Select Order Id</option>
                                {[78414, 78415, 78416, 78417, 78418, 78419, 78420].map(id =>
                                    <option key={id} value={id}>Order-{id}</option>
                                )}
                            </select>
                        </div>
                    )}

                    {productgrid && (
                        <div className="btn-group group-link btn-set-task w-sm-100">
                            <Link to={process.env.PUBLIC_URL + "/"} className="btn d-inline-flex align-items-center">
                                <i className="icofont-listing-box px-2 fs-5"></i> Export
                            </Link>
                        </div>
                    )}

                    {productlist && (
                        <div className="btn-group btn-set-task w-sm-100">
                            <Link to={process.env.PUBLIC_URL + "/"} className="btn btn-primary d-inline-flex align-items-center" style={{ paddingLeft: '0px' }}>
                                <i className="icofont-arrow-up px-2 fs-5"></i> Export
                            </Link>
                        </div>
                    )}

                    {cantactus && (
                        <div className="py-2 project-tab w-sm-100" style={{ display: 'flex', justifyContent: 'right' }}>
                            <Nav className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100" role="tablist">
                                <Nav.Item className="nav-item"><Nav.Link eventKey="first" className="nav-link" data-bs-toggle="tab" href="#list-view">List View</Nav.Link></Nav.Item>
                                <Nav.Item className="nav-item"><Nav.Link eventKey="second" className="nav-link" data-bs-toggle="tab" href="#grid-view">Grid View</Nav.Link></Nav.Item>
                            </Nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PageHeader1;
