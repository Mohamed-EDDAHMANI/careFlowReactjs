import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                CareFlow
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  )
}