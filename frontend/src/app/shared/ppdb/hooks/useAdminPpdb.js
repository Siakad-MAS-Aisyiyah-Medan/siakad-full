import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
  fetchAdminPendaftar,
  adminVerifikasi,
  adminRevisi,
  adminTerima,
  adminTolak,
  adminJadikanMurid,
  PPDB_STATUS_LABELS,
} from '@app/shared/services/ppdb.service';
import { toastError, toastSuccess } from '@app/shared/hooks/useConfirm';

export function useAdminPpdb() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminPendaftar({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const counts = { diajukan: 0, terverifikasi: 0, diterima: 0, ditolak: 0, revisi: 0 };
    items.forEach((p) => {
      const s = p.status || p.ppdb_status;
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [items]);

  const promptCatatan = async (title) => {
    const result = await Swal.fire({
      title,
      input: 'textarea',
      inputLabel: 'Catatan untuk calon murid',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      inputValidator: (v) => (!v?.trim() ? 'Catatan wajib diisi' : undefined),
    });
    return result.isConfirmed ? result.value.trim() : null;
  };

  const runAction = async (fn, successMsg) => {
    try {
      await fn();
      toastSuccess('Berhasil', successMsg);
      load();
      return true;
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Aksi gagal');
      return false;
    }
  };

  return {
    items,
    loading,
    stats,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    reload: load,
    STATUS_LABELS: PPDB_STATUS_LABELS,
    verifikasi: (id) => runAction(() => adminVerifikasi(id), 'Status terverifikasi'),
    revisi: async (id) => {
      const catatan = await promptCatatan('Minta Revisi');
      if (!catatan) return false;
      return runAction(() => adminRevisi(id, catatan), 'Status revisi diberikan');
    },
    terima: (id) => runAction(() => adminTerima(id), 'Pendaftar diterima'),
    tolak: async (id) => {
      const catatan = await promptCatatan('Tolak Pendaftar');
      if (!catatan) return false;
      return runAction(() => adminTolak(id, catatan), 'Pendaftar ditolak');
    },
    jadikanMurid: (id, idKelas) =>
      runAction(() => adminJadikanMurid(id, idKelas), 'Berhasil menjadi murid aktif'),
  };
}

