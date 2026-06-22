import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';

import MainLayout from '@/shared/layouts/MainLayout';
import apiClient from '@/shared/services/apiClient';
import { fetchTahunAjaran } from '@/shared/services/tahunAjaran.service';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import { fetchAbsensiForm, saveAbsensiBulk, fetchHistoryAbsensi } from '@/shared/absensi/guru/services/absensi.service';
import { toastError, toastSuccess } from '@/shared/hooks/useConfirm';
import PageHeader from '@/shared/components/PageHeader';

import {
  buildDefaultAbsensiContexts,
  buildMeetingDates,
  buildSemesterMonthOptions,
  formatMonthLabel,
} from '../guruTeachingUtils';

const STORAGE_KEY_PREFIX = 'guru_absensi_contexts_v3_';
const SEMESTER_OPTIONS = ['Ganjil', 'Genap'];
const STATUS_OPTIONS = ['-', 'H', 'S', 'I', 'A'];
const FIXED_TIME = {
  jam_mulai: '07:00',
  jam_selesai: '08:30',
};

function getStorageKey(user) {
  return `${STORAGE_KEY_PREFIX}${user?.id_user || 'default'}`;
}

function readStoredContexts(user) {
  try {
    const raw = localStorage.getItem(getStorageKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => 
      item &&
      item.id_kelas &&
      item.id_mapel &&
      !isNaN(Number(item.id_kelas)) &&
      !isNaN(Number(item.id_mapel))
    );
  } catch {
    return [];
  }
}

function persistContexts(user, rows) {
  localStorage.setItem(getStorageKey(user), JSON.stringify(rows));
}

function buildContextId(meta) {
  return `${meta.tahun_ajaran}|${meta.semester}|${meta.bulan}|${meta.id_kelas}|${meta.id_mapel}`;
}

function getActiveAcademicYear(tahunAjaranList) {
  const active = (tahunAjaranList || []).find((item) => String(item.status || '').toLowerCase() === 'aktif');
  return active?.tahun_ajaran || tahunAjaranList?.[0]?.tahun_ajaran || '2025/2026';
}

function getDefaultMonth(tahunAjaran, semester) {
  const options = buildSemesterMonthOptions(tahunAjaran, semester);
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return options.find((item) => item.value === current)?.value || options[0]?.value || '';
}

function AbsensiContextForm({
  mode,
  form,
  tahunAjaranOptions,
  kelasOptions,
  mapelOptions,
  monthOptions,
  onChange,
  onCancel,
  onSubmit,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title={mode === 'create' ? 'Tambah Absensi' : 'Edit Absensi'}
        subtitle={mode === 'create' ? 'Lengkapi data berikut untuk menambahkan absensi murid.' : 'Ubah data absensi yang telah dibuat.'}
      />

      <div className="form-panel glass" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Tahun Ajaran *</label>
            <select name="tahun_ajaran" value={form.tahun_ajaran} onChange={onChange} className="form-control" required>
              <option value="">-- Masukkan tahun ajaran --</option>
              {tahunAjaranOptions.map((item) => (
                <option key={item.id_tahun_ajaran || item.tahun_ajaran} value={item.tahun_ajaran}>
                  {item.tahun_ajaran}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Semester *</label>
            <select name="semester" value={form.semester} onChange={onChange} className="form-control" required>
              <option value="">-- Masukkan semester --</option>
              {SEMESTER_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Bulan *</label>
            <select name="bulan" value={form.bulan} onChange={onChange} className="form-control" required>
              <option value="">-- Pilih bulan --</option>
              {monthOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Kelas *</label>
            <select name="id_kelas" value={form.id_kelas} onChange={onChange} className="form-control" required>
              <option value="">-- Pilih kelas --</option>
              {kelasOptions.map((item) => (
                <option key={item.id_kelas} value={item.id_kelas}>
                  {item.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Mata Pelajaran *</label>
            <select name="id_mapel" value={form.id_mapel} onChange={onChange} className="form-control" required>
              <option value="">-- Pilih mata pelajaran --</option>
              {mapelOptions.map((item) => (
                <option key={item.id_mapel} value={item.id_mapel}>
                  {item.nama_mapel}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn-outline" onClick={onCancel}>
            Batal
          </button>
          <button type="button" className="btn-primary" onClick={onSubmit}>
            {mode === 'create' ? 'Simpan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getDayName(dateStr) {
  if (!dateStr) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(date.getTime()) ? '' : days[date.getDay()];
}

function AbsensiHistoryView({ context, onBack }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetchHistoryAbsensi({
          id_kelas: context.id_kelas,
          id_mapel: context.id_mapel
        });
        setHistoryList(res || []);
      } catch (err) {
        console.error(err);
        toastError('Gagal', 'Gagal memuat riwayat absensi');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [context]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title="Riwayat Absensi Kelas"
        subtitle={`Riwayat absensi untuk kelas ${context.nama_kelas} - ${context.nama_mapel}`}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" className="btn-outline" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Hari</th>
              <th>Jam Pelajaran</th>
              <th style={{ textAlign: 'center' }}>Hadir</th>
              <th style={{ textAlign: 'center' }}>Sakit</th>
              <th style={{ textAlign: 'center' }}>Izin</th>
              <th style={{ textAlign: 'center' }}>Alpa</th>
              <th style={{ textAlign: 'center' }}>Terlambat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat riwayat absensi...
                </td>
              </tr>
            ) : historyList.length > 0 ? (
              historyList.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.tanggal}</td>
                  <td>{getDayName(row.tanggal)}</td>
                  <td>{row.jam_mulai} - {row.jam_selesai}</td>
                  <td style={{ textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{row.count_hadir || 0}</td>
                  <td style={{ textAlign: 'center', color: '#3B82F6', fontWeight: 600 }}>{row.count_sakit || 0}</td>
                  <td style={{ textAlign: 'center', color: '#F59E0B', fontWeight: 600 }}>{row.count_izin || 0}</td>
                  <td style={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{row.count_alpa || 0}</td>
                  <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>{row.count_terlambat || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Belum ada riwayat absensi untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TambahAbsensiView({ context, onBack }) {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jam_mulai: '07:00',
    jam_selesai: '08:30',
  });
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadStudents() {
      setLoadingStudents(true);
      try {
        const res = await fetchAbsensiForm({
          id_kelas: context.id_kelas,
          id_mapel: context.id_mapel,
          tanggal: form.tanggal,
          jam_mulai: form.jam_mulai,
          jam_selesai: form.jam_selesai,
          tahun_ajaran: context.tahun_ajaran,
          semester: context.semester,
        });
        if (active) {
          const rows = (res?.siswa || []).map(s => ({
            id_user_siswa: s.id_user_siswa,
            nama_siswa: s.nama_siswa,
            nisn: s.nisn,
            status: s.status || 'H',
            keterangan: s.keterangan || ''
          }));
          setStudents(rows);
        }
      } catch (err) {
        console.error(err);
        toastError('Gagal', 'Gagal memuat daftar murid');
      } finally {
        if (active) setLoadingStudents(false);
      }
    }
    loadStudents();
    return () => { active = false; };
  }, [form.tanggal, form.jam_mulai, form.jam_selesai, context]);

  const handleStatusChange = (studentId, status) => {
    setStudents(prev => prev.map(s => s.id_user_siswa === studentId ? { ...s, status } : s));
  };

  const handleSetAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = async () => {
    if (students.length === 0) {
      toastError('Gagal', 'Tidak ada murid untuk diabsen');
      return;
    }
    setSaving(true);
    try {
      await saveAbsensiBulk({
        meta: {
          id_kelas: context.id_kelas,
          id_mapel: context.id_mapel,
          tanggal: form.tanggal,
          jam_mulai: form.jam_mulai,
          jam_selesai: form.jam_selesai,
          tahun_ajaran: context.tahun_ajaran,
          semester: context.semester,
        },
        items: students.map(s => ({
          id_user_siswa: s.id_user_siswa,
          status: s.status,
          keterangan: s.keterangan || null
        }))
      });
      toastSuccess('Berhasil', 'Absensi berhasil disimpan');
      onBack();
    } catch (err) {
      console.error(err);
      toastError('Gagal', err?.response?.data?.message || 'Gagal menyimpan absensi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title="Tambah Absensi Kelas"
        subtitle={`Input absensi untuk kelas ${context.nama_kelas} - ${context.nama_mapel}`}
      />

      <div className="glass" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Tanggal</label>
            <input 
              type="date" 
              className="form-control" 
              value={form.tanggal} 
              onChange={e => setForm(prev => ({ ...prev, tanggal: e.target.value }))} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Hari</label>
            <input 
              type="text" 
              className="form-control" 
              value={getDayName(form.tanggal)} 
              readOnly 
              style={{ background: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Jam Mulai</label>
            <input 
              type="time" 
              className="form-control" 
              value={form.jam_mulai} 
              onChange={e => setForm(prev => ({ ...prev, jam_mulai: e.target.value }))} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Jam Selesai</label>
            <input 
              type="time" 
              className="form-control" 
              value={form.jam_selesai} 
              onChange={e => setForm(prev => ({ ...prev, jam_selesai: e.target.value }))} 
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>Set Semua Ke:</span>
          <button type="button" className="btn-outline" onClick={() => handleSetAll('H')} style={{ borderColor: '#10B981', color: '#10B981', background: 'transparent' }}>Hadir (H)</button>
          <button type="button" className="btn-outline" onClick={() => handleSetAll('S')} style={{ borderColor: '#3B82F6', color: '#3B82F6', background: 'transparent' }}>Sakit (S)</button>
          <button type="button" className="btn-outline" onClick={() => handleSetAll('I')} style={{ borderColor: '#F59E0B', color: '#F59E0B', background: 'transparent' }}>Izin (I)</button>
          <button type="button" className="btn-outline" onClick={() => handleSetAll('A')} style={{ borderColor: '#EF4444', color: '#EF4444', background: 'transparent' }}>Alpa (A)</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>NISN</th>
              <th style={{ textAlign: 'center' }}>Hadir (H)</th>
              <th style={{ textAlign: 'center' }}>Sakit (S)</th>
              <th style={{ textAlign: 'center' }}>Izin (I)</th>
              <th style={{ textAlign: 'center' }}>Alpa (A)</th>
            </tr>
          </thead>
          <tbody>
            {loadingStudents ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat daftar murid...
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student, idx) => (
                <tr key={student.id_user_siswa}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{student.nama_siswa}</td>
                  <td>{student.nisn}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`status-${student.id_user_siswa}`} 
                      checked={student.status === 'H'} 
                      onChange={() => handleStatusChange(student.id_user_siswa, 'H')}
                      style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: '#10B981' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`status-${student.id_user_siswa}`} 
                      checked={student.status === 'S'} 
                      onChange={() => handleStatusChange(student.id_user_siswa, 'S')}
                      style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: '#3B82F6' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`status-${student.id_user_siswa}`} 
                      checked={student.status === 'I'} 
                      onChange={() => handleStatusChange(student.id_user_siswa, 'I')}
                      style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: '#F59E0B' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`status-${student.id_user_siswa}`} 
                      checked={student.status === 'A'} 
                      onChange={() => handleStatusChange(student.id_user_siswa, 'A')}
                      style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: '#EF4444' }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Tidak ada data murid untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button type="button" className="btn-outline" onClick={onBack}>
          Kembali
        </button>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving || students.length === 0}>
          {saving ? 'Menyimpan...' : 'Simpan Absensi'}
        </button>
      </div>
    </div>
  );
}

export default function GuruAbsensiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [view, setView] = useState('list');
  const [jadwalList, setJadwalList] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [contexts, setContexts] = useState([]);
  const [form, setForm] = useState({
    id: '',
    tahun_ajaran: '',
    semester: 'Ganjil',
    bulan: '',
    id_kelas: '',
    id_mapel: '',
  });
  const [activeContext, setActiveContext] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputLoading, setInputLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [jadwalResponse, tahunAjaranResponse] = await Promise.all([
          apiClient.get('/guru/jadwal'),
          fetchTahunAjaran(),
        ]);

        const jadwalRows = Array.isArray(jadwalResponse?.data?.data) ? jadwalResponse.data.data : [];
        const activeYear = getActiveAcademicYear(tahunAjaranResponse || []);
        const currentMonth = getDefaultMonth(activeYear, 'Ganjil');
        const defaultContexts = buildDefaultAbsensiContexts(jadwalRows, currentMonth);
        const storedContexts = readStoredContexts(user);
        const mergedContexts = storedContexts.length > 0 ? storedContexts : defaultContexts;

        if (active) {
          setJadwalList(jadwalRows);
          setTahunAjaranList(tahunAjaranResponse || []);
          setContexts(mergedContexts);
          persistContexts(user, mergedContexts);
        }
      } catch (error) {
        console.error('Gagal memuat data absensi guru', error);
        if (active) {
          setJadwalList([]);
          setTahunAjaranList([]);
          setContexts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const monthOptions = useMemo(
    () => buildSemesterMonthOptions(form.tahun_ajaran, form.semester),
    [form.semester, form.tahun_ajaran]
  );

  const kelasOptions = useMemo(() => {
    const map = new Map();

    jadwalList
      .filter((item) => {
        if (form.tahun_ajaran && item.tahun_ajaran !== form.tahun_ajaran) return false;
        if (form.semester && item.semester !== form.semester) return false;
        return true;
      })
      .forEach((item) => {
        if (!map.has(item.id_kelas)) {
          map.set(item.id_kelas, {
            id_kelas: item.id_kelas,
            nama_kelas: item.kelas?.nama_kelas || '-',
          });
        }
      });

    return Array.from(map.values());
  }, [form.semester, form.tahun_ajaran, jadwalList]);

  const mapelOptions = useMemo(() => {
    const map = new Map();

    jadwalList
      .filter((item) => {
        if (form.tahun_ajaran && item.tahun_ajaran !== form.tahun_ajaran) return false;
        if (form.semester && item.semester !== form.semester) return false;
        if (form.id_kelas && String(item.id_kelas) !== String(form.id_kelas)) return false;
        return true;
      })
      .forEach((item) => {
        if (!map.has(item.id_mapel)) {
          map.set(item.id_mapel, {
            id_mapel: item.id_mapel,
            nama_mapel: item.mapel?.nama_mapel || '-',
          });
        }
      });

    return Array.from(map.values());
  }, [form.id_kelas, form.semester, form.tahun_ajaran, jadwalList]);

  const contextRows = useMemo(() => {
    return contexts.map((row) => ({
      ...row,
      nama_bulan: formatMonthLabel(row.bulan),
      nama_kelas:
        row.nama_kelas ||
        jadwalList.find((item) => String(item.id_kelas) === String(row.id_kelas))?.kelas?.nama_kelas ||
        '-',
      nama_mapel:
        row.nama_mapel ||
        jadwalList.find((item) => String(item.id_mapel) === String(row.id_mapel))?.mapel?.nama_mapel ||
        '-',
    }));
  }, [contexts, jadwalList]);

  const openCreate = () => {
    const tahunAjaran = getActiveAcademicYear(tahunAjaranList);
    const semester = 'Ganjil';
    setForm({
      id: '',
      tahun_ajaran: tahunAjaran,
      semester,
      bulan: getDefaultMonth(tahunAjaran, semester),
      id_kelas: '',
      id_mapel: '',
    });
    setView('create');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'tahun_ajaran' || name === 'semester') {
        next.id_kelas = '';
        next.id_mapel = '';
        next.bulan = getDefaultMonth(name === 'tahun_ajaran' ? value : next.tahun_ajaran, name === 'semester' ? value : next.semester);
      }

      if (name === 'id_kelas') {
        next.id_mapel = '';
      }

      return next;
    });
  };

  const saveContext = () => {
    if (!form.tahun_ajaran || !form.semester || !form.bulan || !form.id_kelas || !form.id_mapel) {
      toastError('Gagal', 'Semua field wajib diisi.');
      return;
    }

    const kelas = kelasOptions.find((item) => String(item.id_kelas) === String(form.id_kelas));
    const mapel = mapelOptions.find((item) => String(item.id_mapel) === String(form.id_mapel));
    const nextContext = {
      id: form.id || buildContextId(form),
      tahun_ajaran: form.tahun_ajaran,
      semester: form.semester,
      bulan: form.bulan,
      id_kelas: Number(form.id_kelas),
      id_mapel: Number(form.id_mapel),
      nama_kelas: kelas?.nama_kelas || '-',
      nama_mapel: mapel?.nama_mapel || '-',
    };

    const nextRows = form.id
      ? contexts.map((item) => (item.id === form.id ? { ...item, ...nextContext } : item))
      : [...contexts.filter((item) => item.id !== nextContext.id), nextContext];

    setContexts(nextRows);
    persistContexts(user, nextRows);
    setView('list');
    toastSuccess('Berhasil', form.id ? 'Data absensi berhasil diperbarui.' : 'Data absensi berhasil ditambahkan.');
  };

  const deleteContext = (row) => {
    if (!window.confirm(`Hapus konteks absensi ${row.nama_mapel} - ${row.nama_kelas}?`)) {
      return;
    }

    const nextRows = contexts.filter((item) => item.id !== row.id);
    setContexts(nextRows);
    persistContexts(user, nextRows);
    toastSuccess('Berhasil', 'Data absensi berhasil dihapus dari daftar kerja.');
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '-1.5rem', minHeight: 'calc(100vh - 84px)', background: 'var(--color-white)' }}>
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="Absensi Murid" subtitle="Kelola data absensi murid.">
              <button type="button" onClick={openCreate} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <Plus size={18} />
                Tambah Absensi
              </button>
            </PageHeader>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tahun Ajaran</th>
                    <th>Semester</th>
                    <th>Bulan</th>
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Memuat data absensi...
                      </td>
                    </tr>
                  ) : contextRows.length > 0 ? (
                    contextRows.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.tahun_ajaran}</td>
                        <td>{row.semester}</td>
                        <td>{row.nama_bulan}</td>
                        <td>{row.nama_kelas}</td>
                        <td>{row.nama_mapel}</td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            <button type="button" className="btn-icon edit" title="Tambah Absensi" onClick={() => {
                              setActiveContext(row);
                              setView('tambah_absen');
                            }}>
                              <Plus size={16} />
                            </button>
                            <button type="button" className="btn-icon delete" title="Hapus" onClick={() => deleteContext(row)}>
                              <Trash2 size={16} />
                            </button>
                            <button type="button" className="btn-outline" onClick={() => {
                              setActiveContext(row);
                              setView('history');
                            }}>
                              History Absensi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Belum ada daftar absensi. Tambahkan data absensi terlebih dahulu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(view === 'create' || view === 'edit') && (
          <AbsensiContextForm
            mode={view}
            form={form}
            tahunAjaranOptions={tahunAjaranList}
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            monthOptions={monthOptions}
            onChange={handleFormChange}
            onCancel={() => setView('list')}
            onSubmit={saveContext}
          />
        )}

        {view === 'history' && activeContext && (
          <AbsensiHistoryView
            context={activeContext}
            onBack={() => {
              setView('list');
              setActiveContext(null);
            }}
          />
        )}

        {view === 'tambah_absen' && activeContext && (
          <TambahAbsensiView
            context={activeContext}
            onBack={() => {
              setView('list');
              setActiveContext(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
