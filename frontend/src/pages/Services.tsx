import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Box,
  TablePagination,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { listServices } from '../api/services'
import { useAuth } from '../AuthContext'

type Service = {
  id: string
  name?: string
  description?: string
  category?: string
  owner?: string
  criticality?: number
  status?: string
  rto?: string
  rpo?: string
}

export default function Services() {
  const [services, setServices] = useState<Service[] | null>(null)
  const [filtered, setFiltered] = useState<Service[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const navigate = useNavigate()
  const { user } = useAuth()

  const canCreate = user?.role && ['BCM Administrator', 'Business Service Owner', 'Recovery Team Member'].includes(user.role)

  useEffect(() => {
    listServices()
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    if (!services) return
    let result = services.filter((s) => {
      const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !categoryFilter || s.category === categoryFilter
      const matchOwner = !ownerFilter || s.owner?.toLowerCase().includes(ownerFilter.toLowerCase())
      const matchStatus = !statusFilter || s.status === statusFilter
      return matchSearch && matchCategory && matchOwner && matchStatus
    })
    setFiltered(result)
    setPage(0)
  }, [services, search, categoryFilter, ownerFilter, statusFilter])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedServices = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Services
      </Typography>

      {canCreate && (
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/services/new')}>
          New Service
        </Button>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            size="small"
            label="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
          </TextField>
          <TextField
            size="small"
            label="Filter by owner"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </TextField>
        </Box>
      </Paper>

      {services === null ? (
        <CircularProgress />
      ) : filtered.length === 0 ? (
        <Typography>No services found.</Typography>
      ) : (
        <Paper sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criticality</TableCell>
                <TableCell>RTO</TableCell>
                <TableCell>RPO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices.map((s) => (
                <TableRow key={s.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/services/${s.id}`)}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.name ?? '-'}</TableCell>
                  <TableCell style={{ maxWidth: 300 }}>{s.description ?? '-'}</TableCell>
                  <TableCell>{s.category ?? '-'}</TableCell>
                  <TableCell>{s.owner ?? '-'}</TableCell>
                  <TableCell>{s.status ?? '-'}</TableCell>
                  <TableCell>{s.criticality ?? '-'}</TableCell>
                  <TableCell>{s.rto ?? '-'}</TableCell>
                  <TableCell>{s.rpo ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  )
}
