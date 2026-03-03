"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Patient, Visit, WILAYAH_KERJA, ASURANSI, JENIS_KELAMIN } from '@/lib/data'
import { Trash2, Search, Filter, Printer, Download, UserCheck, PlusCircle } from 'lucide-react'
import DataInputModal from '@/components/data-input/DataInputModal'
import { exportToExcel, exportToPDF, printPatientCard } from '@/lib/exportUtils'

interface PatientTableProps {
  patients: Patient[]
  visits: Visit[]
  onUpdate: (patient: Patient) => void
  onDelete: (id: string) => void
  onAddVisit: (patient: Patient) => void
}

export default function PatientTable({ patients, visits, onUpdate, onDelete, onAddVisit }: PatientTableProps) {
  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('All')
  const [filterInsurance, setFilterInsurance] = useState('All')
  const [filterGender, setFilterGender] = useState('All')

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(search.toLowerCase()) ||
                          p.nomorRM.toLowerCase().includes(search.toLowerCase()) ||
                          p.nik.includes(search)

    const matchesRegion = filterRegion === 'All' || p.wilayahKerja === filterRegion
    const matchesInsurance = filterInsurance === 'All' || p.asuransi === filterInsurance
    const matchesGender = filterGender === 'All' || p.jenisKelamin === filterGender

    return matchesSearch && matchesRegion && matchesInsurance && matchesGender
  })

  const handleExportExcel = () => {
    const data = filteredPatients.map(p => ({
      'Nomor RM': p.nomorRM,
      'Nama': p.nama,
      'NIK': p.nik,
      'Tgl Lahir': p.tanggalLahir,
      'L/P': p.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
      'Asuransi': p.asuransi,
      'Wilayah': p.wilayahKerja,
      'Alamat': p.alamatDomisili
    }));
    exportToExcel(data, `Data_Pasien_Puskesmas_Samata_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    const headers = ['RM', 'Nama', 'NIK', 'L/P', 'Asuransi', 'Wilayah'];
    const data = filteredPatients.map(p => [
      p.nomorRM,
      p.nama,
      p.nik,
      p.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
      p.asuransi,
      p.wilayahKerja
    ]);
    exportToPDF(headers, data, `Data_Pasien_Puskesmas_Samata_${new Date().toISOString().split('T')[0]}`, 'DATA PASIEN PUSKESMAS SAMATA');
  };

  const handlePrintCard = (patient: Patient) => {
    const patientVisits = visits.filter(v => v.patientId === patient.id);
    printPatientCard(patient, patientVisits);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari Nama, Nomor RM, atau NIK..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportExcel}>
              <Download className="w-4 h-4" /> Excel
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPDF}>
              <Printer className="w-4 h-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
          </div>

          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Wilayah Kerja" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Wilayah</SelectItem>
              {WILAYAH_KERJA.map(w => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterInsurance} onValueChange={setFilterInsurance}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Asuransi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Asuransi</SelectItem>
              {ASURANSI.map(a => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Kelamin</SelectItem>
              {JENIS_KELAMIN.map(jk => (
                <SelectItem key={jk} value={jk}>{jk}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={() => {
            setSearch('')
            setFilterRegion('All')
            setFilterInsurance('All')
            setFilterGender('All')
          }}>
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold">Nomor RM</TableHead>
              <TableHead className="font-bold">Nama Pasien</TableHead>
              <TableHead className="font-bold">NIK</TableHead>
              <TableHead className="font-bold">L/P</TableHead>
              <TableHead className="font-bold">Wilayah</TableHead>
              <TableHead className="font-bold">Asuransi</TableHead>
              <TableHead className="text-right font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-emerald-700">{p.nomorRM}</TableCell>
                  <TableCell className="font-medium">{p.nama}</TableCell>
                  <TableCell className="text-slate-600">{p.nik}</TableCell>
                  <TableCell>{p.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</TableCell>
                  <TableCell>{p.wilayahKerja}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      p.asuransi === 'BPJS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {p.asuransi}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Tambah Kunjungan"
                        onClick={() => onAddVisit(p)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Cetak Kartu Pasien"
                        onClick={() => handlePrintCard(p)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <DataInputModal editPatient={p} onDataAdded={onUpdate} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus Pasien"
                        onClick={() => onDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  Data pasien tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          Menampilkan {filteredPatients.length} dari {patients.length} pasien
        </div>
      </div>
    </div>
  )
}
