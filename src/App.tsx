import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ComplaintProvider } from './contexts/ComplaintContext'
import { SuggestionProvider } from './contexts/SuggestionContext'
import { ReportsProvider } from './contexts/ReportsContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { FileUploadProvider } from './contexts/FileUploadContext'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SubmitComplaintPage from './pages/SubmitComplaintPage'
import SubmitSuggestionPage from './pages/SubmitSuggestionPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import ComplaintDetailsPage from './pages/ComplaintDetailsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AuthorityDashboardPage from './pages/AuthorityDashboardPage'
import ReportsPage from './pages/ReportsPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FileUploadProvider>
          <ComplaintProvider>
            <SuggestionProvider>
              <ReportsProvider>
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
                      <Route path="/submit-suggestion" element={
                        <ProtectedRoute>
                          <SubmitSuggestionPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/reports" element={
                        <ProtectedRoute requiredRole="authority">
                          <ReportsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/reports" element={
                        <ProtectedRoute requiredRole="admin">
                          <ReportsPage />
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
              </ReportsProvider>
            </SuggestionProvider>
          </ComplaintProvider>
        </FileUploadProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App