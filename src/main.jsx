import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router.jsx'
import { AlertProvider } from './contexts/AlertContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import theme from './theme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AlertProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
