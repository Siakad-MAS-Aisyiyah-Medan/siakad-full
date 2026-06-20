import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MainLayout from '@app/shared/layouts/MainLayout';
import apiClient from '@app/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';

export default function GuruMuridPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const idKelas = searchParams.get('id_kelas') || '';
  const idMapel = searchParams.get('id_mapel') || '';
  const namaKelas = searchParams.get('nama_kelas') || 'Kelas';
  const tahunAjaran = searchParams.get('tahun_ajaran') || '2025/2026';
  const semester = searchParams.get('semester') || 'Ganjil';

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!idKelas || !idMapel) {
        setRows([]);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/guru/murid-diajar', {
          params: {
          id_kelas: Number(idKelas),
          id_mapel: Number(idMapel),
          tahun_ajaran: tahunAjaran,
          semester,
          },
        });

        if (active) {
          setRows(response?.data?.data?.siswa || []);
        }
      } catch (error) {
        console.error('Gagal memuat data murid kelas yang diajar', error);
        if (active) {
          setRows([]);
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
  }, [idKelas, idMapel, semester, tahunAjaran]);

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-dark)', marginBottom: '0.75rem' }}>
                Murid - {namaKelas}
              </h1>
              <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                Berikut adalah daftar murid pada kelas {namaKelas} yang Anda ajar.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/guru/kelas')}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap' }}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Murid</th>
                  <th>NISN</th>
                  <th>Jenis Kelamin</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Memuat data murid...
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr key={row.id_user_siswa}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{row.nama_siswa || '-'}</td>
                      <td>{row.nisn || '-'}</td>
                      <td>{row.jenis_kelamin || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Tidak ada data murid untuk kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
