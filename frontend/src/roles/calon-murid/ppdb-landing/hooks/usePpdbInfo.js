import { useCallback, useEffect, useState } from 'react';
import { fetchPpdbInfo } from '@/shared/services/ppdb.service';
import { getDefaultPpdbContent, mergePpdbContent } from '../utils/mergePpdbContent';

export function usePpdbInfo() {
  const [content, setContent] = useState(getDefaultPpdbContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromApi, setFromApi] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPpdbInfo();
      setContent(mergePpdbContent(data));
      setFromApi(true);
    } catch (err) {
      setContent(getDefaultPpdbContent());
      setFromApi(false);
      setError(err?.message || 'Gagal memuat data dari server. Menampilkan informasi offline.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    content,
    loading,
    error,
    fromApi,
    refresh: load,
  };
}


