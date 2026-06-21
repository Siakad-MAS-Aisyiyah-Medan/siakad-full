import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import MainLayout from '@/shared/layouts/MainLayout';
import apiClient from '@/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import PageHeader from '@/shared/components/PageHeader';

export default function GuruMuridPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
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
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '-1.5rem', minHeight: 'calc(100vh - 84px)', background: 'var(--color-white)' }}>
        <PageHeader title={`Murid - ${namaKelas}`} subtitle={`Berikut adalah daftar murid pada kelas ${namaKelas} yang Anda ajar.`} />

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
    </MainLayout>
  );
}
