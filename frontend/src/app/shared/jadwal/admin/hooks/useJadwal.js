import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchJadwalList, createJadwal, updateJadwal, deleteJadwal } from '../services/jadwal.service';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { fetchMapelList } from '@app/shared/akademik/mapel/services/mapel.service';
import { fetchGuruList } from '@app/shared/akademik/guru/services/guru.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';
import { resolveJadwalConflictMessage } from '@app/shared/utils/jadwalConflictMessage';

const emptyForm = {
  id_kelas: '',
  id_mapel: '',
  id_guru: '',
  hari: 'Senin',
  jam_mulai: '07:00',
  jam_selesai: '08:30',
  ruangan: '',
  tahun_ajaran: '2025/2026',
  semester: 'Ganjil',
};

export function useJadwal() {
  const [view, setView] = useState('list');
  const [jadwalData, setJadwalData] = useState([]);
  const [kelasData, setKelasData] = useState([]);
  const [mapelData, setMapelData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    try {
      const [jadwal, kelas, mapel, guru] = await Promise.all([
        fetchJadwalList({ per_page: 100 }),
        fetchKelasList(),
        fetchMapelList(),
        fetchGuruList({ per_page: 100 }),
      ]);
      setJadwalData(jadwal);
      setKelasData(kelas);
      setMapelData(mapel);
      setGuruData(guru);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return jadwalData.filter(
      (j) =>
        j.hari?.toLowerCase().includes(q) ||
        j.kelas?.nama_kelas?.toLowerCase().includes(q) ||
        j.mapel?.nama_mapel?.toLowerCase().includes(q) ||
        j.guru?.nama_guru?.toLowerCase().includes(q) ||
        j.ruangan?.toLowerCase().includes(q)
    );
  }, [jadwalData, searchQuery]);

  const openAdd = () => {
    setFormData(emptyForm);
    setView('add');
  };

  const openEdit = (item) => {
    setCurrentId(item.id_jadwal);
    setFormData({
      id_kelas: String(item.id_kelas),
      id_mapel: String(item.id_mapel),
      id_guru: String(item.id_guru),
      hari: item.hari,
      jam_mulai: (item.jam_mulai || '').slice(0, 5),
      jam_selesai: (item.jam_selesai || '').slice(0, 5),
      ruangan: item.ruangan || '',
      tahun_ajaran: item.tahun_ajaran || '2025/2026',
      semester: item.semester || 'Ganjil',
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
      id_kelas: Number(formData.id_kelas),
      id_mapel: Number(formData.id_mapel),
      id_guru: Number(formData.id_guru),
      ruangan: formData.ruangan || null,
    };
    try {
      if (view === 'add') {
        await createJadwal(payload);
        toastSuccess('Berhasil', 'Jadwal berhasil ditambahkan');
      } else {
        await updateJadwal(currentId, payload);
        toastSuccess('Berhasil', 'Jadwal berhasil diperbarui');
      }
      await loadData();
      setView('list');
    } catch (error) {
      toastError('Gagal', resolveJadwalConflictMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const removeJadwal = async (id) => {
    const ok = await confirmAction({
      title: 'Hapus Jadwal?',
      text: 'Data jadwal yang dihapus tidak dapat dikembalikan.',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteJadwal(id);
      toastSuccess('Terhapus!', 'Jadwal telah dihapus.');
      loadData();
    } catch {
      toastError('Gagal', 'Gagal menghapus jadwal.');
    }
  };

  return {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    kelasData,
    mapelData,
    guruData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeJadwal,
  };
}
