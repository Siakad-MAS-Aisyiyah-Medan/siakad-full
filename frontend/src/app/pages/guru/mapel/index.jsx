import React, { useEffect, useState } from 'react';

import MainLayout from '@app/shared/layouts/MainLayout';
import apiClient from '@app/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';

import { dedupeMapelDiampu } from '../guruTeachingUtils';

export default function GuruMapelPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
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
      <div className="admin-page-wrapper animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-dark)', marginBottom: '0.35rem' }}>
              Mata Pelajaran yang Diampu
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-muted)' }}>
              Berikut adalah daftar mata pelajaran yang Anda ampu.
            </p>
          </div>

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
      </div>
    </MainLayout>
  );
}
