import { createContext, useContext, useMemo } from 'react';
import { usePpdbInfo } from '../hooks/usePpdbInfo';

const PpdbContentContext = createContext(null);

export function PpdbContentProvider({ children }) {
  const ppdb = usePpdbInfo();
  const value = useMemo(() => ppdb, [ppdb]);

  return (
    <PpdbContentContext.Provider value={value}>{children}</PpdbContentContext.Provider>
  );
}

export function usePpdbContent() {
  const ctx = useContext(PpdbContentContext);
  if (!ctx) {
    throw new Error('usePpdbContent harus dipakai di dalam PpdbContentProvider');
  }
  return ctx;
}
