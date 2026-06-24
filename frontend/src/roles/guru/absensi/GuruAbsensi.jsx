import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import MainLayout from '@/shared/layouts/MainLayout';
import apiClient from '@/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import { fetchAbsensiForm, saveAbsensiBulk, fetchHistoryAbsensi, deleteAbsensiMeeting } from '@/shared/absensi/guru/services/absensi.service';
import { toastError, toastSuccess } from '@/shared/hooks/useConfirm';
import PageHeader from '@/shared/components/PageHeader';

const formatLes = (timeStr) => timeStr ? parseInt(timeStr.split(':')[0], 10) : '-';


function getDayName(dateStr) {
  if (!dateStr) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(date.getTime()) ? '' : days[date.getDay()];
}

function AbsensiDetailView({ context, meeting, onBack }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadDetail() {
      try {
        const formattedDate = meeting.tanggal.split('T')[0];
        const res = await fetchAbsensiForm({
          id_kelas: context.id_kelas,
          id_mapel: context.id_mapel,
          tanggal: formattedDate,
          jam_mulai: meeting.jam_mulai.substring(0, 5),
          jam_selesai: meeting.jam_selesai.substring(0, 5),
          tahun_ajaran: meeting.tahun_ajaran,
          semester: meeting.semester,
        });
        if (active) {
          setStudents(res?.siswa || []);
        }
      } catch (err) {
        console.error(err);
        toastError('Gagal', 'Gagal memuat detail absensi');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDetail();
    return () => { active = false; };
  }, [context, meeting]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title="Detail Absensi Pertemuan"
        subtitle={`${meeting.tanggal.split('T')[0]} | Les ${formatLes(meeting.jam_mulai)} - ${formatLes(meeting.jam_selesai)}`}
        onBack={onBack}
      />

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>NISN</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat detail absensi...
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student, idx) => (
                <tr key={student.id_user_siswa}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{student.nama_siswa}</td>
                  <td>{student.nisn}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-${student.status?.toLowerCase() || 'none'}`} style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      backgroundColor: 
                        student.status === 'H' ? '#D1FAE5' :
                        student.status === 'S' ? '#DBEAFE' :
                        student.status === 'I' ? '#FEF3C7' :
                        student.status === 'A' ? '#FEE2E2' : '#F3F4F6',
                      color:
                        student.status === 'H' ? '#065F46' :
                        student.status === 'S' ? '#1E40AF' :
                        student.status === 'I' ? '#92400E' :
                        student.status === 'A' ? '#991B1B' : '#374151'
                    }}>
                      {student.status === 'H' ? 'Hadir' :
                       student.status === 'S' ? 'Sakit' :
                       student.status === 'I' ? 'Izin' :
                       student.status === 'A' ? 'Alpa' : '-'}
                    </span>
                  </td>
                  <td>{student.keterangan || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Tidak ada data detail absensi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AbsensiHistoryView({ context, onBack, onEdit }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
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
  }, [context.id_kelas, context.id_mapel]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus riwayat absensi tanggal ${row.tanggal.split('T')[0]} (Les ${formatLes(row.jam_mulai)} - ${formatLes(row.jam_selesai)})?`)) return;
    try {
      await deleteAbsensiMeeting({
        id_kelas: context.id_kelas,
        id_mapel: context.id_mapel,
        tanggal: row.tanggal.split('T')[0],
        jam_mulai: row.jam_mulai.substring(0, 5),
        jam_selesai: row.jam_selesai.substring(0, 5)
      });
      toastSuccess('Berhasil', 'Riwayat absensi berhasil dihapus');
      loadHistory();
    } catch (err) {
      console.error(err);
      toastError('Gagal', 'Gagal menghapus riwayat absensi');
    }
  };

  if (selectedMeeting) {
    return <AbsensiDetailView context={context} meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader 
        title="Riwayat Absensi Kelas"
        subtitle={`Riwayat absensi untuk kelas ${context.nama_kelas} - ${context.nama_mapel}`}
        onBack={onBack}
      />

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
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  Memuat riwayat absensi...
                </td>
              </tr>
            ) : historyList.length > 0 ? (
              historyList.map((row, index) => (
                <tr key={index} onClick={() => setSelectedMeeting(row)} style={{ cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="Klik untuk melihat detail">
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.tanggal.split('T')[0]}</td>
                  <td>{getDayName(row.tanggal.split('T')[0])}</td>
                  <td>Les {formatLes(row.jam_mulai)} - {formatLes(row.jam_selesai)}</td>
                  <td style={{ textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{row.count_hadir || 0}</td>
                  <td style={{ textAlign: 'center', color: '#3B82F6', fontWeight: 600 }}>{row.count_sakit || 0}</td>
                  <td style={{ textAlign: 'center', color: '#F59E0B', fontWeight: 600 }}>{row.count_izin || 0}</td>
                  <td style={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{row.count_alpa || 0}</td>
                  <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>{row.count_terlambat || 0}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button type="button" className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMeeting(row);
                      }} title="Detail">
                        Detail
                      </button>
                      <button type="button" className="btn-icon edit" style={{ width: '28px', height: '28px' }} onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="btn-icon delete" style={{ width: '28px', height: '28px' }} onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row);
                      }} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
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

function TambahAbsensiView({ context, meetingToEdit, onBack }) {
  const [form, setForm] = useState(meetingToEdit ? {
    tanggal: meetingToEdit.tanggal.split('T')[0],
    jam_mulai: formatLes(meetingToEdit.jam_mulai),
    jam_selesai: formatLes(meetingToEdit.jam_selesai),
  } : {
    tanggal: new Date().toISOString().split('T')[0],
    jam_mulai: 1,
    jam_selesai: 1,
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
          jam_mulai: `${String(form.jam_mulai).padStart(2, '0')}:00`,
          jam_selesai: `${String(form.jam_selesai).padStart(2, '0')}:59`,
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
          jam_mulai: `${String(form.jam_mulai).padStart(2, '0')}:00`,
          jam_selesai: `${String(form.jam_selesai).padStart(2, '0')}:59`,
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
        onBack={onBack}
      />

      <div className="glass" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Tanggal</label>
            <input 
              type="date" 
              className="form-control" 
              value={form.tanggal} 
              disabled={!!meetingToEdit}
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
            <label className="form-label">Jam Mulai (Les Ke-)</label>
            <select 
              className="form-control" 
              value={form.jam_mulai} 
              disabled={!!meetingToEdit}
              onChange={e => setForm(prev => ({ ...prev, jam_mulai: parseInt(e.target.value, 10) }))} 
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Jam Selesai (Les Ke-)</label>
            <select 
              className="form-control" 
              value={form.jam_selesai} 
              disabled={!!meetingToEdit}
              onChange={e => setForm(prev => ({ ...prev, jam_selesai: parseInt(e.target.value, 10) }))} 
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>Set Semua Ke:</span>
            <button type="button" className="btn-outline" onClick={() => handleSetAll('H')} style={{ borderColor: '#10B981', color: '#10B981', background: 'transparent' }}>Hadir (H)</button>
            <button type="button" className="btn-outline" onClick={() => handleSetAll('S')} style={{ borderColor: '#3B82F6', color: '#3B82F6', background: 'transparent' }}>Sakit (S)</button>
            <button type="button" className="btn-outline" onClick={() => handleSetAll('I')} style={{ borderColor: '#F59E0B', color: '#F59E0B', background: 'transparent' }}>Izin (I)</button>
            <button type="button" className="btn-outline" onClick={() => handleSetAll('A')} style={{ borderColor: '#EF4444', color: '#EF4444', background: 'transparent' }}>Alpa (A)</button>
          </div>
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

  const [view, setView] = useState('list'); // list, history, tambah_absen
  const [activeContext, setActiveContext] = useState(null);
  const [meetingToEdit, setMeetingToEdit] = useState(null);
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await apiClient.get('/guru/jadwal');
        const jadwalRows = Array.isArray(response?.data?.data) ? response.data.data : [];

        if (active) {
          setJadwalList(jadwalRows);
        }
      } catch (error) {
        console.error('Gagal memuat data absensi guru', error);
        if (active) {
          setJadwalList([]);
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

  const teachingClasses = useMemo(() => {
    const map = new Map();
    jadwalList.forEach((item) => {
      const key = `${item.id_kelas}-${item.id_mapel}`;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          id_kelas: item.id_kelas,
          id_mapel: item.id_mapel,
          nama_kelas: item.kelas?.nama_kelas || '-',
          nama_mapel: item.mapel?.nama_mapel || '-',
          tahun_ajaran: item.tahun_ajaran,
          semester: item.semester,
        });
      }
    });
    return Array.from(map.values());
  }, [jadwalList]);

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="Absensi Murid" subtitle="Pilih kelas yang Anda ajar untuk melakukan atau melihat riwayat absensi.">
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
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Memuat daftar kelas...
                      </td>
                    </tr>
                  ) : teachingClasses.length > 0 ? (
                    teachingClasses.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.tahun_ajaran}</td>
                        <td>{row.semester}</td>
                        <td>{row.nama_kelas}</td>
                        <td>{row.nama_mapel}</td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            <button type="button" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                              setActiveContext(row);
                              setView('tambah_absen');
                            }}>
                              Tambah Absensi
                            </button>
                            <button type="button" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                              setActiveContext(row);
                              setView('history');
                            }}>
                              Riwayat Absensi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Belum ada kelas yang ditugaskan kepada Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {view === 'history' && activeContext && (
          <AbsensiHistoryView
            context={activeContext}
            onEdit={(meeting) => {
              setMeetingToEdit(meeting);
              setView('tambah_absen');
            }}
            onBack={() => {
              setView('list');
              setActiveContext(null);
            }}
          />
        )}

        {view === 'tambah_absen' && activeContext && (
          <TambahAbsensiView
            context={activeContext}
            meetingToEdit={meetingToEdit}
            onBack={() => {
              setView('list');
              setActiveContext(null);
              setMeetingToEdit(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
