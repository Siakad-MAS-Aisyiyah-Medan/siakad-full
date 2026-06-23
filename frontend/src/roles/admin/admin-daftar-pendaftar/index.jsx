import AdminPageShell from '@/shared/components/AdminPageShell';
import PendaftarTable from '@/shared/ppdb/components/PendaftarTable';
import { useAdminPpdb } from '@/shared/ppdb/hooks/useAdminPpdb';
import { CheckCircle2, Clock, Search, UserRoundPlus, XCircle, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import CustomSelect from '@/shared/components/CustomSelect';

import PageHeader from '@/shared/components/PageHeader';

export default function AdminDaftarPendaftar({ readOnly = false }) {
  const ppdb = useAdminPpdb() || {};
  const stats = ppdb.stats || {};
  const items = Array.isArray(ppdb.items) ? ppdb.items : [];
  const statusFilter = ppdb.statusFilter || '';
  const setStatusFilter = ppdb.setStatusFilter || (() => {});
  const totalCalonMurid = stats.total || items.length || 0;

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
        <PageHeader title="Data PPDB" subtitle="Kelola data pendaftaran peserta didik baru">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</label>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'Semua Status' },
                { value: 'submitted', label: 'Menunggu' },
                { value: 'diterima', label: 'Diterima' },
                { value: 'ditolak', label: 'Ditolak' }
              ]}
            />
          </div>
        </PageHeader>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard
            label="Total Calon Murid"
            value={totalCalonMurid}
            icon={<UserRoundPlus size={22} />}
            gradient="linear-gradient(135deg, #0f172a, #334155)"
          />
          <StatCard
            label="Diterima"
            value={stats.diterima || 0}
            icon={<CheckCircle2 size={22} />}
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
          <StatCard
            label="Ditolak"
            value={stats.ditolak || 0}
            icon={<XCircle size={22} />}
            gradient="linear-gradient(135deg, #dc2626, #ef4444)"
          />
          <StatCard
            label="Menunggu"
            value={stats.menunggu || 0}
            icon={<Clock size={22} />}
            gradient="linear-gradient(135deg, #d97706, #f59e0b)"
          />
        </div>

        {/* Table */}
        <PendaftarTable ppdb={ppdb} readOnly={readOnly} />
      </div>
    </AdminPageShell>
  );
}

function StatCard({ label, value, icon, gradient }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.35rem' }}>{value}</p>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>{label}</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.2)', width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {icon}
      </div>
    </div>
  );
}
