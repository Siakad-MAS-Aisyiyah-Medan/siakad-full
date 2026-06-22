import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchMapelList,
  fetchGuruList,
  createMapel,
  updateMapel,
  deleteMapel,
} from '../services/mapel.service';
import { fetchKelasList } from '@/shared/akademik/kelas/services/kelas.service';
import { confirmAction, toastSuccess, toastError } from '@/shared/hooks/useConfirm';

const emptyForm = { nama_mapel: '', id_guru: '', tingkat: '', kelompok_mapel: '', id_kelas: [] };

export function useMapel() {
  const [view, setView] = useState('list');
  const [mapelData, setMapelData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [kelasData, setKelasData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [mapel, guru, kelas] = await Promise.all([fetchMapelList(), fetchGuruList(), fetchKelasList({ per_page: 200 })]);
      setMapelData(mapel);
      setGuruData(guru);
      setKelasData(kelas);
    } catch (error) {
      console.error('Error fetching mapel:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(
    () =>
      mapelData.filter(
        (m) =>
          m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.guru?.profile?.nama_guru?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [mapelData, searchQuery]
  );

  const openAdd = () => {
    setFormData(emptyForm);
    setView('add');
  };

  const openEdit = (mapel) => {
    setCurrentId(mapel.id_mapel);
    setFormData({
      nama_mapel: mapel.nama_mapel,
      id_guru: mapel.id_guru,
      tingkat: mapel.tingkat || '',
      kelompok_mapel: mapel.kelompok_mapel || '',
      id_kelas: mapel.kelas ? mapel.kelas.map(k => k.id_kelas) : [],
    });
    setView('edit');
  };

  const cancelForm = () => {
    setView('list');
    setCurrentId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'add') {
        await createMapel(formData);
        toastSuccess('Berhasil', 'Data berhasil disimpan');
      } else {
        await updateMapel(currentId, formData);
        toastSuccess('Berhasil', 'Data berhasil disimpan');
      }
      await loadData();
      setView('list');
    } catch (error) {
      toastError('Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const removeMapel = async (id_mapel) => {
    const ok = await confirmAction({
      title: 'Hapus Mata Pelajaran?',
      text: 'Aksi ini juga akan menghapus nilai murid terkait mata pelajaran ini!',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteMapel(id_mapel);
      toastSuccess('Terhapus!', 'Data berhasil dihapus');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus mata pelajaran.');
    }
  };

  return {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    guruData,
    kelasData,
    formData,
    loading,
    isFetching,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeMapel,
  };
}
