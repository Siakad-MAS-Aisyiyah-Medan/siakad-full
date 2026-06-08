import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchKelasList, createKelas, updateKelas, deleteKelas } from '../services/kelas.service';
import { fetchGuruList } from '@app/shared/akademik/guru/services/guru.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const emptyForm = { nama_kelas: '', id_wali_kelas: '' };

export function useKelas() {
  const [view, setView] = useState('list');
  const [kelasData, setKelasData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    try {
      const [kelas, guru] = await Promise.all([
        fetchKelasList(),
        fetchGuruList({ role: 'wali_kelas', per_page: 100 }),
      ]);
      setKelasData(kelas);
      setGuruData(guru);
    } catch (error) {
      console.error('Error fetching kelas:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(
    () => kelasData.filter((k) => k.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase())),
    [kelasData, searchQuery]
  );

  const openAdd = () => {
    setFormData(emptyForm);
    setView('add');
  };

  const openEdit = (kelas) => {
    setCurrentId(kelas.id_kelas);
    setFormData({
      nama_kelas: kelas.nama_kelas,
      id_wali_kelas: kelas.id_wali_kelas || '',
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
    const payload = {
      nama_kelas: formData.nama_kelas,
      id_wali_kelas: formData.id_wali_kelas ? Number(formData.id_wali_kelas) : null,
    };
    try {
      if (view === 'add') {
        await createKelas(payload);
        toastSuccess('Berhasil', 'Data kelas ditambahkan');
      } else {
        await updateKelas(currentId, payload);
        toastSuccess('Berhasil', 'Data kelas diperbarui');
      }
      await loadData();
      setView('list');
    } catch (error) {
      toastError('Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const removeKelas = async (id_kelas) => {
    const ok = await confirmAction({
      title: 'Hapus Data Kelas?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteKelas(id_kelas);
      toastSuccess('Terhapus!', 'Data kelas telah dihapus.');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus data kelas.');
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
    removeKelas,
  };
}
