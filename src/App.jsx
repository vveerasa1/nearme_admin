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
import EditOffer from './pages/editOffer'
import AppLayout from './layout'
import EditBusiness from './pages/editBusiness'
import ViewBusinessData from './pages/viewBusinessData'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import ViewData from './pages/viewData'
import { BusinessProvider } from './pages/businessListing/businessContext'
function App() {

  return (
    <Router>
      <BusinessProvider>
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
          path="/view/:discountType/:_id" 
          element={<AppLayout><ViewData /></AppLayout>} 
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
          path="/add-offer/:_id" 
          element={<AppLayout><AddOffer /></AppLayout>} 
        />
         <Route 
          path="/edit-offer/:type/:_id" 
          element={<AppLayout><EditOffer /></AppLayout>} 
        />
         <Route 
          path="/edit-business/:_id" 
          element={<AppLayout><EditBusiness /></AppLayout>} 
        />
         <Route 
          path="/view-business/:_id" 
          element={<AppLayout><ViewBusinessData /></AppLayout>} 
        />
      </Routes>
      </BusinessProvider>

    </Router>
  )
}

export default App
