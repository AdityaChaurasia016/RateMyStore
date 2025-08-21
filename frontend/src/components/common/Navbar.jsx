import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/20 glass-container backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white font-semibold text-xl hover:text-cyan-300 transition">
            RateMyStore
          </Link>
          {!user && (
            <>
              <Link to="/login" className="text-white hover:text-cyan-300 transition">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:text-cyan-300 transition">
                Signup
              </Link>
            </>
          )}
          {user && user.role === 'system_admin' && (
            <Link
              to="/admin/create-store"
              className="bg-cyan-400 text-indigo-900 px-4 py-1 rounded-md font-semibold hover:bg-cyan-300 transition"
            >
              Create Store
            </Link>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-4 text-sm">
            <span>Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded-md transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;