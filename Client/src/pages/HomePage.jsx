import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Project Management System</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Track Your Projects</h2>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive system for managing projects and keeping clients updated on progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded text-lg"
            >
              Customer Login
            </Link>
            <Link
              to="/admin/login"
              className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded border border-primary text-lg"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Project Management System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default HomePage

