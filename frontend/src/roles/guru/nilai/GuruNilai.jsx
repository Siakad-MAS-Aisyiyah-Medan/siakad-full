import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, Pencil, Plus, Trash2 } from 'lucide-react';

import MainLayout from '@/shared/layouts/MainLayout';
import apiClient from '@/shared/services/apiClient';
import { fetchTahunAjaran } from '@/shared/services/tahunAjaran.service';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import { fetchNilaiForm, saveNilaiBulk } from '@/shared/nilai/guru/services/nilai.service';
import { toastError, toastSuccess } from '@/shared/hooks/useConfirm';
import PageHeader from '@/shared/components/PageHeader';

import { buildDefaultNilaiContexts } from '../guruTeachingUtils';

const STORAGE_KEY_PREFIX = 'guru_nilai_contexts_v3_';
const SEMESTER_OPTIONS = ['Ganjil', 'Genap'];
const NILAI_COMPONENT_OPTIONS = [
  { value: 'nilai_tugas', label: 'Tugas' },
  { value: 'nilai_uts', label: 'UTS' },
  { value: 'nilai_uas', label: 'UAS' },
];

function getNilaiComponentLabel(value) {
  return NILAI_COMPONENT_OPTIONS.find((item) => item.value === value)?.label || 'Nilai';
}

function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}${userId || 'default'}`;
}

function readStoredContexts(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
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

function persistContexts(userId, rows) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(rows));
}

function buildContextId(meta) {
  return `${meta.tahun_ajaran}|${meta.semester}|${meta.id_kelas}|${meta.id_mapel}`;
}

function getActiveAcademicYear(tahunAjaranList) {
  const active = (tahunAjaranList || []).find((item) => String(item.status || '').toLowerCase() === 'aktif');
  return active?.tahun_ajaran || tahunAjaranList?.[0]?.tahun_ajaran || '2025/2026';
}

function NilaiContextForm({
  mode,
  form,
  tahunAjaranOptions,
  kelasOptions,
  mapelOptions,
  onChange,
  onCancel,
  onSubmit,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title={mode === 'create' ? 'Tambah Daftar Nilai' : 'Edit Daftar Nilai'}
        subtitle={mode === 'create' ? 'Isi data berikut untuk menambahkan daftar nilai murid.' : 'Ubah data berikut untuk memperbarui daftar nilai murid.'}
      />

      <div className="form-panel glass" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Tahun Ajaran *</label>
            <select name="tahun_ajaran" value={form.tahun_ajaran} onChange={onChange} className="form-control" required>
              <option value="">Pilih Tahun Ajaran</option>
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
              <option value="">Pilih Semester</option>
              {SEMESTER_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', alignItems: 'center', gap: '1.25rem' }}>
            <label className="form-label">Kelas *</label>
            <select name="id_kelas" value={form.id_kelas} onChange={onChange} className="form-control" required>
              <option value="">Pilih Kelas</option>
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
              <option value="">Pilih Mata Pelajaran</option>
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

function NilaiInputView({ context, siswaRows, loading, saving, activeComponent, onComponentChange, onBack, onChange, onSave }) {
  const activeLabel = getNilaiComponentLabel(activeComponent);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title={`Input Nilai ${activeLabel}`}
        subtitle="Pilih satu komponen nilai, lalu isi nilai murid untuk komponen tersebut."
      />

      <div className="glass" style={{ borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Tahun Ajaran</div><strong>{context.tahun_ajaran}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Semester</div><strong>{context.semester}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Kelas</div><strong>{context.nama_kelas}</strong></div>
          <div><div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Mata Pelajaran</div><strong>{context.nama_mapel}</strong></div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Komponen Nilai</div>
            <div style={{ display: 'inline-flex', padding: '4px', border: '1px solid var(--color-border)', borderRadius: '10px', background: '#f8fafc', gap: '4px' }}>
              {NILAI_COMPONENT_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onComponentChange(item.value)}
                  style={{
                    height: '32px',
                    minWidth: '64px',
                    padding: '0 0.75rem',
                    border: '1px solid transparent',
                    borderRadius: '8px',
                    background: activeComponent === item.value ? '#fff' : 'transparent',
                    color: activeComponent === item.value ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    boxShadow: activeComponent === item.value ? '0 1px 4px rgba(15, 23, 42, 0.12)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th rowSpan="2">No</th>
              <th rowSpan="2">NISN</th>
              <th rowSpan="2">Nama Murid</th>
              <th colSpan="3" style={{ textAlign: 'center' }}>Nilai Tersimpan</th>
              <th rowSpan="2" style={{ minWidth: '180px' }}>{activeLabel}</th>
            </tr>
            <tr>
              <th>Tugas</th>
              <th>UTS</th>
              <th>UAS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat daftar murid...
                </td>
              </tr>
            ) : siswaRows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Tidak ada murid di kelas ini. Pastikan admin telah menambahkan murid ke kelas ini.
                </td>
              </tr>
            ) : (
              siswaRows.map((row, index) => (
                <tr key={row.id_user_siswa}>
                  <td>{index + 1}</td>
                  <td>{row.nisn || '-'}</td>
                  <td style={{ fontWeight: 600 }}>{row.nama_siswa || '-'}</td>
                  {['nilai_tugas', 'nilai_uts', 'nilai_uas'].map((field) => (
                    <td key={field}>
                      {row[field] !== null && row[field] !== undefined && row[field] !== '' ? row[field] : '-'}
                    </td>
                  ))}
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row[activeComponent] !== null && row[activeComponent] !== undefined ? row[activeComponent] : ''}
                      onChange={(event) => onChange(row.id_user_siswa, activeComponent, event.target.value)}
                      className="form-control"
                      style={{ minWidth: '140px' }}
                    />
                  </td>
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
        <button type="button" className="btn-primary" onClick={onSave} disabled={saving}>
          {saving ? 'Menyimpan...' : `Simpan ${activeLabel}`}
        </button>
      </div>
    </div>
  );
}

export default function GuruNilaiPage() {
  const user = useMemo(() => getStoredUser(), []);
  const profile = useMemo(() => getStoredProfile(), []);
  const name = getDisplayName(profile, user?.role, user?.username);
  const userId = user?.id_user || 'default';

  const [view, setView] = useState('list');
  const [jadwalList, setJadwalList] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [contexts, setContexts] = useState([]);
  const [form, setForm] = useState({
    id: '',
    tahun_ajaran: '',
    semester: 'Ganjil',
    id_kelas: '',
    id_mapel: '',
  });
  const [activeContext, setActiveContext] = useState(null);
  const [siswaRows, setSiswaRows] = useState([]);
  const [activeComponent, setActiveComponent] = useState('nilai_uts');
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
        const defaultContexts = buildDefaultNilaiContexts(jadwalRows);
        const storedContexts = readStoredContexts(userId);
        const mergedContexts = storedContexts.length > 0 ? storedContexts : defaultContexts;

        if (active) {
          setJadwalList(jadwalRows);
          setTahunAjaranList(tahunAjaranResponse || []);
          setContexts(mergedContexts);
          persistContexts(userId, mergedContexts);
        }
      } catch (error) {
        console.error('Gagal memuat data nilai guru', error);
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
  }, [userId]);

  const kelasOptions = useMemo(() => {
    const map = new Map();

    jadwalList
      .filter((item) => {
        if (!form.tahun_ajaran || !form.semester) return true;
        return item.tahun_ajaran === form.tahun_ajaran && item.semester === form.semester;
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
    return contexts.map((row) => {
      const kelas = jadwalList.find((item) => String(item.id_kelas) === String(row.id_kelas));
      const mapel = jadwalList.find((item) => String(item.id_mapel) === String(row.id_mapel));

      return {
        ...row,
        nama_kelas: row.nama_kelas || kelas?.kelas?.nama_kelas || '-',
        nama_mapel: row.nama_mapel || mapel?.mapel?.nama_mapel || '-',
      };
    });
  }, [contexts, jadwalList]);

  const openCreate = () => {
    setForm({
      id: '',
      tahun_ajaran: getActiveAcademicYear(tahunAjaranList),
      semester: 'Ganjil',
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
      id_kelas: String(row.id_kelas),
      id_mapel: String(row.id_mapel),
    });
    setView('edit');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'tahun_ajaran' ? { id_kelas: '', id_mapel: '' } : {}),
      ...(name === 'semester' ? { id_kelas: '', id_mapel: '' } : {}),
      ...(name === 'id_kelas' ? { id_mapel: '' } : {}),
    }));
  };

  const saveContext = () => {
    if (!form.tahun_ajaran || !form.semester || !form.id_kelas || !form.id_mapel) {
      toastError('Gagal', 'Semua field wajib diisi.');
      return;
    }

    const kelas = kelasOptions.find((item) => String(item.id_kelas) === String(form.id_kelas));
    const mapel = mapelOptions.find((item) => String(item.id_mapel) === String(form.id_mapel));
    const nextContext = {
      id: form.id || buildContextId(form),
      tahun_ajaran: form.tahun_ajaran,
      semester: form.semester,
      id_kelas: Number(form.id_kelas),
      id_mapel: Number(form.id_mapel),
      nama_kelas: kelas?.nama_kelas || '-',
      nama_mapel: mapel?.nama_mapel || '-',
      completed: false,
    };

    const nextRows = form.id
      ? contexts.map((item) => (item.id === form.id ? { ...item, ...nextContext } : item))
      : [...contexts.filter((item) => item.id !== nextContext.id), nextContext];

    setContexts(nextRows);
    persistContexts(userId, nextRows);
    setView('list');
    toastSuccess('Berhasil', form.id ? 'Daftar nilai berhasil diperbarui.' : 'Daftar nilai berhasil ditambahkan.');
  };

  const deleteContext = (row) => {
    if (!window.confirm(`Hapus konteks daftar nilai ${row.nama_mapel} - ${row.nama_kelas}?`)) {
      return;
    }

    const nextRows = contexts.filter((item) => item.id !== row.id);
    setContexts(nextRows);
    persistContexts(userId, nextRows);
    toastSuccess('Berhasil', 'Daftar nilai berhasil dihapus dari daftar kerja.');
  };

  const openInput = async (row) => {
    setActiveContext(row);
    setView('input');
    setInputLoading(true);

    try {
      const response = await fetchNilaiForm({
        id_kelas: Number(row.id_kelas),
        id_mapel: Number(row.id_mapel),
        tahun_ajaran: row.tahun_ajaran,
        semester: row.semester,
      });

      setSiswaRows(
        (response?.siswa || []).map((item) => ({
          ...item,
          nilai_tugas: item.nilai_tugas ?? '',
          nilai_uts: item.nilai_uts ?? '',
          nilai_uas: item.nilai_uas ?? '',
        }))
      );
    } catch (error) {
      console.error('Gagal memuat form nilai', error);
      toastError('Gagal', error?.response?.data?.message || 'Gagal memuat daftar nilai murid.');
      setView('list');
      setActiveContext(null);
    } finally {
      setInputLoading(false);
    }
  };

  const handleNilaiChange = (idUserSiswa, field, value) => {
    setSiswaRows((prev) =>
      prev.map((item) =>
        item.id_user_siswa === idUserSiswa
          ? { ...item, [field]: value === '' ? '' : Number(value) }
          : item
      )
    );
  };

  const handleSaveNilai = async () => {
    if (!activeContext) return;

    if (!siswaRows || siswaRows.length === 0) {
      toastError('Gagal', 'Tidak dapat menyimpan karena tidak ada murid di kelas ini.');
      return;
    }

    setSaving(true);
    try {
      await saveNilaiBulk({
        meta: {
          id_kelas: Number(activeContext.id_kelas),
          id_mapel: Number(activeContext.id_mapel),
          tahun_ajaran: activeContext.tahun_ajaran,
          semester: activeContext.semester,
          komponen_nilai: activeComponent,
        },
        items: siswaRows.map((row) => ({
          id_user_siswa: row.id_user_siswa,
          [activeComponent]: row[activeComponent] === '' ? null : Number(row[activeComponent]),
        })),
      });

      const nextRows = contexts.map((item) =>
        item.id === activeContext.id ? { ...item, completed: true } : item
      );
      setContexts(nextRows);
      persistContexts(userId, nextRows);
      toastSuccess('Berhasil', `Nilai ${getNilaiComponentLabel(activeComponent)} berhasil disimpan.`);
      setView('list');
      setActiveContext(null);
    } catch (error) {
      console.error('Gagal menyimpan nilai', error);
      toastError('Gagal', error?.response?.data?.message || 'Gagal menyimpan nilai murid.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="Daftar Nilai Murid" subtitle="Kelola data nilai murid.">
              <button type="button" onClick={openCreate} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <Plus size={18} />
                Tambah Daftar Nilai
              </button>
            </PageHeader>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tahun Ajaran</th>
                    <th>Semester</th>
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th>Isi Daftar Nilai</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Memuat daftar nilai...
                      </td>
                    </tr>
                  ) : contextRows.length > 0 ? (
                    contextRows.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.tahun_ajaran}</td>
                        <td>{row.semester}</td>
                        <td>{row.nama_kelas}</td>
                        <td>{row.nama_mapel}</td>
                        <td>
                          <button type="button" onClick={() => openInput(row)} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileSpreadsheet size={16} />
                            Isi Daftar Nilai
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            <button type="button" className="btn-icon edit" title="Edit" onClick={() => openEdit(row)}>
                              <Pencil size={16} />
                            </button>
                            <button type="button" className="btn-icon delete" title="Hapus" onClick={() => deleteContext(row)}>
                              <Trash2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon"
                              title={row.completed ? 'Nilai sudah disimpan' : 'Nilai belum disimpan'}
                              style={{
                                borderColor: row.completed ? '#86efac' : 'var(--color-border)',
                                color: row.completed ? '#15803d' : 'var(--color-text-muted)',
                                background: row.completed ? '#f0fdf4' : '#fff',
                              }}
                              onClick={() => openInput(row)}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'grid', justifyItems: 'center', gap: '1rem' }}>
                          <span>Belum ada daftar nilai. Tambahkan daftar nilai terlebih dahulu.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(view === 'create' || view === 'edit') && (
          <NilaiContextForm
            mode={view}
            form={form}
            tahunAjaranOptions={tahunAjaranList}
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            onChange={handleFormChange}
            onCancel={() => setView('list')}
            onSubmit={saveContext}
          />
        )}

        {view === 'input' && activeContext && (
          <NilaiInputView
            context={activeContext}
            siswaRows={siswaRows}
            loading={inputLoading}
            saving={saving}
            activeComponent={activeComponent}
            onComponentChange={setActiveComponent}
            onBack={() => {
              setView('list');
              setActiveContext(null);
            }}
            onChange={handleNilaiChange}
            onSave={handleSaveNilai}
          />
        )}
      </div>
    </MainLayout>
  );
}
