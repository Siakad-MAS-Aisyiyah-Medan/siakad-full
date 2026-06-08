import { useState, useEffect, useCallback } from 'react';
import { fetchAbsensiGuruList, fetchRekapAbsensiGuru } from '../services/absensi-guru.service';
import { absensiStatusLabel } from '@app/shared/constants/absensiStatus';

export function useAbsensiGuru() {
  const [items, setItems] = useState([]);
  const [rekap, setRekap] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, rekapData] = await Promise.all([
        fetchAbsensiGuruList({ per_page: 50 }),
        fetchRekapAbsensiGuru(),
      ]);
      setItems(list);
      setRekap(rekapData);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, rekap, loading, absensiStatusLabel, reload: load };
}
