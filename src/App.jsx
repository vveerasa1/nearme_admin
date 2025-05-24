import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './auth/signin'
import Dashboard from './pages/dashboard'
import BusinessListing from './pages/Business/index'
import AddBusiness from './OldBusinessForm/addBusiness/index'
import Coupon from './pages/Offer/coupon/index'
import Deal from './pages/Offer/deal/index'
import Discount from './pages/Offer/discount/index'
import ViewOfferData from './pages/Offer/viewOfferData/index'
import AddOffer from './pages/Offer/addOffer'
import EditOffer from './pages/Offer/editOffer'
import AppLayout from './layout'
import EditBusiness from './OldBusinessForm/editBusiness'
import ViewBusinessData from './pages/Business/viewBusinessData'
import Users from './pages/users'
import ViewUser from './pages/users/viewUser'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { BusinessProvider } from './components/BusinessContext/businessContext'
import BusinessForm from './pages/Business/businessForm'
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
          path="/add-new-business" 
          element={<AppLayout><AddBusiness /></AppLayout>} 
        />
        <Route 
          path="/coupons" 
          element={<AppLayout><Coupon /></AppLayout>} 
        />
          <Route 
          path="/add-business" 
          element={<AppLayout><BusinessForm /></AppLayout>} 
        />
          <Route 
          path="/edit-business/:_id" 
          element={<AppLayout><BusinessForm /></AppLayout>} 
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
          element={<AppLayout><ViewOfferData /></AppLayout>} 
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
          path="/view-business/:_id" 
          element={<AppLayout><ViewBusinessData /></AppLayout>} 
        />
        <Route path="/users"  element={<AppLayout><Users /></AppLayout> }/>
        <Route path="/view-users/:_id"  element={<AppLayout><ViewUser /></AppLayout> }/>
      </Routes>
      </BusinessProvider>

    </Router>
  )
}

export default App
