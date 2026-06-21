// useGuruAbsensi.js
// PERBAIKAN UTAMA:
// Sebelumnya: daftarList diisi dari localStorage('mock_daftar_absensi')
// Sesudahnya:  daftarList diisi dari GET /api/guru/absensi/siswa/rekap
//              yang memanggil AbsensiSiswaService::getRekap() di backend

import { useState, useEffect, useCallback } from 'react';
import { absensiService } from '../services/absensi.service';

export function useGuruAbsensi() {
  // ── Filter State ──────────────────────────────────────────────
  const [filter, setFilter] = useState({
    id_tahun_ajaran: '',
    id_jadwal: '',
    tahunAjaranOptions: [],
  });

  // ── Data State ────────────────────────────────────────────────
  const [jadwalList, setJadwalList]   = useState([]);
  const [daftarList, setDaftarList]   = useState([]); // ← dari API, bukan localStorage
  const [siswaList, setSiswaList]     = useState([]);
  const [formData, setFormData]       = useState(null);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [absensiMap, setAbsensiMap]   = useState({});

  // ── UI State ──────────────────────────────────────────────────
  const [isLoading, setIsLoading]           = useState(false);
  const [isLoadingDaftar, setIsLoadingDaftar] = useState(false); // khusus daftarList
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [error, setError]                   = useState(null);

  // ── 1. Load Tahun Ajaran saat mount ───────────────────────────
  useEffect(() => {
    absensiService.getTahunAjaran?.()
      .then((res) => {
        setFilter((prev) => ({
          ...prev,
          tahunAjaranOptions: res.data ?? [],
        }));
      })
      .catch(() => {});
  }, []);

  // ── 2. Load Jadwal saat Tahun Ajaran berubah ─────────────────
  useEffect(() => {
    if (!filter.id_tahun_ajaran) {
      setJadwalList([]);
      setDaftarList([]);
      return;
    }

    absensiService.getJadwalGuru(filter.id_tahun_ajaran)
      .then((res) => setJadwalList(res.data ?? []))
      .catch(() => setJadwalList([]));
  }, [filter.id_tahun_ajaran]);

  // ── 3. Load Daftar Pertemuan (rekap) saat Jadwal berubah ─────
  // PERBAIKAN: sebelumnya membaca localStorage('mock_daftar_absensi')
  // Sekarang memanggil API /api/guru/absensi/siswa/rekap
  useEffect(() => {
    if (!filter.id_jadwal || !filter.id_tahun_ajaran) {
      setDaftarList([]);
      return;
    }

    setIsLoadingDaftar(true);
    setError(null);

    absensiService.getRekap({
      id_jadwal:       filter.id_jadwal,
      id_tahun_ajaran: filter.id_tahun_ajaran,
    })
      .then((res) => setDaftarList(res.data ?? []))
      .catch(() => {
        setError('Gagal memuat riwayat absensi.');
        setDaftarList([]);
      })
      .finally(() => setIsLoadingDaftar(false));
  }, [filter.id_jadwal, filter.id_tahun_ajaran]);

  // ── Handler: perubahan filter ─────────────────────────────────
  const handleFilterChange = useCallback((key, value) => {
    setFilter((prev) => {
      const next = { ...prev, [key]: value };
      // Reset jadwal jika tahun ajaran berubah
      if (key === 'id_tahun_ajaran') next.id_jadwal = '';
      return next;
    });
    setSelectedJadwal(null);
    setAbsensiMap({});
    setSiswaList([]);
  }, []);

  // ── Handler: klik "Isi Absensi Baru" atau "Lihat/Edit" ────────
  const handleIsiAbsensi = useCallback((itemRekap = null) => {
    const tanggal = itemRekap?.tanggal ?? new Date().toISOString().split('T')[0];

    setIsLoading(true);
    setError(null);

    absensiService.getFormData({
      id_jadwal:       filter.id_jadwal,
      id_tahun_ajaran: filter.id_tahun_ajaran,
      tanggal,
    })
      .then((res) => {
        const { siswa, absensi_existing } = res.data ?? {};

        setSiswaList(siswa ?? []);
        setFormData(res.data);
        setSelectedJadwal({ ...filter, tanggal });

        // Pre-fill status jika sudah ada absensi sebelumnya
        const map = {};
        (absensi_existing ?? []).forEach((a) => {
          map[a.id_siswa] = { status: a.status, keterangan: a.keterangan ?? '' };
        });
        // Default H untuk siswa yang belum ada
        (siswa ?? []).forEach((s) => {
          if (!map[s.id]) map[s.id] = { status: 'H', keterangan: '' };
        });
        setAbsensiMap(map);
      })
      .catch(() => setError('Gagal memuat data form absensi.'))
      .finally(() => setIsLoading(false));
  }, [filter]);

  const handleJadwalSelect = useCallback((item) => {
    handleIsiAbsensi(item);
  }, [handleIsiAbsensi]);

  // ── Handler: perubahan status / keterangan per siswa ─────────
  const handleStatusChange = useCallback((idSiswa, field, value) => {
    setAbsensiMap((prev) => ({
      ...prev,
      [idSiswa]: { ...prev[idSiswa], [field]: value },
    }));
  }, []);

  // ── Handler: submit bulk absensi ──────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedJadwal) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      id_jadwal:       filter.id_jadwal,
      id_tahun_ajaran: filter.id_tahun_ajaran,
      tanggal:         selectedJadwal.tanggal,
      absensi: siswaList.map((s) => ({
        id_siswa:    s.id,
        status:      absensiMap[s.id]?.status      ?? 'H',
        keterangan:  absensiMap[s.id]?.keterangan  ?? '',
      })),
    };

    try {
      await absensiService.bulkStore(payload);

      // Refresh daftar pertemuan dari API setelah simpan berhasil
      const res = await absensiService.getRekap({
        id_jadwal:       filter.id_jadwal,
        id_tahun_ajaran: filter.id_tahun_ajaran,
      });
      setDaftarList(res.data ?? []);
      setSelectedJadwal(null);
      setAbsensiMap({});
      setSiswaList([]);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal menyimpan absensi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedJadwal, filter, siswaList, absensiMap]);

  // ── Handler: reset form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setSelectedJadwal(null);
    setAbsensiMap({});
    setSiswaList([]);
    setError(null);
  }, []);

  return {
    jadwalList,
    daftarList,
    formData,
    siswaList,
    isLoading,
    isLoadingDaftar,
    isSubmitting,
    error,
    filter,
    selectedJadwal,
    absensiMap,
    handleFilterChange,
    handleJadwalSelect,
    handleStatusChange,
    handleSubmit,
    handleIsiAbsensi,
    resetForm,
  };
}
