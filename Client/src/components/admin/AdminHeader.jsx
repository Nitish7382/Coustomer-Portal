"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"

function AdminHeader() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/admin/login")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="hidden md:inline-block">Project Management System</span>
          <span className="md:hidden">PMS</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="sr-only">Notifications</span>
          </button>

          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9.707 5.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">User menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

