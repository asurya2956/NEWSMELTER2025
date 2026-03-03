"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient } from '@/lib/data'
import VisitorAnalytics from './VisitorAnalytics'
import { Users, UserCheck, ShieldCheck, MapPin } from 'lucide-react'

interface DashboardOverviewProps {
  patients: Patient[]
}

export default function DashboardOverview({ patients }: DashboardOverviewProps) {
  const totalPatients = patients.length
  const bpjsCount = patients.filter(p => p.asuransi === 'BPJS').length
  const samataCount = patients.filter(p => p.wilayahKerja === 'Samata').length
  const femaleCount = patients.filter(p => p.jenisKelamin === 'Perempuan').length

  const stats = [
    { title: 'Total Pasien', value: totalPatients, icon: <Users className="w-4 h-4 text-emerald-600" />, sub: 'Semua Kunjungan' },
    { title: 'Pasien BPJS', value: bpjsCount, icon: <ShieldCheck className="w-4 h-4 text-blue-600" />, sub: `${Math.round((bpjsCount / totalPatients) * 100)}% dari total` },
    { title: 'Wilayah Samata', value: samataCount, icon: <MapPin className="w-4 h-4 text-orange-600" />, sub: 'Pasien Domisili Samata' },
    { title: 'Pasien Perempuan', value: femaleCount, icon: <UserCheck className="w-4 h-4 text-pink-600" />, sub: `${Math.round((femaleCount / totalPatients) * 100)}% dari total` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500">Ringkasan data kunjungan pasien secara real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analisis Demografis Pengunjung</CardTitle>
          <CardDescription>Visualisasi data berdasarkan kriteria yang ditentukan</CardDescription>
        </CardHeader>
        <CardContent>
          <VisitorAnalytics patients={patients} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Kunjungan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                      {p.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.nama}</p>
                      <p className="text-xs text-slate-500">{p.nomorRM} • {p.asuransi}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-400 uppercase">{p.wilayahKerja}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribusi Berdasarkan Usia (TBD)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-slate-400 italic">
            Fitur analisis kelompok usia akan segera tersedia.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
