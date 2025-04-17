import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './auth/signin'
import Dashboard from './pages/dashboard'
import BusinessListing from './pages/businessListing'
import BusinessView from './pages/businessView'
import Coupon from './pages/coupon'
import CouponView from './pages/couponView'
import AddCoupon from './pages/addCoupon'
import AppLayout from './layout'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

function App() {

  return (
    <Router>
      <Routes>

        {/* Redirect default route ("/") to "/signin" */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* SignIn Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Routes for pages with Sidebar and Topbar */}
        <Route 
          path="/dashboard" 
          element={<AppLayout><Dashboard /></AppLayout>} 
        />
        <Route 
          path="/business-listings" 
          element={<AppLayout><BusinessListing /></AppLayout>} 
        />
        <Route 
          path="/business-view" 
          element={<AppLayout><BusinessView /></AppLayout>} 
        />
        <Route 
          path="/coupons" 
          element={<AppLayout><Coupon /></AppLayout>} 
        />
        <Route 
          path="/coupon-view" 
          element={<AppLayout><CouponView /></AppLayout>} 
        />
        <Route 
          path="/add-coupon" 
          element={<AppLayout><AddCoupon /></AppLayout>} 
        />
      </Routes>
    </Router>
  )
}

export default App
