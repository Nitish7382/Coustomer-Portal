import { BrowserRouter , Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

// Public Pages
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

// Admin Pages
import AdminDashboardPage from "./pages/admin/DashboardPage"
import AdminCustomersPage from "./pages/admin/CustomersPage"
import AdminCustomerDetailsPage from "./pages/admin/CustomerDetailsPage"
import AdminAddCustomerPage from "./pages/admin/AddCustomerPage"
import AdminProjectsPage from "./pages/admin/ProjectsPage"
import AdminProjectDetailsPage from "./pages/admin/ProjectDetailsPage"
import AdminAddProjectPage from "./pages/admin/AddProjectPage"
import AdminAddUpdatePage from "./pages/admin/AddUpdatePage"

// Customer Pages
import CustomerDashboardPage from "./pages/customer/DashboardPage"
import CustomerProjectDetailsPage from "./pages/customer/ProjectDetailsPage"

function App() {
  return (
      <BrowserRouter>
    <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin/" element={<AdminRoute />}>
            <Route path="" element={<AdminDashboardPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/add" element={<AdminAddCustomerPage />} />
            <Route path="customers/:id" element={<AdminCustomerDetailsPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/add" element={<AdminAddProjectPage />} />
            <Route path="projects/:id" element={<AdminProjectDetailsPage />} />
            <Route path="projects/:id/update/add" element={<AdminAddUpdatePage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="" element={<CustomerDashboardPage />} />
            <Route path="projects/:id" element={<CustomerProjectDetailsPage />} />
          </Route>
        </Routes>
    </AuthProvider>
      </BrowserRouter>
  )
}

export default App

