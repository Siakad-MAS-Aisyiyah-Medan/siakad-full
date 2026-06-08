import { useCallback, useEffect, useState } from 'react';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';
import { fetchAuditLogs } from '../services/audit-log.service';

export function useAuditLogs() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAuditLogs({
        search: search || undefined,
        action: action || undefined,
        per_page: 25,
      });
      const { items: rows, meta: pagination } = unwrapPaginated(response);
      setItems(rows);
      setMeta(pagination);
    } catch {
      setItems([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [search, action]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    meta,
    loading,
    search,
    setSearch,
    action,
    setAction,
    reload: load,
  };
}
