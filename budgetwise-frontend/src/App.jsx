import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import SecretAdminRegister from './pages/SecretAdminRegister';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/secret-admin-setup" element={<SecretAdminRegister />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/budgets" element={
            <ProtectedRoute>
              <Layout>
                <Budgets />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Layout>
                <Goals />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/forum" element={
            <ProtectedRoute>
              <Layout>
                <Forum />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
