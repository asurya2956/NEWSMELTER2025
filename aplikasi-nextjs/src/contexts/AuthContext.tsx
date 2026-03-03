"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { username: string } | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AUTH_KEY = 'puskesmas_samata_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedAuth = localStorage.getItem(AUTH_KEY)
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        setIsAuthenticated(true)
        setUser(authData.user)
      } catch {
        localStorage.removeItem(AUTH_KEY)
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Admin and Demo authentication
    if ((username === 'admin' && password === 'mami1980') || (username === 'kanghaji' && password === '475400')) {
      const userData = { username }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
