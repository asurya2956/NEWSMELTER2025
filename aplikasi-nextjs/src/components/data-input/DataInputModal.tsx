"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { WILAYAH_KERJA, ASURANSI, JENIS_KELAMIN, Patient } from '@/lib/data'
import { UserPlus, Edit } from 'lucide-react'

interface DataInputModalProps {
  onDataAdded: (newData: Patient) => void
  editPatient?: Patient
}

export default function DataInputModal({ onDataAdded, editPatient }: DataInputModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Patient>>({
    nama: '',
    nomorRM: '',
    nik: '',
    tanggalLahir: format(new Date(), 'yyyy-MM-dd'),
    alamatDomisili: '',
    jenisKelamin: 'Laki-laki',
    asuransi: 'BPJS',
    wilayahKerja: 'Samata'
  })

  useEffect(() => {
    if (editPatient) {
      setFormData(editPatient)
    }
  }, [editPatient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newData: Patient = {
      id: editPatient?.id || `p-${Date.now()}`,
      nama: formData.nama || '',
      nomorRM: formData.nomorRM || '',
      nik: formData.nik || '',
      tanggalLahir: formData.tanggalLahir || format(new Date(), 'yyyy-MM-dd'),
      alamatDomisili: formData.alamatDomisili || '',
      jenisKelamin: (formData.jenisKelamin as 'Laki-laki' | 'Perempuan') || 'Laki-laki',
      asuransi: (formData.asuransi as 'BPJS' | 'Umum') || 'BPJS',
      wilayahKerja: (formData.wilayahKerja as (typeof WILAYAH_KERJA)[number]) || 'Samata',
      createdAt: editPatient?.createdAt || new Date().toISOString()
    }

    onDataAdded(newData)
    setOpen(false)
    if (!editPatient) {
      setFormData({
        nama: '',
        nomorRM: '',
        nik: '',
        tanggalLahir: format(new Date(), 'yyyy-MM-dd'),
        alamatDomisili: '',
        jenisKelamin: 'Laki-laki',
        asuransi: 'BPJS',
        wilayahKerja: 'Samata'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editPatient ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Pasien Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPatient ? 'Edit Data Pasien' : 'Registrasi Pasien Baru'}</DialogTitle>
          <DialogDescription>
            Masukkan informasi biodata pasien secara lengkap.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Nama sesuai KTP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomorRM">Nomor RM (Rekam Medik)</Label>
              <Input
                id="nomorRM"
                value={formData.nomorRM}
                onChange={(e) => setFormData({...formData, nomorRM: e.target.value})}
                placeholder="Contoh: RM-0001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) => setFormData({...formData, nik: e.target.value})}
                placeholder="16 digit NIK"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select
                value={formData.jenisKelamin}
                onValueChange={(v) => setFormData({...formData, jenisKelamin: v as 'Laki-laki' | 'Perempuan'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_KELAMIN.map(jk => (
                    <SelectItem key={jk} value={jk}>{jk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asuransi</Label>
              <Select
                value={formData.asuransi}
                onValueChange={(v) => setFormData({...formData, asuransi: v as 'BPJS' | 'Umum'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {ASURANSI.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wilayah Kerja</Label>
              <Select
                value={formData.wilayahKerja}
                onValueChange={(v) => setFormData({...formData, wilayahKerja: v as (typeof WILAYAH_KERJA)[number]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {WILAYAH_KERJA.map(w => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat Domisili</Label>
            <Textarea
              id="alamat"
              value={formData.alamatDomisili}
              onChange={(e) => setFormData({...formData, alamatDomisili: e.target.value})}
              placeholder="Alamat lengkap saat ini"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editPatient ? 'Simpan Perubahan' : 'Simpan Data Pasien'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
