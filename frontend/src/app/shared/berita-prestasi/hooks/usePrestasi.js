import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchBeritaList,
  createBerita,
  updateBerita,
  deleteBerita,
} from '../services/prestasi.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  judul: '',
  isi: '',
  kategori: 'Berita',
  gambar: '',
  tanggal_publikasi: today,
  is_published: true,
};

export function usePrestasi() {
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchBeritaList({ per_page: 100 });
      setItems(data);
    } catch (error) {
      console.error('Error fetching berita:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return items.filter(
      (b) =>
        b.judul?.toLowerCase().includes(q) ||
        b.kategori?.toLowerCase().includes(q) ||
        b.isi?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const openAdd = () => {
    setFormData({ ...emptyForm, tanggal_publikasi: today });
    setView('add');
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      judul: item.judul || '',
      isi: item.isi || '',
      kategori: item.kategori || 'Berita',
      gambar: item.gambar || '',
      tanggal_publikasi: item.tanggal_publikasi?.slice?.(0, 10) || item.tanggal_publikasi || today,
      is_published: Boolean(item.is_published),
    });
    setView('edit');
  };

  const cancelForm = () => {
    setView('list');
    setCurrentId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, gambar: formData.gambar || null };
    try {
      if (view === 'add') {
        await createBerita(payload);
        toastSuccess('Berhasil', 'Artikel berhasil ditambahkan');
      } else {
        await updateBerita(currentId, payload);
        toastSuccess('Berhasil', 'Artikel berhasil diperbarui');
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
      title: 'Hapus Artikel?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteBerita(id);
      toastSuccess('Terhapus!', 'Artikel telah dihapus.');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus artikel.');
    }
  };

  return {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeItem,
  };
}
