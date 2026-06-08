import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchMapelList,
  fetchGuruList,
  createMapel,
  updateMapel,
  deleteMapel,
} from '../services/mapel.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const emptyForm = { nama_mapel: '', id_guru: '' };

export function useMapel() {
  const [view, setView] = useState('list');
  const [mapelData, setMapelData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    try {
      const [mapel, guru] = await Promise.all([fetchMapelList(), fetchGuruList()]);
      setMapelData(mapel);
      setGuruData(guru);
    } catch (error) {
      console.error('Error fetching mapel:', error);
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
        toastSuccess('Berhasil', 'Mata pelajaran berhasil ditambahkan');
      } else {
        await updateMapel(currentId, formData);
        toastSuccess('Berhasil', 'Mata pelajaran berhasil diperbarui');
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
      toastSuccess('Terhapus!', 'Satu mata pelajaran berhasil dihapus.');
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
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeMapel,
  };
}
