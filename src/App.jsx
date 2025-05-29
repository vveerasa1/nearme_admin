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
import Users from './pages/users'
import ViewUser from './pages/viewUser'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import ViewData from './pages/viewData'
import { BusinessProvider } from './pages/businessListing/businessContext'
import PrivateRoute from './components/privateRoute/PrivateRoute'
function App() {

  return (
    <Router>
    <BusinessProvider>
      <Routes>
        {/* Redirect default route ("/") to "/signin" */}
        <Route path="/" element={<Navigate to="/signin" />} />
  
        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />
  
        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout><Dashboard /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/business-listings"
          element={
            <PrivateRoute>
              <AppLayout><BusinessListing /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/business-view"
          element={
            <PrivateRoute>
              <AppLayout><BusinessView /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-new-business"
          element={
            <PrivateRoute>
              <AppLayout><AddBusiness /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <PrivateRoute>
              <AppLayout><Coupon /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deals"
          element={
            <PrivateRoute>
              <AppLayout><Deal /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/discounts"
          element={
            <PrivateRoute>
              <AppLayout><Discount /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/view/:discountType/:_id"
          element={
            <PrivateRoute>
              <AppLayout><ViewData /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/coupon-view"
          element={
            <PrivateRoute>
              <AppLayout><CouponView /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deal-view"
          element={
            <PrivateRoute>
              <AppLayout><DealView /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/discount-view"
          element={
            <PrivateRoute>
              <AppLayout><DiscountView /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-offer/:_id"
          element={
            <PrivateRoute>
              <AppLayout><AddOffer /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-offer/:type/:_id"
          element={
            <PrivateRoute>
              <AppLayout><EditOffer /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-business/:_id"
          element={
            <PrivateRoute>
              <AppLayout><EditBusiness /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-business/:_id"
          element={
            <PrivateRoute>
              <AppLayout><ViewBusinessData /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AppLayout><Users /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-users/:_id"
          element={
            <PrivateRoute>
              <AppLayout><ViewUser /></AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BusinessProvider>
  </Router>
  
  )
}

export default App
