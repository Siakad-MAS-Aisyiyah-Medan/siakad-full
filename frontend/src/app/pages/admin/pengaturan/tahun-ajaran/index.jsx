import React, { useState, useEffect, useCallback } from 'react';
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
  Clock,
  ArrowRight,
  Save,
  Loader2,
  RefreshCw,
  Trash2,
  Check,
  History,
} from 'lucide-react';
import {
  fetchTahunAjaran,
  createTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
  activateTahunAjaran,
} from '@app/shared/services/tahunAjaran.service';
// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  const icons = { success: Check, error: X, warning: AlertCircle };
  const Icon = icons[type];

  return (
    <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl backdrop-blur-sm animate-in slide-in-from-right-2 fade-in duration-300 ${styles[type]}`}>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity"><X size={14} /></button>
    </div>
  );
}

// ─── Format Date ──────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    Aktif: {
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500 animate-pulse',
      label: 'Aktif',
    },
    Selesai: {
      classes: 'bg-slate-100 text-slate-600 border-slate-200/60',
      dot: 'bg-slate-400',
      label: 'Selesai',
    },
    'Tidak Aktif': {
      classes: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500',
      label: 'Nonaktif',
    },
  };

  const c = config[status] || config['Tidak Aktif'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Progress Indicator ───────────────────────────────────────────────────────
function calculateProgress(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  if (today < startDate) {
    const diffTime = Math.abs(startDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: 'upcoming', text: `Dimulai dalam ${diffDays} hari`, percent: 0, color: 'bg-blue-400' };
  } else if (today > endDate) {
    return { status: 'completed', text: 'Telah berakhir', percent: 100, color: 'bg-slate-400' };
  } else {
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    const percent = Math.round((elapsed / totalDuration) * 100);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: 'ongoing', text: `Sisa ${diffDays} hari`, percent, color: 'bg-emerald-500' };
  }
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function FormModal({ mode, form, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {mode === 'add' ? 'Tambah Tahun Ajaran' : 'Edit Tahun Ajaran'}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Konfigurasi periode akademik baru</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Tahun Ajaran */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Tahun Ajaran <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="tahun_ajaran"
              value={form.tahun_ajaran}
              onChange={onChange}
              placeholder="contoh: 2027/2028"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 bg-white font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Semester <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="semester"
                value={form.semester}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 appearance-none bg-white font-semibold text-slate-800 transition-all cursor-pointer"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Tanggal Mulai <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={form.tanggal_mulai}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 bg-white font-semibold text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Tanggal Selesai <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={form.tanggal_selesai}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 bg-white font-semibold text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 appearance-none bg-white font-semibold text-slate-800 transition-all cursor-pointer"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Warning */}
          {form.status === 'Aktif' && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200/60 rounded-xl p-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-800 leading-relaxed">
                Peringatan: Mengaktifkan tahun ajaran ini akan secara otomatis menonaktifkan tahun ajaran yang sedang aktif saat ini.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-800 transition-all shadow-sm"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={!form.tahun_ajaran || !form.tanggal_mulai || !form.tanggal_selesai}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md shadow-emerald-500/20 disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Save size={15} />
            {mode === 'add' ? 'Simpan Baru' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────
function DeleteConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Tahun Ajaran?</h3>
          <p className="text-sm text-slate-500">Data yang dihapus tidak dapat dikembalikan.</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-600 hover:bg-white transition-all">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md shadow-red-500/20">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Calendar size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Tahun Ajaran</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        Tambah tahun ajaran baru untuk memulai siklus akademik sekolah.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20"
      >
        <Plus size={16} />
        Tambah Tahun Ajaran
      </button>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export default function TahunAjaranPage() {
  const navigate = useNavigate();

  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const FORM_DEFAULT = {
    tahun_ajaran: '',
    semester: 'Ganjil',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'Tidak Aktif',
  };

  const [form, setForm] = useState(FORM_DEFAULT);
  const [editId, setEditId] = useState(null);

  // Active year
  const aktif = data.find((d) => d.status === 'Aktif');

  // ─── Load Data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTahunAjaran();
      setData(response);
    } catch (err) {
      showToast(err.message || 'Gagal memuat data tahun ajaran', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setForm(FORM_DEFAULT);
    setEditId(null);
    setModal('add');
  };

  const openEdit = (row) => {
    setForm({
      tahun_ajaran: row.tahun_ajaran,
      semester: row.semester,
      tanggal_mulai: row.tanggal_mulai,
      tanggal_selesai: row.tanggal_selesai,
      status: row.status,
    });
    setEditId(row.id);
    setModal('edit');
  };

  const handleSubmit = async () => {
    if (!form.tahun_ajaran || !form.tanggal_mulai || !form.tanggal_selesai) return;

    setSaving(true);

    try {
      if (modal === 'add') {
        await createTahunAjaran(form);
        showToast('Data berhasil disimpan');
      } else {
        await updateTahunAjaran(editId, form);
        showToast('Data berhasil disimpan');
      }

      await loadData();
      setModal(null);
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTahunAjaran(deleteTarget.id);
      await loadData();
      showToast('Data berhasil dihapus');
    } catch (err) {
      showToast(err.message || 'Gagal menghapus data', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleActivate = async (row) => {
    setSaving(true);
    try {
      await activateTahunAjaran(row.id);
      await loadData();
      showToast(`${row.tahun_ajaran} (${row.semester}) telah diaktifkan`);
    } catch (err) {
      showToast(err.message || 'Gagal mengaktifkan tahun ajaran', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminPageShell>
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8 animate-in fade-in duration-500">

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* ═══════ Hero Header ═══════ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-6 lg:p-8 shadow-xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative flex items-center gap-4">
            {/* ArrowLeft button removed since it's now in the sidebar */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg shrink-0">
                <BookOpen size={22} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight">Tahun Ajaran</h1>
                  {aktif && (
                    <span className="px-3 py-1 rounded-full bg-emerald-400/20 backdrop-blur-sm text-emerald-100 text-xs font-bold flex items-center gap-1.5 border border-emerald-400/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      {aktif.tahun_ajaran} ({aktif.semester})
                    </span>
                  )}
                </div>
                <p className="text-emerald-100 text-sm mt-1 font-medium">Kelola siklus akademik, semester, dan status berjalan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Active Academic Year Card ═══════ */}
        {aktif && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shrink-0">
                  <BookOpen size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-black text-slate-800">{aktif.tahun_ajaran}</h2>
                    <StatusBadge status={aktif.status} />
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold">
                      Semester {aktif.semester}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(aktif.tanggal_mulai)} &mdash; {formatDate(aktif.tanggal_selesai)}
                  </p>

                  {/* Progress Bar */}
                  {(() => {
                    const prog = calculateProgress(aktif.tanggal_mulai, aktif.tanggal_selesai);
                    return (
                      <div className="mt-4 max-w-md">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-500">Progress Semester</span>
                          <span className="text-xs font-bold text-slate-600">{prog.text}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${prog.color}`}
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => openEdit(aktif)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ History Table ═══════ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <History size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Riwayat Tahun Ajaran</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {loading ? 'Memuat...' : `${data.length} data tersimpan`}
                </p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              Tambah Baru
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
          ) : data.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-6 py-4 w-[22%]">Tahun Ajaran</th>
                    <th className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 py-4 w-[13%]">Semester</th>
                    <th className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 py-4 w-[22%]">Masa Periode</th>
                    <th className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 py-4 w-[13%]">Status</th>
                    <th className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-6 py-4 text-right w-[30%]">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {data.map((row) => {
                    const isActive = row.status === 'Aktif';
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors group ${
                          isActive ? 'bg-emerald-50/30' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <Calendar size={14} />
                            </div>
                            <div>
                              <span className={`font-bold ${isActive ? 'text-emerald-800' : 'text-slate-800'}`}>
                                {row.tahun_ajaran}
                              </span>
                              {isActive && (
                                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                  Berjalan
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
                            row.semester === 'Ganjil'
                              ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                              : 'bg-purple-50 text-purple-700 border-purple-200/60'
                          }`}>
                            {row.semester}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-700">{formatDate(row.tanggal_mulai)}</span>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <ArrowRight size={12} className="text-slate-300" />
                              <span>{formatDate(row.tanggal_selesai)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(row)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            {!isActive && (
                              <>
                                <button
                                  onClick={() => handleActivate(row)}
                                  disabled={saving}
                                  className="flex items-center gap-2 px-3.5 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Aktifkan"
                                >
                                  <CheckCircle size={14} />
                                  Aktifkan
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(row)}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition-all"
                                  title="Hapus"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">
            Sistem Informasi Akademik &mdash; MAS Aisyiyah Medan
          </p>
        </div>
      </div>

      {/* Form Modal */}
      {modal && (
        <FormModal
          mode={modal}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </AdminPageShell>
  );
}
