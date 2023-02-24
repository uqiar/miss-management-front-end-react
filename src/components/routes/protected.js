import React from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../header';
import tokenStorage from '../../services/tokenStorage';

function Protected({ children,adminRoute=false }) {
  const token =tokenStorage.getToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <div style={{
    maxWidth:"1400px",
    margin:"0 auto"
  }}>
    <Header/>
    {children}
  </div>
}
export default Protected