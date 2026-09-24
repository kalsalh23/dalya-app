import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#33203A',
              border: '2px solid #F3E9F5',
              borderRadius: '16px',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 4px 24px rgba(74,31,82,0.12)',
            },
            success: { iconTheme: { primary: '#4A1F52', secondary: '#FFFFFF' } },
            error: { iconTheme: { primary: '#F43F5E', secondary: '#FFFFFF' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
