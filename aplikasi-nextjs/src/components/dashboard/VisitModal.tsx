import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Patient, Visit } from '@/lib/data';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientId: string, visit: Omit<Visit, 'id' | 'patientId'>) => void;
  patient: Patient | null;
}

export const VisitModal: React.FC<VisitModalProps> = ({ isOpen, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState({
    tanggalKunjungan: new Date().toISOString().split('T')[0],
    keluhan: '',
    diagnosa: '',
    tindakan: '',
    tekananDarah: '',
    beratBadan: 0,
    tinggiBadan: 0,
    suhu: 36.5
  });

  if (!isOpen || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(patient.id, formData);
    setFormData({
      tanggalKunjungan: new Date().toISOString().split('T')[0],
      keluhan: '',
      diagnosa: '',
      tindakan: '',
      tekananDarah: '',
      beratBadan: 0,
      tinggiBadan: 0,
      suhu: 36.5
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Tambah Rekam Medik / Kunjungan</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg mb-4">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Pasien</p>
            <p className="font-bold text-emerald-900">{patient.nama} ({patient.nomorRM})</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Kunjungan</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.tanggalKunjungan}
                onChange={e => setFormData({...formData, tanggalKunjungan: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Keluhan Utama</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Demam tinggi sejak semalam"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.keluhan}
                onChange={e => setFormData({...formData, keluhan: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Diagnosa</label>
              <input
                type="text"
                required
                placeholder="Contoh: ISPA, Gastritis, dll"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.diagnosa}
                onChange={e => setFormData({...formData, diagnosa: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tindakan / Terapi</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Paracetamol 500mg 3x1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.tindakan}
                onChange={e => setFormData({...formData, tindakan: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TD (mmHg)</label>
              <input
                type="text"
                placeholder="120/80"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.tekananDarah}
                onChange={e => setFormData({...formData, tekananDarah: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Suhu (°C)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.suhu}
                onChange={e => setFormData({...formData, suhu: parseFloat(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BB (kg)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.beratBadan}
                onChange={e => setFormData({...formData, beratBadan: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TB (cm)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.tinggiBadan}
                onChange={e => setFormData({...formData, tinggiBadan: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all text-sm"
            >
              Simpan Rekam Medik
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
