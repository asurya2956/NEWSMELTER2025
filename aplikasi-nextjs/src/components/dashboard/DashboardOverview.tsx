"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient } from '@/lib/data'
import VisitorAnalytics from './VisitorAnalytics'
import { Users, UserCheck, ShieldCheck, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { differenceInYears, parseISO } from 'date-fns'

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
    { title: 'Pasien BPJS', value: bpjsCount, icon: <ShieldCheck className="w-4 h-4 text-blue-600" />, sub: totalPatients > 0 ? `${Math.round((bpjsCount / totalPatients) * 100)}% dari total` : '0%' },
    { title: 'Wilayah Samata', value: samataCount, icon: <MapPin className="w-4 h-4 text-orange-600" />, sub: 'Pasien Domisili Samata' },
    { title: 'Pasien Perempuan', value: femaleCount, icon: <UserCheck className="w-4 h-4 text-pink-600" />, sub: totalPatients > 0 ? `${Math.round((femaleCount / totalPatients) * 100)}% dari total` : '0%' },
  ]

  const getAgeData = () => {
    const ages = patients.map(p => differenceInYears(new Date(), parseISO(p.tanggalLahir)))
    const groups = [
      { name: '0-5', range: [0, 5], count: 0 },
      { name: '6-12', range: [6, 12], count: 0 },
      { name: '13-18', range: [13, 18], count: 0 },
      { name: '19-45', range: [19, 45], count: 0 },
      { name: '46-60', range: [46, 60], count: 0 },
      { name: '60+', range: [61, 150], count: 0 },
    ]

    ages.forEach(age => {
      const group = groups.find(g => age >= g.range[0] && age <= g.range[1])
      if (group) group.count++
    })

    return groups.map(g => ({ name: g.name, value: g.count }))
  }

  const ageData = getAgeData()

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
            <CardTitle className="text-base font-semibold">Distribusi Berdasarkan Kelompok Usia</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
