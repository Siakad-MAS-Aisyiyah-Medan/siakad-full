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
      <div className="data-panel view-list">

        {/* Header */}
        <div className="panel-header glass mb-6 py-4 px-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/pengaturan')}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Tahun Ajaran</h2>
                  <p className="text-slate-500 text-sm">Kelola tahun ajaran dan semester yang sedang digunakan sistem.</p>
                </div>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-emerald-500/20 shrink-0 whitespace-nowrap"
            >
              <Plus size={16} />
              Tambah Tahun Ajaran
            </button>
          </div>
        </div>

        {/* Card Tahun Ajaran Aktif */}
        {aktif ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 mb-8 relative shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-2xl" />
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
              
              {/* Info Kiri */}
              <div className="flex gap-4 items-start flex-1">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Calendar size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tahun Ajaran Aktif</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-1">{aktif.tahun_ajaran}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium mb-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg">Semester {aktif.semester}</span>
                    <span className="text-slate-300">•</span>
                    <span>{formatDate(aktif.tanggal_mulai)} — {formatDate(aktif.tanggal_selesai)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 mr-1">Digunakan oleh:</span>
                    {['Data Murid', 'Data Kelas', 'Jadwal', 'PPDB', 'Laporan'].map((m) => (
                      <span key={m} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-bold shadow-sm">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aksi Kanan */}
              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={handleUbahSemester}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-xl transition-colors border border-emerald-100"
                >
                  <Pencil size={16} /> Ubah Semester
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEdit(aktif)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                  >
                    Edit Detail
                  </button>
                  <button
                    onClick={handleNonaktifkan}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-xl transition-colors"
                  >
                    Nonaktifkan
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700">
              Belum ada tahun ajaran yang aktif. Silakan tambah atau aktifkan tahun ajaran.
            </p>
          </div>
        )}

        {/* Tabel Riwayat */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Riwayat Tahun Ajaran</h3>
            <span className="text-xs text-slate-400">{data.length} data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Mulai</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Selesai</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{row.tahun_ajaran}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.semester}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(row.tanggal_mulai)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(row.tanggal_selesai)}</td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
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
                            className="flex items-center gap-1.5 px-3 py-1 border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors shadow-sm"
                            title="Aktifkan"
                          >
                            <CheckCircle size={14} />
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
