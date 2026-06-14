import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchPengumumanList,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
} from '../services/pengumuman.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  judul: '',
  isi: '',
  tanggal_publikasi: today,
  akses: 'umum',
  kategori: '',
  thumbnail: null,
};

export function usePengumuman() {
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAkses, setFilterAkses] = useState('semua');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchPengumumanList({ per_page: 100 });
      setItems(data);
    } catch (error) {
      console.error('Error fetching pengumuman:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    let result = items;
    
    if (filterAkses !== 'semua') {
        result = result.filter(p => p.akses === filterAkses);
    }
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
            (p) => p.judul?.toLowerCase().includes(q) || p.isi?.toLowerCase().includes(q) || p.kategori?.toLowerCase().includes(q)
        );
    }
    
    return result;
  }, [items, searchQuery, filterAkses]);

  const openAdd = () => {
    setFormData({ ...emptyForm, tanggal_publikasi: today });
    setView('add');
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      judul: item.judul || '',
      isi: item.isi || '',
      tanggal_publikasi: item.tanggal_publikasi?.slice?.(0, 10) || item.tanggal_publikasi || today,
      akses: item.akses || 'umum',
      kategori: item.kategori || '',
      thumbnail: null, // Keep it null so it doesn't upload a string
    });
    setView('edit');
  };

  const cancelForm = () => {
    setView('list');
    setCurrentId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'add') {
        await createPengumuman(formData);
        toastSuccess('Berhasil', 'Pengumuman berhasil ditambahkan');
      } else {
        await updatePengumuman(currentId, formData);
        toastSuccess('Berhasil', 'Pengumuman berhasil diperbarui');
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
      title: 'Hapus Pengumuman?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deletePengumuman(id);
      toastSuccess('Terhapus!', 'Pengumuman telah dihapus.');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus pengumuman.');
    }
  };

    return {
    view,
    items,
    searchQuery,
    setSearchQuery,
    filterAkses,
    setFilterAkses,
    filteredData,
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
