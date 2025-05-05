import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './auth/signin'
import Dashboard from './pages/dashboard'
import BusinessListing from './pages/businessListing'
import BusinessView from './pages/businessView'
import AddBusiness from './pages/addBusiness'
import Coupon from './pages/coupon'
import Deal from './pages/deal'
import Discount from './pages/discount'
import CouponView from './pages/couponView'
import DealView from './pages/dealView'
import DiscountView from './pages/discountView'
import AddOffer from './pages/addOffer'
import AppLayout from './layout'
import Users from './pages/users'
import UserView from './pages/userView'
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
          path="/add-new-business" 
          element={<AppLayout><AddBusiness /></AppLayout>} 
        />
        <Route 
          path="/coupons" 
          element={<AppLayout><Coupon /></AppLayout>} 
        />
        <Route 
          path="/deals" 
          element={<AppLayout><Deal /></AppLayout>} 
        />
        <Route 
          path="/discounts" 
          element={<AppLayout><Discount /></AppLayout>} 
        />
        <Route 
          path="/coupon-view" 
          element={<AppLayout><CouponView /></AppLayout>} 
        />
        <Route 
          path="/deal-view" 
          element={<AppLayout><DealView /></AppLayout>} 
        />
        <Route 
          path="/discount-view" 
          element={<AppLayout><DiscountView /></AppLayout>} 
        />
        <Route 
          path="/add-offer" 
          element={<AppLayout><AddOffer /></AppLayout>} 
        />
        <Route 
          path="/users" 
          element={<AppLayout><Users /></AppLayout>} 
        />
         <Route 
          path="/user-view" 
          element={<AppLayout><UserView /></AppLayout>} 
        />
      </Routes>
    </Router>
  )
}

export default App
