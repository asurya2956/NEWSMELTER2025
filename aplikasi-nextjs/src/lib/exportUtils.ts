import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Patient, Visit } from '../lib/data';

export const exportToExcel = (data: Record<string, unknown>[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (headers: string[], data: (string | number)[][], fileName: string, title: string) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 185, 129] }, // Emerald-600
  });

  doc.save(`${fileName}.pdf`);
};

export const printPatientCard = (patient: Patient, visits: Visit[]) => {
  const doc = new jsPDF();

  // Header Box
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 30);

  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text('KARTU PASIEN PUSKESMAS SAMATA', 105, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Dinas Kesehatan Pemerintah Kabupaten Gowa', 105, 30, { align: 'center' });

  // Patient Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text('INFORMASI PASIEN', 14, 55);
  doc.line(14, 57, 55, 57);

  const info = [
    ['Nama Pasien', `: ${patient.nama}`],
    ['Nomor Rekam Medik', `: ${patient.nomorRM}`],
    ['NIK', `: ${patient.nik}`],
    ['Tanggal Lahir', `: ${patient.tanggalLahir}`],
    ['Jenis Kelamin', `: ${patient.jenisKelamin}`],
    ['Wilayah Kerja', `: ${patient.wilayahKerja}`],
    ['Asuransi', `: ${patient.asuransi}`],
    ['Alamat Domisili', `: ${patient.alamatDomisili}`],
  ];

  doc.setFontSize(10);
  let y = 65;
  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, y);
    y += 7;
  });

  // Visit Table
  if (visits.length > 0) {
    doc.setFontSize(12);
    doc.text('RIWAYAT KUNJUNGAN & REKAM MEDIK', 14, y + 10);

    const visitHeaders = ['Tanggal', 'Keluhan', 'Diagnosa', 'Tindakan'];
    const visitData = visits.map(v => [
      v.tanggalKunjungan,
      v.keluhan,
      v.diagnosa,
      v.tindakan
    ]);

    autoTable(doc, {
      head: [visitHeaders],
      body: visitData,
      startY: y + 15,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 8 }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Belum ada riwayat kunjungan.', 14, y + 15);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, pageHeight - 10);

  doc.save(`Kartu_Pasien_${patient.nomorRM}.pdf`);
};

export const exportPatientCardToExcel = (patient: Patient, visits: Visit[]) => {
  const patientInfo = [
    { Kategori: 'Nama Pasien', Detail: patient.nama },
    { Kategori: 'Nomor RM', Detail: patient.nomorRM },
    { Kategori: 'NIK', Detail: patient.nik },
    { Kategori: 'Tanggal Lahir', Detail: patient.tanggalLahir },
    { Kategori: 'Jenis Kelamin', Detail: patient.jenisKelamin },
    { Kategori: 'Wilayah Kerja', Detail: patient.wilayahKerja },
    { Kategori: 'Asuransi', Detail: patient.asuransi },
    { Kategori: 'Alamat Domisili', Detail: patient.alamatDomisili },
  ];

  const visitData = visits.map(v => ({
    'Tanggal Kunjungan': v.tanggalKunjungan,
    'Keluhan': v.keluhan,
    'Diagnosa': v.diagnosa,
    'Tindakan': v.tindakan,
    'TD (mmHg)': v.tekananDarah || '-',
    'Suhu (°C)': v.suhu || '-',
    'BB (kg)': v.beratBadan || '-',
    'TB (cm)': v.tinggiBadan || '-'
  }));

  const wb = XLSX.utils.book_new();

  // Sheet 1: Biodata
  const ws1 = XLSX.utils.json_to_sheet(patientInfo);
  XLSX.utils.book_append_sheet(wb, ws1, 'Biodata Pasien');

  // Sheet 2: Riwayat Kunjungan
  const ws2 = XLSX.utils.json_to_sheet(visitData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Riwayat Kunjungan');

  XLSX.writeFile(wb, `Kartu_Pasien_${patient.nomorRM}.xlsx`);
};
