export interface Patient {
  id: string;
  nama: string;
  nomorRM: string;
  nik: string;
  tanggalLahir: string;
  alamatDomisili: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  asuransi: 'BPJS' | 'Umum';
  wilayahKerja: 'Tamarunang' | 'Romangpolong' | 'Samata' | 'Paccinongang' | 'Bontoramba' | 'Luar Wilayah';
  createdAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  tanggalKunjungan: string;
  keluhan: string;
  diagnosa: string;
  tindakan: string;
  tekananDarah?: string;
  beratBadan?: number;
  tinggiBadan?: number;
  suhu?: number;
}

export const WILAYAH_KERJA = [
  'Tamarunang',
  'Romangpolong',
  'Samata',
  'Paccinongang',
  'Bontoramba',
  'Luar Wilayah'
] as const;

export const ASURANSI = ['BPJS', 'Umum'] as const;
export const JENIS_KELAMIN = ['Laki-laki', 'Perempuan'] as const;

export const INITIAL_PATIENTS: Patient[] = [];
export const INITIAL_VISITS: Visit[] = [];
