"use client"

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import DashboardOverview from './DashboardOverview'
import DashboardReports from './DashboardReports'
import DataInputModal from '@/components/data-input/DataInputModal'
import PatientTable from '@/components/dashboard/PatientTable'
import { VisitModal } from './VisitModal'
import { INITIAL_PATIENTS, INITIAL_VISITS, Patient, Visit } from '@/lib/data'

const navigation = [
  { name: 'Overview', path: '/dashboard', icon: '📊' },
  { name: 'Data Pasien', path: '/dashboard/pasien', icon: '👥' },
  { name: 'Reports', path: '/dashboard/reports', icon: '📈' },
]

const STORAGE_KEY = 'puskesmas_samata_patients';
const VISITS_STORAGE_KEY = 'puskesmas_samata_visits';

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<Patient | null>(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)

  // Load from local storage
  useEffect(() => {
    const savedPatients = localStorage.getItem(STORAGE_KEY);
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    } else {
      setPatients(INITIAL_PATIENTS);
    }

    const savedVisits = localStorage.getItem(VISITS_STORAGE_KEY);
    if (savedVisits) {
      setVisits(JSON.parse(savedVisits));
    } else {
      setVisits(INITIAL_VISITS);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }
    if (visits.length > 0) {
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
    }
  }, [patients, visits]);

  const handlePatientAdded = (newPatient: Patient) => {
    setPatients(prev => {
      const exists = prev.find(p => p.id === newPatient.id)
      if (exists) {
        return prev.map(p => p.id === newPatient.id ? newPatient : p)
      }
      return [newPatient, ...prev]
    })
  }

  const handlePatientDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
      setPatients(prev => prev.filter(p => p.id !== id))
      setVisits(prev => prev.filter(v => v.patientId !== id))
    }
  }

  const handleVisitAdded = (patientId: string, visitData: Omit<Visit, 'id' | 'patientId'>) => {
    const newVisit: Visit = {
      ...visitData,
      id: `v-${Date.now()}`,
      patientId
    }
    setVisits(prev => [newVisit, ...prev])
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-emerald-800 border-r border-emerald-700 transition-all duration-300 flex flex-col z-20 shadow-xl`}>
        {/* Header */}
        <div className="p-4 border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src="/logo-gowa.jpg"
                alt="Logo Gowa"
                className="w-full h-full object-contain p-1"
              />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-white font-bold text-sm leading-tight uppercase tracking-tight">PUSKESMAS SAMATA</h1>
                <p className="text-emerald-200 text-[10px] font-medium">Kabupaten Gowa</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navigation.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-emerald-800 shadow-lg scale-105 font-bold'
                  : 'text-emerald-50 hover:bg-emerald-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-emerald-700 bg-emerald-900/20">
          {sidebarOpen && (
            <div className="mb-4 ml-1">
              <p className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">Petugas Aktif</p>
              <p className="text-white font-semibold text-sm">{user?.username}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-emerald-100 hover:bg-red-500 hover:text-white transition-colors rounded-lg"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </Button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-8 -right-3 w-6 h-6 bg-white border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 shadow-md hover:scale-110 transition-transform z-30"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">
                  {navigation.find(nav => isActive(nav.path))?.name || 'Dashboard'}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Live</span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Sistem Informasi Pengunjung PUSKESMAS SAMATA
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <DataInputModal onDataAdded={handlePatientAdded} />
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-right">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Waktu Server</p>
                <p className="text-slate-800 text-sm font-mono font-bold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-emerald-600 rounded-full relative"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview patients={patients} />} />
              <Route
                path="/pasien"
                element={
                  <PatientTable
                    patients={patients}
                    visits={visits}
                    onUpdate={handlePatientAdded}
                    onDelete={handlePatientDelete}
                    onAddVisit={(p) => {
                      setSelectedPatientForVisit(p)
                      setIsVisitModalOpen(true)
                    }}
                  />
                }
              />
              <Route path="/reports" element={<DashboardReports patients={patients} visits={visits} />} />
            </Routes>
          </div>
        </div>
      </div>
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSave={handleVisitAdded}
        patient={selectedPatientForVisit}
      />
    </div>
  )
}
