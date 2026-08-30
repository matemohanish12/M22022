import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ThemeContext from './ThemeContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContext>
  </React.StrictMode>
)
