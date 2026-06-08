import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchGuruList,
  createGuru,
  updateGuru,
  deleteGuru,
} from '../services/guru.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';
import Swal from 'sweetalert2';

const emptyForm = {
  username: '',
  email: '',
  password: '',
  nama_guru: '',
  nip_nuptk: '',
  jenis_kelamin: 'L',
  agama: 'Islam',
  alamat: '',
  no_hp: '',
  role: 'guru',
};

export function useGuru() {
  const [view, setView] = useState('list');
  const [guruData, setGuruData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadGuru = useCallback(async () => {
    try {
      const data = await fetchGuruList();
      setGuruData(data);
    } catch (error) {
      console.error('Error fetching guru:', error);
    }
  }, []);

  useEffect(() => {
    loadGuru();
  }, [loadGuru]);

  const filteredData = useMemo(
    () =>
      guruData.filter(
        (g) =>
          g.guru?.nama_guru?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.profile?.nama_guru?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.username?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [guruData, searchQuery]
  );

  const openAdd = () => {
    setFormData(emptyForm);
    setView('add');
  };

  const openEdit = (guru) => {
    const profile = guru.guru || guru.profile || {};
    setCurrentId(guru.id_user);
    setFormData({
      username: guru.username,
      email: guru.email,
      password: '',
      nama_guru: profile.nama_guru || '',
      nip_nuptk: profile.nip_nuptk || '',
      jenis_kelamin: profile.jenis_kelamin || 'L',
      agama: profile.agama || 'Islam',
      alamat: profile.alamat || '',
      no_hp: profile.no_hp || '',
      role: guru.role,
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
        if (!formData.password) {
          Swal.fire('Opps', 'Password wajib diisi untuk pengguna baru!', 'warning');
          return;
        }
        await createGuru(formData);
        toastSuccess('Berhasil', 'Data tenaga pendidik ditambahkan');
      } else {
        const payload = { ...formData };
        if (payload.password === '') delete payload.password;
        await updateGuru(currentId, payload);
        toastSuccess('Berhasil', 'Data tenaga pendidik diperbarui');
      }
      await loadGuru();
      setView('list');
    } catch (error) {
      toastError('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setLoading(false);
    }
  };

  const removeGuru = async (id_user) => {
    const ok = await confirmAction({
      title: 'Hapus Data Guru?',
      text: 'Tenaga pendidik beserta akun loginnya akan dihapus permanen!',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });
    if (!ok) return;
    try {
      await deleteGuru(id_user);
      toastSuccess('Terhapus!', 'Satu akun tenaga pendidik telah dihapus.');
      loadGuru();
    } catch {
      toastError('Gagal', 'Gagal menghapus data guru.');
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
    removeGuru,
  };
}
