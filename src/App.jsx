
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Otp from './routes/Otp'
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import  Dashboard  from "./routes/Dashboard";
import AdminDashboard from './routes/AdminDashboard';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import AdminLogin from './routes/AdminLogin';
import Inventory from './routes/inventory';
import { ProtectedSupplierRoute } from './components/ProtectedSupplierRoute';
import SupplierLogin from './routes/SupplierLogin';
import UserCart from './routes/UserCart';
import AllRecipes from './routes/AllRecipes';
import OrderSummary from './routes/Order';
import UserProfile from './routes/UserProfile';

function App() {

  return (
  <div>
    <Routes>
    <Route path="/order" element={<OrderSummary/>} />
      <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/verify" element={<Otp/>} />
      <Route path="/adminLogin" element={<AdminLogin/>} />
    <Route path='/supplierlogin' element={<SupplierLogin/>}/>
    <Route path='/UserProfile' element={<UserProfile/>}/>
      
      <Route path="/inventory" 
      element={
          <ProtectedSupplierRoute>
          <Inventory/>
          </ProtectedSupplierRoute>
          } 
        />
      
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/AdminDashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard/>
            </ProtectedAdminRoute>
          }
        />
        {/* All Recipes Route */}
        <Route path="/allrecipes" element={<AllRecipes />} />
        {/* User Cart Route */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <UserCart />
            </ProtectedRoute>
          }
        />

    </Routes>
  
  </div>
  )
}

export default App;
