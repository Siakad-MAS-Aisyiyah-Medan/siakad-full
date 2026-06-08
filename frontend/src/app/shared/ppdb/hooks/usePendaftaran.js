import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  fetchPpdbMe,
  saveFormulir,
  uploadBerkas,
  submitPendaftaran,
  PPDB_STATUS_LABELS,
} from '@app/shared/services/ppdb.service';

const INITIAL_FORM = {
  nama_lengkap: '',
  nisn: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  alamat: '',
  asal_sekolah: '',
  tahun_lulus: '',
  nama_ayah: '',
  pekerjaan_ayah: '',
  nama_ibu: '',
  pekerjaan_ibu: '',
  no_hp_ortu: '',
};

const LOCKED = ['diajukan', 'terverifikasi', 'diterima', 'ditolak', 'daftar_ulang', 'menjadi_murid'];

export function usePendaftaran() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [berkas, setBerkas] = useState([]);
  const [status, setStatus] = useState('draft');
  const [noRegistrasi, setNoRegistrasi] = useState('');
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = status === 'draft' || status === 'revisi';
  const isReadOnly = !canEdit;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPpdbMe();
      const p = data?.pendaftaran;
      if (p) {
        setForm({
          nama_lengkap: p.nama_lengkap || '',
          nisn: p.nisn || '',
          jenis_kelamin: p.jenis_kelamin || '',
          tempat_lahir: p.tempat_lahir || '',
          tanggal_lahir: p.tanggal_lahir || p.tgl_lahir || '',
          agama: p.agama || '',
          alamat: p.alamat || '',
          asal_sekolah: p.asal_sekolah || p.sekolah_asal || '',
          tahun_lulus: p.tahun_lulus || '',
          nama_ayah: p.nama_ayah || '',
          pekerjaan_ayah: p.pekerjaan_ayah || '',
          nama_ibu: p.nama_ibu || '',
          pekerjaan_ibu: p.pekerjaan_ibu || '',
          no_hp_ortu: p.no_hp_ortu || '',
        });
        setBerkas(p.berkas || []);
        setStatus(p.status || p.ppdb_status || 'draft');
        setNoRegistrasi(p.no_registrasi || '');
        setCatatanAdmin(p.catatan_admin || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveFormulir(form);
      setStatus(saved.status || saved.ppdb_status);
      Swal.fire({ icon: 'success', title: 'Tersimpan', text: 'Draft formulir berhasil disimpan.', timer: 2000 });
      await load();
      return true;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal menyimpan formulir' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (jenis, file) => {
    if (isReadOnly) return;
    setSaving(true);
    try {
      await uploadBerkas(jenis, file);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Berkas diunggah.', timer: 1500 });
      await load();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal mengunggah berkas' });
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    const ok = await Swal.fire({
      title: 'Ajukan Pendaftaran?',
      text: 'Data tidak dapat diubah kecuali admin meminta revisi.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
    });
    if (!ok.isConfirmed) return false;

    setSaving(true);
    try {
      await saveFormulir(form);
      const result = await submitPendaftaran();
      setStatus(result.status || result.ppdb_status);
      setNoRegistrasi(result.no_registrasi || '');
      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Diajukan',
        html: `Nomor registrasi: <strong>${result.no_registrasi || '-'}</strong>`,
      });
      await load();
      return true;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal submit' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    berkas,
    status,
    noRegistrasi,
    catatanAdmin,
    loading,
    saving,
    canEdit,
    isReadOnly,
    isLocked: LOCKED.includes(status),
    statusLabel: PPDB_STATUS_LABELS[status] || status,
    onChange,
    saveDraft,
    handleUpload,
    submit,
    reload: load,
  };
}

