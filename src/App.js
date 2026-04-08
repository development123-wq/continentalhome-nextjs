"use client";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import AddModal from "./components/common/AddModal";

const Dashboard = () => {
  return <h1>Dashboard Page</h1>;
};

function Layout({ children }) {
  return (
    <div id="ebazar-layout" className="theme-blue">
      <Sidebar activekey="/" />
      <AddModal />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Example Route */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}