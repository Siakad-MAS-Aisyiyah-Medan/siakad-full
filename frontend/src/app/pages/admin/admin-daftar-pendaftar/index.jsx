import AdminPageShell from '@app/shared/components/AdminPageShell';
import PendaftarTable from '@app/shared/ppdb/components/PendaftarTable';
import { useAdminPpdb } from '@app/shared/ppdb/hooks/useAdminPpdb';
import { CheckCircle2, Clock, Search, UserRoundPlus, XCircle, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function CustomSelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative', width: '160px' }}>
      <style>
        {`
          @keyframes dropdownSmooth {
            from { opacity: 0; transform: translateY(-10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem', background: '#fff', border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
          borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-dark)', cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 3px var(--color-primary-soft)' : '0 2px 5px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease', outline: 'none'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedOption.label}</span>
        <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '100%',
          background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, padding: '0.4rem',
          animation: 'dropdownSmooth 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transformOrigin: 'top center'
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0.8rem', background: value === option.value ? 'var(--color-primary-soft)' : 'transparent',
                border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: value === option.value ? 600 : 500,
                color: value === option.value ? 'var(--color-primary-dark)' : 'var(--color-text-dark)',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s ease'
              }}
              onMouseOver={(e) => { if (value !== option.value) e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseOut={(e) => { if (value !== option.value) e.currentTarget.style.background = 'transparent'; }}
            >
              {option.label}
              {value === option.value && <Check size={14} style={{ color: 'var(--color-primary)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDaftarPendaftar({ readOnly = false }) {
  const ppdb = useAdminPpdb() || {};
  const stats = ppdb.stats || {};
  const items = Array.isArray(ppdb.items) ? ppdb.items : [];
  const statusFilter = ppdb.statusFilter || '';
  const setStatusFilter = ppdb.setStatusFilter || (() => {});
  const totalCalonMurid = stats.total || items.length || 0;

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in">
        {/* Page Header */}
        <div className="panel-header mb-4">
          <div className="header-text">
            <h2>Data PPDB</h2>
            <p>Kelola data pendaftaran peserta didik baru</p>
          </div>
          <div className="header-actions">
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
          </div>
        </div>

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
