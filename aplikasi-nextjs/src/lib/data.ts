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

// Helper to generate mock patients
function generateMockPatients(): Patient[] {
  const names = [
    'Budi Santoso', 'Siti Aminah', 'Ahmad Hidayat', 'Dewi Sartika',
    'Andi Wijaya', 'Rina Pratama', 'Hendra Kusuma', 'Maya Indah',
    'Yudi Prasetyo', 'Lani Cahyani'
  ];

  const addresses = [
    'Jl. Malino No. 10', 'Perumahan Samata Permai', 'Komp. Tamarunang Indah',
    'Jl. Hertasning Baru', 'Desa Romangpolong', 'Jl. Pendidikan'
  ];

  return Array.from({ length: 20 }).map((_, i) => ({
    id: `p-${i + 1}`,
    nama: names[i % names.length],
    nomorRM: `RM-${String(i + 1).padStart(4, '0')}`,
    nik: `7306${Math.floor(Math.random() * 1000000000000)}`,
    tanggalLahir: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    alamatDomisili: addresses[i % addresses.length],
    jenisKelamin: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
    asuransi: i % 3 === 0 ? 'Umum' : 'BPJS',
    wilayahKerja: WILAYAH_KERJA[i % WILAYAH_KERJA.length],
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString()
  }));
}

// Helper to generate mock visits
function generateMockVisits(patients: Patient[]): Visit[] {
  const keluhanList = ['Demam dan batuk', 'Sakit kepala', 'Nyeri lambung', 'Kontrol rutin', 'Luka robek'];
  const diagnosaList = ['ISPA', 'Cephalgia', 'Gastritis', 'Sehat', 'Vulnus Laceratum'];
  const tindakanList = ['Pemberian Paracetamol', 'Istirahat cukup', 'Antasida', 'Edukasi kesehatan', 'Heacting'];

  const visits: Visit[] = [];
  patients.forEach(p => {
    const numVisits = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numVisits; i++) {
      visits.push({
        id: `v-${p.id}-${i}`,
        patientId: p.id,
        tanggalKunjungan: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0],
        keluhan: keluhanList[Math.floor(Math.random() * keluhanList.length)],
        diagnosa: diagnosaList[Math.floor(Math.random() * diagnosaList.length)],
        tindakan: tindakanList[Math.floor(Math.random() * tindakanList.length)],
        tekananDarah: '120/80',
        beratBadan: 60 + Math.floor(Math.random() * 20),
        tinggiBadan: 150 + Math.floor(Math.random() * 30),
        suhu: 36 + Math.random() * 2
      });
    }
  });
  return visits.sort((a, b) => new Date(b.tanggalKunjungan).getTime() - new Date(a.tanggalKunjungan).getTime());
}

export const INITIAL_PATIENTS = generateMockPatients();
export const INITIAL_VISITS = generateMockVisits(INITIAL_PATIENTS);
