import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchEkskulList,
  createEkskul,
  updateEkskul,
  deleteEkskul,
} from '../services/ekskul.service';
import { fetchGuruList } from '@app/shared/akademik/guru/services/guru.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const emptyForm = {
  nama_ekskul: '',
  deskripsi: '',
  id_pembina: '',
  hari: '',
  jam: '',
  lokasi: '',
};

export function useEkskul() {
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [ekskul, guru] = await Promise.all([
        fetchEkskulList({ per_page: 100 }),
        fetchGuruList({ per_page: 100 }),
      ]);
      setItems(ekskul);
      setGuruData(guru);
    } catch (error) {
      console.error('Error fetching ekskul:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return items.filter(
      (e) =>
        e.nama_ekskul?.toLowerCase().includes(q) ||
        e.pembina?.nama_guru?.toLowerCase().includes(q) ||
        e.lokasi?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const openAdd = () => {
    setFormData(emptyForm);
    setView('add');
  };

  const openEdit = (item) => {
    setCurrentId(item.id_ekskul);
    setFormData({
      nama_ekskul: item.nama_ekskul || '',
      deskripsi: item.deskripsi || '',
      id_pembina: item.id_pembina ? String(item.id_pembina) : '',
      hari: item.hari || '',
      jam: item.jam || '',
      lokasi: item.lokasi || '',
    });
    setView('edit');
  };

  const cancelForm = () => {
    setView('list');
    setCurrentId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      id_pembina: formData.id_pembina ? Number(formData.id_pembina) : null,
    };
    try {
      if (view === 'add') {
        await createEkskul(payload);
        toastSuccess('Berhasil', 'Data berhasil disimpan');
      } else {
        await updateEkskul(currentId, payload);
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

  const removeItem = async (id) => {
    const ok = await confirmAction({
      title: 'Hapus Ekstrakurikuler?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteEkskul(id);
      toastSuccess('Terhapus!', 'Data berhasil dihapus');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus data.');
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
    isFetching,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeItem,
  };
}
