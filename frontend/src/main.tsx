import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ThemeContext from './ThemeContext'
import AuthProvider from './AuthContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContext>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeContext>
  </React.StrictMode>
)
