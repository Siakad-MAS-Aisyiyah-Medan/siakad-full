import { useState, useCallback } from 'react';
import { fetchLaporan } from './laporan.service';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { fetchMapelList } from '@app/shared/akademik/mapel/services/mapel.service';
import { toastError } from '../hooks/useConfirm';

const defaultFilters = {
  tahun_ajaran: '2025/2026',
  semester: 'Ganjil',
  id_kelas: '',
  id_mapel: '',
  tanggal_dari: '',
  tanggal_sampai: '',
  bulan: '',
  role: '',
  status: '',
  search: '',
  page: 1,
  per_page: 25,
};

export function useLaporan(apiPath, initialJenis = 'siswa') {
  const [jenis, setJenis] = useState(initialJenis);
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = useCallback(async () => {
    try {
      const [kelas, mapel] = await Promise.all([fetchKelasList(), fetchMapelList()]);
      setKelasList(kelas);
      setMapelList(mapel);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const load = useCallback(
    async (override = {}) => {
      setLoading(true);
      try {
        const params = {
          jenis,
          ...filters,
          ...override,
        };
        Object.keys(params).forEach((k) => {
          if (params[k] === '' || params[k] === null) delete params[k];
        });
        const result = await fetchLaporan(apiPath, params);
        setData(result);
      } catch (err) {
        toastError('Gagal', err.response?.data?.message || 'Gagal memuat laporan');
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [apiPath, jenis, filters]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const setPage = (page) => {
    setFilters((prev) => {
      const next = { ...prev, page };
      load({ ...next });
      return next;
    });
  };

  return {
    jenis,
    setJenis,
    filters,
    setFilters,
    data,
    loading,
    kelasList,
    mapelList,
    load,
    loadOptions,
    handleFilterChange,
    setPage,
    setFilters,
  };
}
