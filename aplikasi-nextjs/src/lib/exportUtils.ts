import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Patient, Visit } from '../lib/data';

interface AutoTableDoc extends jsPDF {
  autoTable: (options: unknown) => jsPDF;
}

export const exportToExcel = (data: Record<string, unknown>[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (headers: string[], data: (string | number)[][], fileName: string, title: string) => {
  const doc = new jsPDF() as AutoTableDoc;
  doc.text(title, 14, 15);
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 20,
  });
  doc.save(`${fileName}.pdf`);
};

export const printPatientCard = (patient: Patient, visits: Visit[]) => {
  const doc = new jsPDF() as AutoTableDoc;

  // Header
  doc.setFontSize(16);
  doc.text('KARTU PASIEN PUSKESMAS SAMATA', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Dinas Kesehatan Pemerintah Kabupaten Gowa', 105, 26, { align: 'center' });
  doc.line(20, 30, 190, 30);

  // Biodata
  doc.setFontSize(12);
  doc.text('BIODATA PASIEN', 20, 40);
  doc.setFontSize(10);
  let y = 50;
  const labels = [
    ['Nama', patient.nama],
    ['Nomor RM', patient.nomorRM],
    ['NIK', patient.nik],
    ['Tgl Lahir', patient.tanggalLahir],
    ['Jenis Kelamin', patient.jenisKelamin],
    ['Asuransi', patient.asuransi],
    ['Wilayah', patient.wilayahKerja],
    ['Alamat', patient.alamatDomisili],
  ];

  labels.forEach(([label, value]) => {
    doc.text(`${label}`, 20, y);
    doc.text(`: ${value}`, 60, y);
    y += 7;
  });

  // Visit History
  y += 10;
  doc.setFontSize(12);
  doc.text('RIWAYAT KUNJUNGAN & REKAM MEDIK', 20, y);

  const visitHeaders = ['Tanggal', 'Keluhan', 'Diagnosa', 'Tindakan'];
  const visitData = visits.map(v => [
    v.tanggalKunjungan,
    v.keluhan,
    v.diagnosa,
    v.tindakan
  ]);

  doc.autoTable({
    head: [visitHeaders],
    body: visitData,
    startY: y + 5,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }
  });

  doc.save(`Kartu_Pasien_${patient.nomorRM}.pdf`);
};
