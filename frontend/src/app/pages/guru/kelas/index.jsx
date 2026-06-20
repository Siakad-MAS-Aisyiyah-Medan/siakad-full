import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MainLayout from '@app/shared/layouts/MainLayout';
import apiClient from '@app/shared/services/apiClient';
import { getStoredProfile, getStoredUser } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';

import { dedupeKelasDiajar, normalizeText } from '../guruTeachingUtils';

export default function GuruKelasPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [kelasMaster, setKelasMaster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [jadwalResponse, kelasResponse] = await Promise.all([
          apiClient.get('/guru/jadwal'),
          fetchKelasList({ per_page: 200 }),
        ]);
        const rows = Array.isArray(jadwalResponse?.data?.data) ? jadwalResponse.data.data : [];
        if (active) {
          setKelasList(dedupeKelasDiajar(rows));
          setKelasMaster(kelasResponse || []);
        }
      } catch (error) {
        console.error('Gagal memuat data kelas yang diajar', error);
        if (active) {
          setKelasList([]);
          setKelasMaster([]);
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

  const filteredRows = useMemo(() => {
    const keyword = normalizeText(search);
    if (!keyword) return kelasList;

    return kelasList.filter((item) =>
      [
        item.tahun_ajaran,
        item.nama_kelas,
        item.tingkatan,
        item.jurusan,
        item.wali_kelas,
      ].some((value) => normalizeText(value).includes(keyword))
    );
  }, [kelasList, search]);

  const displayRows = useMemo(() => {
    return filteredRows.map((row) => {
      const kelasDetail = kelasMaster.find((item) => String(item.id_kelas) === String(row.id_kelas));

      return {
        ...row,
        tingkatan: kelasDetail?.tingkat || row.tingkatan || '-',
        jurusan: kelasDetail?.jurusan || row.jurusan || '-',
        wali_kelas: kelasDetail?.wali_kelas?.nama_guru || row.wali_kelas || '-',
      };
    });
  }, [filteredRows, kelasMaster]);

  const openMuridPage = (row) => {
    const params = new URLSearchParams({
      id_kelas: String(row.id_kelas),
      id_mapel: String(row.id_mapel || ''),
      tahun_ajaran: String(row.tahun_ajaran || ''),
      semester: String(row.semester || ''),
      nama_kelas: String(row.nama_kelas || ''),
    });

    navigate(`/guru/murid?${params.toString()}`);
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="admin-page-wrapper animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-dark)', marginBottom: '0.35rem' }}>
              Data Kelas yang Diajar
            </h1>
          </div>

          <div style={{ position: 'relative', maxWidth: '100%' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari Data Kelas..."
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                paddingLeft: '3.25rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                outline: 'none',
                background: '#fff',
                color: 'var(--color-text-dark)',
              }}
            />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tahun Ajaran</th>
                  <th>Nama Kelas</th>
                  <th>Tingkatan</th>
                  <th>Jurusan</th>
                  <th>Wali Kelas</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Memuat data kelas...
                    </td>
                  </tr>
                ) : displayRows.length > 0 ? (
                  displayRows.map((row) => (
                    <tr key={`${row.id_kelas}-${row.tahun_ajaran}-${row.semester}`}>
                      <td>{row.tahun_ajaran || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{row.nama_kelas || '-'}</td>
                      <td>{row.tingkatan || '-'}</td>
                      <td>{row.jurusan || '-'}</td>
                      <td>{row.wali_kelas || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openMuridPage(row)}
                            className="btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            <Eye size={16} />
                            Lihat Data Murid
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Tidak ada data kelas yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            Menampilkan 1 - {displayRows.length} dari {displayRows.length} data
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
