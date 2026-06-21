import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';

import MainLayout from '@app/shared/layouts/MainLayout';
import apiClient from '@app/shared/services/apiClient';
import { fetchTahunAjaran } from '@app/shared/services/tahunAjaran.service';
import { getStoredProfile, getStoredUser } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { fetchAbsensiForm, saveAbsensiBulk } from '@app/shared/absensi/guru/services/absensi.service';
import { toastError, toastSuccess } from '@app/shared/hooks/useConfirm';
import PageHeader from '@app/shared/components/PageHeader';

import {
  buildDefaultAbsensiContexts,
  buildMeetingDates,
  buildSemesterMonthOptions,
  formatMonthLabel,
} from '../guruTeachingUtils';

const STORAGE_KEY = 'guru_absensi_contexts_v2';
const SEMESTER_OPTIONS = ['Ganjil', 'Genap'];
const STATUS_OPTIONS = ['-', 'H', 'S', 'I', 'A'];
const FIXED_TIME = {
  jam_mulai: '07:00',
  jam_selesai: '08:30',
};

function readStoredContexts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistContexts(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
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
          <button type="button" className="btn-primary" onClick={onSubmit} style={{ background: '#111827', borderColor: '#111827' }}>
            {mode === 'create' ? 'Simpan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AbsensiInputView({ context, rows, loading, saving, onBack, onChange, onSave }) {
  const meetingDates = buildMeetingDates(context.bulan, 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title="Isi Absensi Murid"
        subtitle="Isi kehadiran murid untuk setiap pertemuan pada bulan yang dipilih."
      />

      <div className="glass" style={{ borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem 2rem' }}>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Tahun Ajaran</div><strong>{context.tahun_ajaran}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Semester</div><strong>{context.semester}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Bulan</div><strong>{formatMonthLabel(context.bulan)}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Kelas</div><strong>{context.nama_kelas}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Mata Pelajaran</div><strong>{context.nama_mapel}</strong></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: 'var(--color-text-dark)' }}>
        <span>Keterangan:</span>
        <span className="btn-outline" style={{ pointerEvents: 'none' }}>H = Hadir</span>
        <span className="btn-outline" style={{ pointerEvents: 'none' }}>S = Sakit</span>
        <span className="btn-outline" style={{ pointerEvents: 'none' }}>I = Izin</span>
        <span className="btn-outline" style={{ pointerEvents: 'none' }}>A = Alpha</span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th rowSpan="2">No</th>
              <th rowSpan="2">Nama Murid</th>
              <th rowSpan="2">NISN</th>
              <th colSpan={meetingDates.length} style={{ textAlign: 'center' }}>Pertemuan Ke-</th>
            </tr>
            <tr>
              {meetingDates.map((_, index) => (
                <th key={`meeting-${index + 1}`}>{index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3 + meetingDates.length} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat daftar absensi murid...
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id_user_siswa}>
                  <td>{rowIndex + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.nama_siswa || '-'}</td>
                  <td>{row.nisn || '-'}</td>
                  {meetingDates.map((dateValue, meetingIndex) => (
                    <td key={`${row.id_user_siswa}-${dateValue}`}>
                      <select
                        value={row.pertemuan?.[meetingIndex] || '-'}
                        onChange={(event) => onChange(row.id_user_siswa, meetingIndex, event.target.value)}
                        className="form-control"
                        style={{ minWidth: '90px' }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button type="button" className="btn-outline" onClick={onBack}>
          Kembali
        </button>
        <button type="button" className="btn-primary" onClick={onSave} disabled={saving} style={{ background: '#111827', borderColor: '#111827' }}>
          {saving ? 'Menyimpan...' : 'Simpan'}
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
        const storedContexts = readStoredContexts();
        const mergedContexts = storedContexts.length > 0 ? storedContexts : defaultContexts;

        if (active) {
          setJadwalList(jadwalRows);
          setTahunAjaranList(tahunAjaranResponse || []);
          setContexts(mergedContexts);
          persistContexts(mergedContexts);
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

  const openEdit = (row) => {
    setForm({
      id: row.id,
      tahun_ajaran: row.tahun_ajaran,
      semester: row.semester,
      bulan: row.bulan,
      id_kelas: String(row.id_kelas),
      id_mapel: String(row.id_mapel),
    });
    setView('edit');
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
    persistContexts(nextRows);
    setView('list');
    toastSuccess('Berhasil', form.id ? 'Data absensi berhasil diperbarui.' : 'Data absensi berhasil ditambahkan.');
  };

  const deleteContext = (row) => {
    if (!window.confirm(`Hapus konteks absensi ${row.nama_mapel} - ${row.nama_kelas}?`)) {
      return;
    }

    const nextRows = contexts.filter((item) => item.id !== row.id);
    setContexts(nextRows);
    persistContexts(nextRows);
    toastSuccess('Berhasil', 'Data absensi berhasil dihapus dari daftar kerja.');
  };

  const openInput = async (row) => {
    setActiveContext(row);
    setView('input');
    setInputLoading(true);

    try {
      const meetingDates = buildMeetingDates(row.bulan, 7);
      const responses = await Promise.all(
        meetingDates.map((dateValue) =>
          fetchAbsensiForm({
            id_kelas: Number(row.id_kelas),
            id_mapel: Number(row.id_mapel),
            tanggal: dateValue,
            jam_mulai: FIXED_TIME.jam_mulai,
            jam_selesai: FIXED_TIME.jam_selesai,
            tahun_ajaran: row.tahun_ajaran,
            semester: row.semester,
          })
        )
      );

      const rowMap = new Map();
      responses.forEach((response, meetingIndex) => {
        (response?.siswa || []).forEach((student) => {
          if (!rowMap.has(student.id_user_siswa)) {
            rowMap.set(student.id_user_siswa, {
              id_user_siswa: student.id_user_siswa,
              nama_siswa: student.nama_siswa,
              nisn: student.nisn,
              pertemuan: Array(meetingDates.length).fill('-'),
            });
          }

          rowMap.get(student.id_user_siswa).pertemuan[meetingIndex] = student.status || '-';
        });
      });

      setRows(Array.from(rowMap.values()));
    } catch (error) {
      console.error('Gagal memuat form absensi', error);
      toastError('Gagal', error?.response?.data?.message || 'Gagal memuat absensi murid.');
      setView('list');
      setActiveContext(null);
    } finally {
      setInputLoading(false);
    }
  };

  const handleStatusChange = (idUserSiswa, meetingIndex, value) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id_user_siswa === idUserSiswa
          ? {
              ...item,
              pertemuan: item.pertemuan.map((status, index) =>
                index === meetingIndex ? value : status
              ),
            }
          : item
      )
    );
  };

  const handleSaveAbsensi = async () => {
    if (!activeContext) return;

    const meetingDates = buildMeetingDates(activeContext.bulan, 7);
    setSaving(true);

    try {
      await Promise.all(
        meetingDates.map((dateValue, meetingIndex) =>
          saveAbsensiBulk({
            meta: {
              id_kelas: Number(activeContext.id_kelas),
              id_mapel: Number(activeContext.id_mapel),
              tanggal: dateValue,
              jam_mulai: FIXED_TIME.jam_mulai,
              jam_selesai: FIXED_TIME.jam_selesai,
              tahun_ajaran: activeContext.tahun_ajaran,
              semester: activeContext.semester,
            },
            items: rows.map((item) => ({
              id_user_siswa: item.id_user_siswa,
              status: item.pertemuan?.[meetingIndex] && item.pertemuan[meetingIndex] !== '-' ? item.pertemuan[meetingIndex] : 'H',
              keterangan: null,
            })),
          })
        )
      );

      toastSuccess('Berhasil', 'Absensi murid berhasil disimpan.');
      setView('list');
      setActiveContext(null);
    } catch (error) {
      console.error('Gagal menyimpan absensi', error);
      toastError('Gagal', error?.response?.data?.message || 'Gagal menyimpan absensi murid.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '-1.5rem', minHeight: 'calc(100vh - 84px)', background: 'var(--color-white)' }}>
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="Absensi Murid" subtitle="Kelola data absensi murid.">
              <button type="button" onClick={openCreate} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#111827', borderColor: '#111827' }}>
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
                            <button type="button" className="btn-icon edit" title="Edit" onClick={() => openEdit(row)}>
                              <Pencil size={16} />
                            </button>
                            <button type="button" className="btn-icon delete" title="Hapus" onClick={() => deleteContext(row)}>
                              <Trash2 size={16} />
                            </button>
                            <button type="button" className="btn-outline" onClick={() => openInput(row)}>
                              Isi Absensi
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

        {view === 'input' && activeContext && (
          <AbsensiInputView
            context={activeContext}
            rows={rows}
            loading={inputLoading}
            saving={saving}
            onBack={() => {
              setView('list');
              setActiveContext(null);
            }}
            onChange={handleStatusChange}
            onSave={handleSaveAbsensi}
          />
        )}
      </div>
    </MainLayout>
  );
}
