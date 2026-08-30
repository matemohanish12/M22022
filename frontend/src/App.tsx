import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import ServiceCreate from './pages/ServiceCreate'
import ServiceDetails from './pages/ServiceDetails'
import { Header } from './components'
import { Container } from '@mui/material'

export default function App() {
  return (
    <div>
      <Header />
      <Container sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/new" element={<ServiceCreate />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
        </Routes>
      </Container>
    </div>
  )
}
