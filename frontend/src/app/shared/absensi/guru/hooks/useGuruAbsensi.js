import { useState, useCallback, useEffect } from 'react';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { fetchMapelList } from '@app/shared/akademik/mapel/services/mapel.service';
import { fetchAbsensiForm, saveAbsensiBulk } from '../services/absensi.service';
import { getStoredUser } from '@app/shared/services/auth.service';
import { toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const today = new Date().toISOString().slice(0, 10);

const emptyMeta = {
  id_kelas: '',
  id_mapel: '',
  tanggal: today,
  jam_mulai: '07:00',
  jam_selesai: '08:30',
  tahun_ajaran: '2025/2026',
  semester: 'Ganjil',
};

export function useGuruAbsensi() {
  const [step, setStep] = useState('filter');
  const [meta, setMeta] = useState(emptyMeta);
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [siswaRows, setSiswaRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userId = getStoredUser()?.id_user;

  const loadOptions = useCallback(async () => {
    try {
      const [kelas, mapel] = await Promise.all([fetchKelasList(), fetchMapelList()]);
      setKelasList(kelas);
      setMapelList(mapel.filter((m) => Number(m.id_guru) === Number(userId)));
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleMetaChange = (e) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const loadSiswa = async (forcedMeta = null) => {
    const m = forcedMeta && !forcedMeta.target ? forcedMeta : meta;
    setLoading(true);
    try {
      const data = await fetchAbsensiForm({
        id_kelas: Number(m.id_kelas),
        id_mapel: Number(m.id_mapel),
        tanggal: m.tanggal,
        jam_mulai: m.jam_mulai,
        jam_selesai: m.jam_selesai,
        tahun_ajaran: m.tahun_ajaran,
        semester: m.semester,
      });
      setSiswaRows(
        (data.siswa || []).map((s) => ({
          ...s,
          status: s.status || 'H',
        }))
      );
      setStep('input');
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal memuat daftar siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id_user_siswa, status) => {
    setSiswaRows((rows) =>
      rows.map((r) => (r.id_user_siswa === id_user_siswa ? { ...r, status } : r))
    );
  };

  const saveAbsensi = async () => {
    setSaving(true);
    try {
      await saveAbsensiBulk({
        meta: {
          id_kelas: Number(meta.id_kelas),
          id_mapel: Number(meta.id_mapel),
          tanggal: meta.tanggal,
          jam_mulai: meta.jam_mulai,
          jam_selesai: meta.jam_selesai,
          tahun_ajaran: meta.tahun_ajaran,
          semester: meta.semester,
        },
        items: siswaRows.map((r) => ({
          id_user_siswa: r.id_user_siswa,
          status: r.status,
          keterangan: r.keterangan || null,
        })),
      });
      toastSuccess('Berhasil', 'Absensi siswa berhasil disimpan');
      setStep('filter');
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal menyimpan absensi');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setStep('filter');
    setSiswaRows([]);
  };

  return {
    step,
    meta,
    kelasList,
    mapelList,
    siswaRows,
    loading,
    saving,
    handleMetaChange,
    loadSiswa,
    handleStatusChange,
    saveAbsensi,
    reset,
  };
}
