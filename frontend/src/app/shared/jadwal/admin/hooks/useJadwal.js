import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';
import { fetchMapelList } from '@app/shared/akademik/mapel/services/mapel.service';
import { fetchGuruList } from '@app/shared/akademik/guru/services/guru.service';
import { fetchJadwalMatrix, saveJadwalMatrix } from '../services/jadwal.service';
import { fetchWaktuPelajaran } from '../services/waktu.service';
import { confirmAction, toastSuccess, toastError } from '@app/shared/hooks/useConfirm';
import { resolveJadwalConflictMessage } from '@app/shared/utils/jadwalConflictMessage';

export function useJadwal() {
  const [view, setView] = useState('list'); // 'list' | 'matrix'
  const [kelasData, setKelasData] = useState([]);
  const [mapelData, setMapelData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [waktuData, setWaktuData] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentKelas, setCurrentKelas] = useState(null);
  const [matrixData, setMatrixData] = useState([]); // format: [{ waktu: {...}, jadwal: { Senin: {...}, Selasa: {...} } }]
  
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [semester, setSemester] = useState('Ganjil');

  const loadBaseData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [kelas, mapel, guru, waktu] = await Promise.all([
        fetchKelasList(),
        fetchMapelList(),
        fetchGuruList({ per_page: 100 }),
        fetchWaktuPelajaran(),
      ]);
      setKelasData(kelas);
      setMapelData(mapel);
      setGuruData(guru);
      setWaktuData(waktu.data || waktu); // handle ApiResponse structure
    } catch (error) {
      console.error('Error fetching base data:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  const filteredKelas = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return kelasData.filter((k) => k.nama_kelas?.toLowerCase().includes(q));
  }, [kelasData, searchQuery]);

  const openMatrix = async (kelas) => {
    setCurrentKelas(kelas);
    setView('matrix');
    await loadMatrixData(kelas.id_kelas);
  };

  const loadMatrixData = async (id_kelas) => {
    setLoading(true);
    try {
      const res = await fetchJadwalMatrix(id_kelas, { tahun_ajaran: tahunAjaran, semester });
      setMatrixData(res.data?.matrix || []);
    } catch (error) {
      console.error('Error fetching matrix:', error);
      toastError('Gagal', 'Tidak dapat memuat jadwal kelas ini.');
    } finally {
      setLoading(false);
    }
  };

  const cancelMatrix = () => {
    setView('list');
    setCurrentKelas(null);
    setMatrixData([]);
  };

  const handleMatrixChange = (id_waktu, hari, field, value) => {
    setMatrixData((prev) =>
      prev.map((row) => {
        if (row.waktu.id_waktu === id_waktu) {
          const newJadwal = { ...row.jadwal };
          if (!newJadwal[hari]) newJadwal[hari] = {};
          newJadwal[hari][field] = value;
          return { ...row, jadwal: newJadwal };
        }
        return row;
      })
    );
  };

  const saveMatrix = async () => {
    const ok = await confirmAction({
      title: 'Simpan Jadwal?',
      text: `Jadwal untuk ${currentKelas.nama_kelas} akan disimpan secara permanen.`,
      confirmText: 'Ya, Simpan',
      confirmColor: '#10b981',
    });
    if (!ok) return;

    setLoading(true);
    try {
      // Flatten matrix into array of jadwal
      const payloadJadwal = [];
      const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      
      matrixData.forEach((row) => {
        if (row.waktu.tipe === 'istirahat') return; // Skip istirahat
        
        hariList.forEach((hari) => {
          const cell = row.jadwal[hari];
          if (cell && cell.id_mapel && cell.id_guru) {
            payloadJadwal.push({
              hari,
              id_waktu: row.waktu.id_waktu,
              id_mapel: Number(cell.id_mapel),
              id_guru: Number(cell.id_guru),
              ruangan: cell.ruangan || null,
            });
          }
        });
      });

      const payload = {
        tahun_ajaran: tahunAjaran,
        semester,
        jadwal: payloadJadwal,
      };

      await saveJadwalMatrix(currentKelas.id_kelas, payload);
      toastSuccess('Berhasil', 'Data berhasil disimpan');
      
      // Reload class list to update jadwal_count badge
      loadBaseData();
    } catch (error) {
      toastError('Gagal Menyimpan', resolveJadwalConflictMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    view,
    searchQuery,
    setSearchQuery,
    filteredKelas,
    mapelData,
    guruData,
    waktuData,
    matrixData,
    currentKelas,
    tahunAjaran,
    setTahunAjaran,
    semester,
    setSemester,
    loading,
    isFetching,
    openMatrix,
    cancelMatrix,
    handleMatrixChange,
    saveMatrix,
  };
}
