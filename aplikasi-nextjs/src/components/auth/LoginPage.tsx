"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Activity } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = login(username, password)
    if (!success) {
      setError('Username atau password salah')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-xl shadow-emerald-200 mb-6 rotate-3 overflow-hidden p-2">
            <img
              src="/logo-gowa.jpg"
              alt="Logo Gowa"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            PUSKESMAS SAMATA
          </h1>
          <p className="text-emerald-600 font-medium">
            Sistem Informasi Pengunjung
          </p>
          <div className="mt-2 text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Pemerintah Kabupaten Gowa
          </div>
        </div>

        <Card className="bg-white/80 border-slate-200 backdrop-blur-md shadow-2xl shadow-emerald-100 rounded-3xl overflow-hidden">
          <div className="h-2 bg-emerald-600 w-full" />
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl text-center text-slate-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              Masukkan kredensial Anda untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium ml-1">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12"
                />
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-600 rounded-xl">
                  <AlertDescription className="font-medium text-center">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? 'Sedang Masuk...' : 'Masuk ke Dashboard'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-tighter font-bold">Kredensial Login:</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-center gap-4">
                  <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                     <span className="text-[10px] text-slate-400 mr-1">Admin User:</span>
                     <span className="text-xs font-mono font-bold text-emerald-700">admin</span>
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                     <span className="text-[10px] text-slate-400 mr-1">Admin Pass:</span>
                     <span className="text-xs font-mono font-bold text-emerald-700">mami1980</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                     <span className="text-[10px] text-slate-400 mr-1">Demo User:</span>
                     <span className="text-xs font-mono font-bold text-emerald-700">kanghaji</span>
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                     <span className="text-[10px] text-slate-400 mr-1">Demo Pass:</span>
                     <span className="text-xs font-mono font-bold text-emerald-700">475400</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-xs text-slate-400">
          <p>© 2024 PUSKESMAS SAMATA. Dinas Kesehatan Pemerintah Kabupaten Gowa</p>
          <p className="mt-1 font-semibold text-emerald-600/70">created by Hj. Dahliah Aris, AMK.</p>
        </div>
      </div>
    </div>
  )
}
