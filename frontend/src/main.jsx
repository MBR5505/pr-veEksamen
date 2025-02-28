import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Nav from './components/Nav';
import React from 'react';
import { AuthProvider } from './auth/Auth.jsx';
import { BrowserRouter } from 'react-router-dom';


// import { AuthContext } from './auth/Auth.jsx';
// import { useContext } from 'react';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
  <StrictMode>
      <Nav/>
      <App />
  </StrictMode>,
  </AuthProvider>
  </BrowserRouter>
)
