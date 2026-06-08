import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchMuridList, enrollMurid, deleteMurid } from '../services/murid.service';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';
import Swal from 'sweetalert2';

export function useMurid() {
  const [muridData, setMuridData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMurid = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMuridList({ search: searchQuery || undefined });
      setMuridData(data);
    } catch (error) {
      console.error('Error fetching murid:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadMurid();
  }, [loadMurid]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return muridData;
    const q = searchQuery.toLowerCase();
    return muridData.filter((m) => {
      const nama =
        m.siswa?.nama_siswa ||
        m.pendaftaran?.nama_lengkap ||
        '';
      return (
        m.username?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        nama.toLowerCase().includes(q)
      );
    });
  }, [muridData, searchQuery]);

  const promoteMurid = async (murid) => {
    if (murid.role === 'siswa' || murid.siswa) {
      Swal.fire('Info', 'Akun ini sudah berstatus Siswa Aktif.', 'info');
      return;
    }

    const ppdbStatus = murid.pendaftaran?.ppdb_status;
    if (ppdbStatus === 'menjadi_murid') {
      Swal.fire('Info', 'Calon murid sudah menjadi siswa aktif.', 'info');
      return;
    }

    if (!['diterima', 'daftar_ulang'].includes(ppdbStatus)) {
      Swal.fire(
        'Belum Dapat Dipromosikan',
        'PPDB harus berstatus Diterima terlebih dahulu. Gunakan menu Verifikasi PPDB.',
        'warning'
      );
      return;
    }

    let kelasOptions = { '': '— Belum assign kelas —' };
    try {
      const kelasList = await fetchKelasList();
      kelasList.forEach((k) => {
        kelasOptions[k.id_kelas] = k.nama_kelas;
      });
    } catch {
      // Kelas opsional; promosi tetap bisa tanpa assign kelas
    }

    const result = await Swal.fire({
      title: 'Jadikan Siswa?',
      html: '<p style="margin-bottom:0.75rem">Sistem akan membuat profil siswa, NIS otomatis, dan mengubah role.</p>',
      icon: 'question',
      input: Object.keys(kelasOptions).length > 1 ? 'select' : undefined,
      inputOptions: Object.keys(kelasOptions).length > 1 ? kelasOptions : undefined,
      inputPlaceholder: 'Pilih kelas (opsional)',
      showCancelButton: true,
      confirmButtonText: 'Ya, Jadikan Siswa',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#198754',
    });

    if (!result.isConfirmed) return;

    const idKelas = result.value && result.value !== '' ? Number(result.value) : null;

    try {
      await enrollMurid(murid.id_user, idKelas);
      toastSuccess('Berhasil', 'Calon siswa berhasil dipromosikan menjadi siswa');
      loadMurid();
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Promosi gagal');
    }
  };

  const removeMurid = async (id_user) => {
    const ok = await confirmAction({
      title: 'Hapus Data Murid?',
      text: 'Seluruh data profil dan akun akan dihapus permanen!',
      confirmText: 'Ya, Hapus!',
      confirmColor: '#ef4444',
    });

    if (!ok) return;

    try {
      await deleteMurid(id_user);
      toastSuccess('Terhapus!', 'Data Murid berhasil dihapus.');
      loadMurid();
    } catch {
      toastError('Gagal', 'Gagal menghapus data murid.');
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    loading,
    promoteMurid,
    removeMurid,
  };
}
