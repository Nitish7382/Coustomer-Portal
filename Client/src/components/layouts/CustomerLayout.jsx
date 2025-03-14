"use client"

import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const CustomerLayout = ({ children }) => {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700" : ""
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4 font-bold text-xl">Project Tracker</div>
        <nav className="mt-6">
          <Link to="/" className={`flex items-center py-3 px-4 hover:bg-blue-700 ${isActive("/")}`}>
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            My Projects
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold">Project Tracker</h1>
            <div className="flex items-center">
              <span className="mr-4">{user?.name}</span>
              <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

export default CustomerLayout

