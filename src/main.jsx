import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router.jsx'
import { AlertProvider } from './contexts/AlertContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
)
