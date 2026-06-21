import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { deleteBerkas, fetchBerkasList, uploadBerkas } from '@/shared/services/ppdb.service';
import { UPLOAD_BERKAS_ITEMS } from '../config/calonMuridNav';
import { validateBerkasFile } from '../utils/berkasValidation';

const DEFAULT_CONFIG = {
  maxSizeKb: 2048,
  allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
};

export function usePpdbBerkas() {
  const [items, setItems] = useState([]);
  const [canEdit, setCanEdit] = useState(true);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBerkasList();
      const apiItems = data?.items ?? [];
      const byJenis = Object.fromEntries(apiItems.map((i) => [i.jenis_berkas, i]));

      const merged = UPLOAD_BERKAS_ITEMS.map((doc) => {
        const fromApi = byJenis[doc.key];
        return fromApi ?? { jenis_berkas: doc.key, label: doc.label, status: 'belum_upload', url: null };
      });

      setItems(merged);
      setCanEdit(data?.can_edit ?? true);
      setConfig({
        maxSizeKb: data?.max_size_kb ?? DEFAULT_CONFIG.maxSizeKb,
        allowedExtensions: data?.allowed_extensions ?? DEFAULT_CONFIG.allowedExtensions,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat berkas',
        text: err.response?.data?.message || 'Tidak dapat memuat daftar berkas.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (jenis, file) => {
    if (!canEdit) return false;

    const error = validateBerkasFile(file, config);
    if (error) {
      Swal.fire({ icon: 'warning', title: 'File tidak valid', text: error });
      return false;
    }

    setBusyKey(jenis);
    try {
      const updated = await uploadBerkas(jenis, file);
      setItems((prev) => prev.map((item) => (item.jenis_berkas === jenis ? { ...item, ...updated } : item)));
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Berkas diunggah.', timer: 1500, showConfirmButton: false });
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.file?.[0] ||
        err.response?.data?.errors?.jenis_berkas?.[0] ||
        'Gagal mengunggah berkas.';
      Swal.fire({ icon: 'error', title: 'Gagal', text: msg });
      return false;
    } finally {
      setBusyKey(null);
    }
  };

  const remove = async (jenis) => {
    if (!canEdit) return false;

    const doc = items.find((i) => i.jenis_berkas === jenis);
    const confirm = await Swal.fire({
      title: 'Hapus berkas?',
      text: doc?.label ? `${doc.label} akan dihapus dari server.` : 'Berkas akan dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Hapus',
    });
    if (!confirm.isConfirmed) return false;

    setBusyKey(jenis);
    try {
      await deleteBerkas(jenis);
      setItems((prev) =>
        prev.map((item) =>
          item.jenis_berkas === jenis
            ? { ...item, status: 'belum_upload', url: null, preview_url: null, file_name: null, catatan: null }
            : item
        )
      );
      await load();
      Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1200, showConfirmButton: false });
      return true;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal menghapus berkas.' });
      return false;
    } finally {
      setBusyKey(null);
    }
  };

  const uploadedCount = items.filter((i) => i.status && i.status !== 'belum_upload' && i.url).length;
  const requiredCount = UPLOAD_BERKAS_ITEMS.length;

  return {
    items,
    canEdit,
    isReadOnly: !canEdit,
    config,
    loading,
    busyKey,
    uploadedCount,
    requiredCount,
    upload,
    remove,
    reload: load,
  };
}

