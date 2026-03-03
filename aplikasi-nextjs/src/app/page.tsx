"use client"

import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/components/auth/LoginPage'
import Dashboard from '@/components/dashboard/Dashboard'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
