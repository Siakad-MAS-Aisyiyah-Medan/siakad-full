import { useState, useCallback, useEffect } from 'react';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { fetchMapelList } from '@app/shared/akademik/mapel/services/mapel.service';
import { fetchNilaiForm, saveNilaiBulk } from '../services/nilai.service';
import { getStoredUser } from '@app/shared/services/auth.service';
import { toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

const emptyMeta = {
  id_kelas: '',
  id_mapel: '',
  tahun_ajaran: '2025/2026',
  semester: 'Ganjil',
};

export function useGuruNilai() {
  const [step, setStep] = useState('filter');
  const [meta, setMeta] = useState(emptyMeta);
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [siswaRows, setSiswaRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userId = getStoredUser()?.id_user;
  const userRole = getStoredUser()?.role;

  const loadOptions = useCallback(async () => {
    try {
      const [kelas, mapel] = await Promise.all([fetchKelasList(), fetchMapelList()]);
      setKelasList(kelas);
      setMapelList(
        userRole === 'admin'
          ? mapel
          : mapel.filter((m) => Number(m.id_guru) === Number(userId))
      );
    } catch (e) {
      console.error(e);
    }
  }, [userId, userRole]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleMetaChange = (e) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const handleNilaiChange = (id_user_siswa, field, value) => {
    setSiswaRows((rows) =>
      rows.map((r) =>
        r.id_user_siswa === id_user_siswa ? { ...r, [field]: value === '' ? '' : Number(value) } : r
      )
    );
  };

  const loadSiswa = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await fetchNilaiForm({
        id_kelas: Number(meta.id_kelas),
        id_mapel: Number(meta.id_mapel),
        tahun_ajaran: meta.tahun_ajaran,
        semester: meta.semester,
      });
      setSiswaRows(
        (data.siswa || []).map((s) => ({
          ...s,
          nilai_tugas: s.nilai_tugas ?? '',
          nilai_uts: s.nilai_uts ?? '',
          nilai_uas: s.nilai_uas ?? '',
          nilai_praktik: s.nilai_praktik ?? '',
          nilai_sikap: s.nilai_sikap ?? '',
        }))
      );
      setStep('input');
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal memuat daftar siswa');
    } finally {
      setLoading(false);
    }
  };

  const saveNilai = async () => {
    setSaving(true);
    try {
      await saveNilaiBulk({
        meta: {
          id_kelas: Number(meta.id_kelas),
          id_mapel: Number(meta.id_mapel),
          tahun_ajaran: meta.tahun_ajaran,
          semester: meta.semester,
        },
        items: siswaRows.map((r) => ({
          id_user_siswa: r.id_user_siswa,
          nilai_tugas: Number(r.nilai_tugas),
          nilai_uts: Number(r.nilai_uts),
          nilai_uas: Number(r.nilai_uas),
          nilai_praktik: r.nilai_praktik === '' ? null : Number(r.nilai_praktik),
          nilai_sikap: r.nilai_sikap === '' ? null : Number(r.nilai_sikap),
        })),
      });
      toastSuccess('Berhasil', 'Data berhasil disimpan');
      setStep('filter');
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal menyimpan nilai');
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
    handleNilaiChange,
    loadSiswa,
    saveNilai,
    reset,
  };
}
