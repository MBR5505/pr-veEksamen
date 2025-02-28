import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Nav from './components/Nav';
import React from 'react';
// import { AuthContext } from './auth/Auth.jsx';
// import { useContext } from 'react';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Nav/>
      <App />
  </StrictMode>,
)
