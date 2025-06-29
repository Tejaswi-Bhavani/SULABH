import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ComplaintProvider } from './contexts/ComplaintContext'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SubmitComplaintPage from './pages/SubmitComplaintPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import ComplaintDetailsPage from './pages/ComplaintDetailsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AuthorityDashboardPage from './pages/AuthorityDashboardPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/track" element={<TrackComplaintPage />} />
              <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/submit-complaint" element={
                <ProtectedRoute>
                  <SubmitComplaintPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/authority" element={
                <ProtectedRoute requiredRole="authority">
                  <AuthorityDashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  )
}

export default App