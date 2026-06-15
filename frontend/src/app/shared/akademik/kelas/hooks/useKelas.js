import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchKelasList, fetchKelasStats, createKelas, updateKelas, deleteKelas } from '../services/kelas.service';
import { fetchGuruList } from '@app/shared/akademik/guru/services/guru.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const emptyForm = { nama_kelas: '', tingkat: '', jurusan: '', id_wali_kelas: '', kapasitas_maksimal: 36, ruangan: '' };

export function useKelas() {
  const [view, setView] = useState('list');
  const [kelasData, setKelasData] = useState([]);
  const [stats, setStats] = useState(null);
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTingkat, setFilterTingkat] = useState('Semua');
  const [filterJurusan, setFilterJurusan] = useState('Semua');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterTingkat !== 'Semua') params.tingkat = filterTingkat;
      if (filterJurusan !== 'Semua') params.jurusan = filterJurusan;

      const [kelas, statsData, guru] = await Promise.all([
        fetchKelasList(params),
        fetchKelasStats(),
        fetchGuruList({ role: 'wali_kelas', per_page: 100 }),
      ]);
      setKelasData(kelas);
      setStats(statsData);
      setGuruData(guru);
    } catch (error) {
      console.error('Error fetching kelas:', error);
    } finally {
      setIsFetching(false);
    }
  }, [searchQuery, filterTingkat, filterJurusan]);

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
      tingkat: kelas.tingkat || '',
      jurusan: kelas.jurusan || '',
      id_wali_kelas: kelas.id_wali_kelas || '',
      kapasitas_maksimal: kelas.kapasitas_maksimal || 36,
      ruangan: kelas.ruangan || '',
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
      tingkat: formData.tingkat,
      jurusan: formData.jurusan,
      kapasitas_maksimal: Number(formData.kapasitas_maksimal) || 36,
      ruangan: formData.ruangan || null,
      id_wali_kelas: formData.id_wali_kelas ? Number(formData.id_wali_kelas) : null,
    };
    try {
      if (view === 'add') {
        await createKelas(payload);
        toastSuccess('Berhasil', 'Data berhasil disimpan');
      } else {
        await updateKelas(currentId, payload);
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
      toastSuccess('Terhapus!', 'Data berhasil dihapus');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus data kelas.');
    }
  };

  return {
    view,
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filterJurusan,
    setFilterJurusan,
    filteredData,
    stats,
    guruData,
    formData,
    loading,
    isFetching,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeKelas,
  };
}
