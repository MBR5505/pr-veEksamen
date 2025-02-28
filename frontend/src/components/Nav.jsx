import React, { useState, useEffect } from 'react';
import { fetchUser } from '../auth/Auth.jsx';
import axios from 'axios';

const Nav = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then((userData) => setUser(userData));
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userId');
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-xl font-bold">SámiApp</a>
          <div className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-blue-400">Home</a>
            {user && (
              <>
                <a href="/create-flokk" className="hover:text-blue-400">Registrer ny flokk</a>
                <a href="/rein" className="hover:text-blue-400">Rein</a>
              </>
            )}
          </div>
        </div>
        
        <div className="relative">
          {!user ? (
            <a href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Login</a>
          ) : (
            <div>
              <button onClick={toggleProfileMenu} className="flex items-center space-x-2">
                <span>{user.email}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <a href={`/${user._id}`} className="block px-4 py-2 hover:bg-gray-700">Profile</a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;