import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  fetchAdminPendaftar,
  fetchAdminPpdbStats,
  adminVerifikasi,
  adminRevisi,
  adminTerima,
  adminTolak,
  adminJadikanMurid,
  PPDB_STATUS_LABELS,
} from '@app/shared/services/ppdb.service';
import { confirmAction, showLoadingAlert, toastError, toastSuccess } from '@app/shared/hooks/useConfirm';

export function useAdminPpdb() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ menunggu: 0, diterima: 0, ditolak: 0 });
  const [loading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setIsFetching(true);
    try {
      const [data, statsData] = await Promise.all([
        fetchAdminPendaftar({
          status: statusFilter || undefined,
          search: searchQuery || undefined,
        }),
        fetchAdminPpdbStats(),
      ]);
      setItems(data);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  // Stats now comes from the backend

  const promptCatatan = async (title) => {
    const result = await Swal.fire({
      customClass: {
        popup: 'siakad-alert-popup',
        icon: 'siakad-alert-icon',
        title: 'siakad-alert-title',
        htmlContainer: 'siakad-alert-html',
        actions: 'siakad-alert-actions',
        confirmButton: 'siakad-alert-btn siakad-alert-btn--primary',
        cancelButton: 'siakad-alert-btn siakad-alert-btn--secondary',
        input: 'siakad-alert-input',
        inputLabel: 'siakad-alert-input-label',
        validationMessage: 'siakad-alert-validation-message',
      },
      buttonsStyling: false,
      backdrop: 'rgba(148, 148, 148, 0.72)',
      title,
      input: 'textarea',
      inputLabel: 'Catatan untuk calon murid',
      inputPlaceholder: 'Tuliskan catatan untuk calon murid',
      showCancelButton: true,
      confirmButtonText: 'Yakin',
      cancelButtonText: 'Batal',
      inputValidator: (v) => (!v?.trim() ? 'Catatan wajib diisi' : undefined),
    });
    return result.isConfirmed ? result.value.trim() : null;
  };

  const runAction = async (fn, successMsg) => {
    try {
      showLoadingAlert('Memproses...');
      await fn();
      Swal.close();
      toastSuccess('Berhasil', successMsg);
      load();
      return true;
    } catch (err) {
      Swal.close();
      toastError('Gagal', err.response?.data?.message || 'Aksi gagal');
      return false;
    }
  };

  return {
    items,
    loading,
    isFetching,
    stats,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    reload: load,
    STATUS_LABELS: PPDB_STATUS_LABELS,
    verifikasi: async (id) => {
      const confirmed = await confirmAction({
        title: 'Apakah Anda Yakin?',
        text: 'Status pendaftar akan diubah menjadi terverifikasi.',
        confirmText: 'Yakin',
        cancelText: 'Batal',
      });
      if (!confirmed) return false;
      return runAction(() => adminVerifikasi(id), 'Status pendaftar berhasil diperbarui');
    },
    revisi: async (id) => {
      const catatan = await promptCatatan('Minta Revisi');
      if (!catatan) return false;
      return runAction(() => adminRevisi(id, catatan), 'Status revisi diberikan');
    },
    terima: async (id) => {
      const confirmed = await confirmAction({
        title: 'Apakah Anda Yakin?',
        text: 'Pendaftar ini akan diterima sebagai calon murid.',
        confirmText: 'Yakin',
        cancelText: 'Batal',
      });
      if (!confirmed) return false;
      return runAction(() => adminTerima(id), 'Pendaftaran berhasil diterima');
    },
    tolak: async (id) => {
      const catatan = await promptCatatan('Tolak Pendaftar');
      if (!catatan) return false;
      return runAction(() => adminTolak(id, catatan), 'Pendaftaran berhasil ditolak');
    },
    jadikanMurid: async (id, idKelas) => {
      const confirmed = await confirmAction({
        title: 'Apakah Anda Yakin?',
        text: 'Calon murid ini akan dipindahkan menjadi murid aktif.',
        confirmText: 'Yakin',
        cancelText: 'Batal',
      });
      if (!confirmed) return false;
      return runAction(() => adminJadikanMurid(id, idKelas), 'Berhasil menjadi murid aktif');
    },
  };
}

