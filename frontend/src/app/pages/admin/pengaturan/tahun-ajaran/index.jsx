import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Pencil,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronDown,
  X,
  AlertCircle,
  Users,
  GraduationCap,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

// ─── Data dummy (siap diganti dengan API) ────────────────────────────────────
const INITIAL_DATA = [
  {
    id: 1,
    tahun_ajaran: '2026/2027',
    semester: 'Ganjil',
    tanggal_mulai: '2026-07-15',
    tanggal_selesai: '2026-12-20',
    status: 'Aktif',
  },
  {
    id: 2,
    tahun_ajaran: '2025/2026',
    semester: 'Genap',
    tanggal_mulai: '2026-01-10',
    tanggal_selesai: '2026-06-30',
    status: 'Selesai',
  },
  {
    id: 3,
    tahun_ajaran: '2025/2026',
    semester: 'Ganjil',
    tanggal_mulai: '2025-07-14',
    tanggal_selesai: '2025-12-19',
    status: 'Selesai',
  },
  {
    id: 4,
    tahun_ajaran: '2024/2025',
    semester: 'Genap',
    tanggal_mulai: '2025-01-06',
    tanggal_selesai: '2025-06-28',
    status: 'Selesai',
  },
];

const FORM_DEFAULT = {
  tahun_ajaran: '',
  semester: 'Ganjil',
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'Tidak Aktif',
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
  const map = {
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Selesai: 'bg-slate-50 text-slate-500 border-slate-200',
    'Tidak Aktif': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${map[status] || map['Tidak Aktif']}`}>
      {status}
    </span>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────
function FormModal({ mode, form, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">
            {mode === 'add' ? 'Tambah Tahun Ajaran' : 'Edit Tahun Ajaran'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Tahun Ajaran */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tahun Ajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tahun_ajaran"
              value={form.tahun_ajaran}
              onChange={onChange}
              placeholder="contoh: 2027/2028"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Semester <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="semester"
                value={form.semester}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 appearance-none bg-white transition-all"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={form.tanggal_mulai}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={form.tanggal_selesai}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 appearance-none bg-white transition-all"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Info hanya 1 aktif */}
          {form.status === 'Aktif' && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Mengaktifkan tahun ajaran ini akan otomatis menonaktifkan tahun ajaran yang sedang aktif.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {mode === 'add' ? 'Tambah' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export default function TahunAjaranPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(INITIAL_DATA);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(FORM_DEFAULT);
  const [editId, setEditId] = useState(null);

  const aktif = data.find((d) => d.status === 'Aktif');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function openAdd() {
    setForm(FORM_DEFAULT);
    setEditId(null);
    setModal('add');
  }

  function openEdit(row) {
    setForm({
      tahun_ajaran: row.tahun_ajaran,
      semester: row.semester,
      tanggal_mulai: row.tanggal_mulai,
      tanggal_selesai: row.tanggal_selesai,
      status: row.status,
    });
    setEditId(row.id);
    setModal('edit');
  }

  function handleSubmit() {
    if (!form.tahun_ajaran || !form.tanggal_mulai || !form.tanggal_selesai) return;

    setData((prev) => {
      // Jika status Aktif, nonaktifkan yang lain
      let updated = form.status === 'Aktif'
        ? prev.map((d) => d.status === 'Aktif' ? { ...d, status: 'Selesai' } : d)
        : [...prev];

      if (modal === 'add') {
        const newId = Math.max(...updated.map((d) => d.id)) + 1;
        updated = [{ id: newId, ...form }, ...updated];
      } else {
        updated = updated.map((d) => d.id === editId ? { ...d, ...form } : d);
      }
      return updated;
    });
    setModal(null);
  }

  function handleUbahSemester() {
    if (!aktif) return;
    setData((prev) =>
      prev.map((d) =>
        d.id === aktif.id
          ? { ...d, semester: d.semester === 'Ganjil' ? 'Genap' : 'Ganjil' }
          : d
      )
    );
  }

  function handleNonaktifkan() {
    if (!aktif) return;
    setData((prev) =>
      prev.map((d) => d.id === aktif.id ? { ...d, status: 'Tidak Aktif' } : d)
    );
  }

  return (
    <AdminPageShell>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/admin/pengaturan')}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all shadow-sm group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
                <BookOpen size={22} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tahun Ajaran</h2>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">Kelola siklus akademik, semester, dan status berjalan.</p>
              </div>
            </div>
          </div>
          {/* Add Button removed from here, moved to Riwayat header */}
        </div>

        {/* Card Tahun Ajaran Aktif */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          {aktif ? (
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col xl:flex-row gap-8 justify-between">
                
                {/* Info Kiri & Tengah */}
                <div className="flex-1 flex flex-col md:flex-row gap-8">
                  {/* Bagian Utama (Tahun) */}
                  <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200/60 pb-6 md:pb-0 md:pr-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Tahun Ajaran Aktif
                      </span>
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">{aktif.tahun_ajaran}</h3>
                    <div className="text-lg text-emerald-600 font-bold mb-4">Semester {aktif.semester}</div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Calendar size={16} className="text-slate-400" />
                      {formatDate(aktif.tanggal_mulai)} <span className="mx-1 text-slate-300">—</span> {formatDate(aktif.tanggal_selesai)}
                    </div>
                  </div>

                  {/* Statistik removed as requested */}
                </div>

                {/* Aksi Kanan (Vertical Layout) */}
                <div className="flex flex-col gap-3 w-full xl:w-64 shrink-0 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 justify-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Aksi Manajemen</div>
                  
                  <button
                    onClick={handleUbahSemester}
                    className="w-full flex items-center justify-between gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 group"
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowRight size={16} /> Ganti Semester
                    </span>
                  </button>
                  
                  <button
                    onClick={() => openEdit(aktif)}
                    className="w-full flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <Pencil size={16} className="text-slate-400" /> Edit Data
                    </span>
                  </button>
                  
                  <button
                    onClick={handleNonaktifkan}
                    className="w-full flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 text-sm font-bold rounded-xl transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <XCircle size={16} className="text-red-400" /> Nonaktifkan
                    </span>
                  </button>
                </div>

              </div>

              {/* Quick Navigation removed as requested */}

            </div>
          ) : (
            <div className="relative bg-white/90 backdrop-blur-xl border border-amber-200 rounded-3xl p-8 flex items-center gap-4 shadow-xl shadow-amber-100/50">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">Sistem Menunggu Konfigurasi</h3>
                <p className="text-sm text-amber-700 mt-1 font-medium">
                  Belum ada tahun ajaran yang aktif. Silakan tambah tahun ajaran baru atau aktifkan dari riwayat di bawah.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabel Riwayat */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-6 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Riwayat Tahun Ajaran</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Total {data.length} data tersimpan dalam sistem</p>
            </div>
            <button
              onClick={openAdd}
              className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm shrink-0"
            >
              <Plus size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              Tambah Tahun Ajaran
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Tahun Ajaran</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Semester</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Masa Periode</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right w-[25%]">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-800 text-base">{row.tahun_ajaran}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                        {row.semester}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-700">{formatDate(row.tanggal_mulai)}</span>
                        <span className="text-xs font-medium text-slate-400">s/d {formatDate(row.tanggal_selesai)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(row)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all"
                          title="Edit Detail"
                        >
                          <Pencil size={15} />
                        </button>
                        {row.status !== 'Aktif' && (
                          <button
                            onClick={() =>
                              setData((prev) =>
                                prev.map((d) =>
                                  d.status === 'Aktif' ? { ...d, status: 'Selesai' } : d
                                ).map((d) => d.id === row.id ? { ...d, status: 'Aktif' } : d)
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            title="Aktifkan sebagai Tahun Ajaran Saat Ini"
                          >
                            <CheckCircle size={15} />
                            Aktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal */}
      {modal && (
        <FormModal
          mode={modal}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </AdminPageShell>
  );
}
