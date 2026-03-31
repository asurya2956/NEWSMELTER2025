"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient, Visit, WILAYAH_KERJA } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Download, FileText, Printer } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/exportUtils'
import { isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns'

interface DashboardReportsProps {
  patients: Patient[]
  visits: Visit[]
}

export default function DashboardReports({ patients, visits }: DashboardReportsProps) {
  const [reportType, setReportType] = useState<'harian' | 'mingguan' | 'bulanan'>('bulanan')

  const filterVisitsByTime = (vs: Visit[]) => {
    const now = new Date();
    return vs.filter(v => {
      const date = parseISO(v.tanggalKunjungan);
      if (reportType === 'harian') return isSameDay(date, now);
      if (reportType === 'mingguan') return isSameWeek(date, now);
      if (reportType === 'bulanan') return isSameMonth(date, now);
      return true;
    });
  }

  const filteredVisits = filterVisitsByTime(visits);

  // Map visits back to patients for region info
  const visitPatients = filteredVisits.map(v => {
    const p = patients.find(p => p.id === v.patientId);
    return { ...v, patient: p };
  }).filter(item => item.patient);

  const getSummaryData = () => {
    const summary = WILAYAH_KERJA.map(w => {
      const regionVisits = visitPatients.filter(v => v.patient?.wilayahKerja === w);
      return {
        wilayah: w,
        total: regionVisits.length,
        bpjs: regionVisits.filter(v => v.patient?.asuransi === 'BPJS').length,
        umum: regionVisits.filter(v => v.patient?.asuransi === 'Umum').length,
        laki: regionVisits.filter(v => v.patient?.jenisKelamin === 'Laki-laki').length,
        perempuan: regionVisits.filter(v => v.patient?.jenisKelamin === 'Perempuan').length,
      }
    })
    return summary
  }

  const summaryData = getSummaryData()

  const handleExportExcel = () => {
    const excelData = summaryData.map(s => ({
      'Wilayah': s.wilayah,
      'Total Pasien': s.total,
      'Laki-laki': s.laki,
      'Perempuan': s.perempuan,
      'BPJS': s.bpjs,
      'Umum': s.umum
    }));
    exportToExcel(excelData, `Laporan_${reportType}_Puskesmas_Samata`);
  }

  const handleExportPDF = () => {
    const headers = ['Wilayah', 'Total', 'Laki-laki', 'Perempuan', 'BPJS', 'Umum'];
    const data = summaryData.map(s => [s.wilayah, s.total, s.laki, s.perempuan, s.bpjs, s.umum]);
    exportToPDF(headers, data, `Laporan_${reportType}_Puskesmas_Samata`, `LAPORAN ${reportType.toUpperCase()} KUNJUNGAN PASIEN`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan & Ringkasan</h1>
          <p className="text-slate-500">Generate laporan kunjungan pasien PUSKESMAS SAMATA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Download className="w-4 h-4" /> Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Printer className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {(['harian', 'mingguan', 'bulanan'] as const).map((type) => (
          <Button
            key={type}
            variant={reportType === type ? 'default' : 'ghost'}
            className={reportType === type ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'}
            onClick={() => setReportType(type)}
            size="sm"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Summary Kunjungan per Wilayah</CardTitle>
            <CardDescription>
              {reportType === 'harian' ? 'Data kunjungan hari ini' :
               reportType === 'mingguan' ? 'Data kunjungan minggu ini' :
               'Data kunjungan bulan ini'} berdasarkan domisili pasien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Wilayah Kerja</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3 text-indigo-600">L</th>
                    <th className="px-6 py-3 text-pink-600">P</th>
                    <th className="px-6 py-3 text-blue-600">BPJS</th>
                    <th className="px-6 py-3 text-emerald-600">Umum</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={i} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.wilayah}</td>
                      <td className="px-6 py-4">{row.total}</td>
                      <td className="px-6 py-4">{row.laki}</td>
                      <td className="px-6 py-4">{row.perempuan}</td>
                      <td className="px-6 py-4">{row.bpjs}</td>
                      <td className="px-6 py-4">{row.umum}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="px-6 py-4 uppercase text-[10px]">Total Keseluruhan</td>
                    <td className="px-6 py-4">{summaryData.reduce((acc, curr) => acc + curr.total, 0)}</td>
                    <td className="px-6 py-4 text-indigo-700">{summaryData.reduce((acc, curr) => acc + curr.laki, 0)}</td>
                    <td className="px-6 py-4 text-pink-700">{summaryData.reduce((acc, curr) => acc + curr.perempuan, 0)}</td>
                    <td className="px-6 py-4 text-blue-700">{summaryData.reduce((acc, curr) => acc + curr.bpjs, 0)}</td>
                    <td className="px-6 py-4 text-emerald-700">{summaryData.reduce((acc, curr) => acc + curr.umum, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {visitPatients.length === 0 && (
              <div className="text-center py-8 text-slate-400 italic">
                Tidak ada data kunjungan untuk periode ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>Shortcut laporan cepat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                const data = visitPatients.map(v => [
                  v.tanggalKunjungan,
                  v.patient?.nomorRM || '',
                  v.patient?.nama || '',
                  v.diagnosa,
                  v.tindakan,
                  v.keluhan
                ]);
                exportToPDF(
                  ['Tanggal', 'No RM', 'Nama Pasien', 'Diagnosa', 'Tindakan', 'Keluhan'],
                  data,
                  `Summary_Kunjungan_${reportType}`,
                  `LAPORAN SUMMARY KUNJUNGAN ${reportType.toUpperCase()}`
                );
              }}
            >
              <FileText className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <div className="text-sm font-semibold">Laporan Summary Kunjungan</div>
                <div className="text-xs text-slate-400">Detil lengkap per periode</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                const bpjsVisits = visitPatients.filter(v => v.patient?.asuransi === 'BPJS');
                const data = bpjsVisits.map(v => [
                  v.tanggalKunjungan,
                  v.patient?.nomorRM || '',
                  v.patient?.nama || '',
                  v.diagnosa,
                  v.tindakan
                ]);
                exportToPDF(
                  ['Tanggal', 'No RM', 'Nama Pasien', 'Diagnosa', 'Tindakan'],
                  data,
                  'Laporan_Klaim_BPJS',
                  'LAPORAN KUNJUNGAN PASIEN BPJS'
                );
              }}
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="text-sm font-semibold">Laporan Klaim BPJS</div>
                <div className="text-xs text-slate-400">Summary bulanan BPJS</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                const luarWilayah = visitPatients.filter(v => v.patient?.wilayahKerja === 'Luar Wilayah');
                const data = luarWilayah.map(v => [
                  v.patient?.nama || '',
                  v.patient?.alamatDomisili || '',
                  v.diagnosa
                ]);
                exportToPDF(
                  ['Nama Pasien', 'Alamat', 'Diagnosa'],
                  data,
                  'Laporan_Luar_Wilayah',
                  'LAPORAN KUNJUNGAN PASIEN LUAR WILAYAH'
                );
              }}
            >
              <FileText className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="text-sm font-semibold">Laporan Luar Wilayah</div>
                <div className="text-xs text-slate-400">Pasien domisili luar Gowa</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
