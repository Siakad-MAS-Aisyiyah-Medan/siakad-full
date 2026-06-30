import React, { useEffect, useMemo, useState } from 'react';

import MainLayout from '@/shared/layouts/MainLayout';
import apiClient from '@/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import PageHeader from '@/shared/components/PageHeader';

import { dedupeMapelDiampu } from '../guruTeachingUtils';

export default function GuruMapelPage() {
  const user = useMemo(() => getStoredUser(), []);
  const profile = useMemo(() => getStoredProfile(), []);
  const name = getDisplayName(profile, user?.role, user?.username);

  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await apiClient.get('/guru/jadwal');
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        if (active) {
          setMapelList(dedupeMapelDiampu(rows));
        }
      } catch (error) {
        console.error('Gagal memuat mata pelajaran yang diampu', error);
        if (active) {
          setMapelList([]);
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

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <PageHeader title="Mata Pelajaran yang Diampu" subtitle="Berikut adalah daftar mata pelajaran yang Anda ampu." />

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Tingkatan</th>
                  <th>Tahun Ajaran</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Memuat data mata pelajaran...
                    </td>
                  </tr>
                ) : mapelList.length > 0 ? (
                  mapelList.map((row, index) => (
                    <tr key={`${row.id_mapel}-${row.tingkatan}-${row.tahun_ajaran}`}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{row.nama_mapel || '-'}</td>
                      <td>{row.tingkatan || '-'}</td>
                      <td>{row.tahun_ajaran || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Tidak ada mata pelajaran yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            Menampilkan 1 - {mapelList.length} dari {mapelList.length} data
          </div>
      </div>
    </MainLayout>
  );
}
