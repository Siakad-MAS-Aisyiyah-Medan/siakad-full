import { CalendarDays, Eye, Megaphone, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import PageHeader from '@app/shared/components/PageHeader';

function AdminPengumumanTable({ filteredData, searchQuery, onSearchChange, onAdd, onEdit, onDelete, isFetching }) {
  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader title="Pengumuman Sekolah" subtitle="Kelola pengumuman untuk civitas MAS Aisyiyah Medan">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
          />
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            Tambah Pengumuman
          </button>
        )}
      </PageHeader>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul Pengumuman</th>
              <th>Tanggal Publikasi</th>
              <th>Akses</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat pengumuman...
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{item.judul}</td>
                  <td>{item.tanggal_publikasi || '-'}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: item.akses === 'semua' ? 'var(--color-primary-soft)' : '#eff6ff',
                      color: item.akses === 'semua' ? 'var(--color-primary-dark)' : '#1d4ed8',
                      border: `1px solid ${item.akses === 'semua' ? 'var(--color-primary-light)' : '#bfdbfe'}`,
                      textTransform: 'capitalize',
                    }}>
                      {item.akses || 'umum'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button type="button" className="btn-icon" title="Lihat Isi" style={{ background: 'var(--color-primary-soft)', borderColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                        <Eye size={15} />
                      </button>
                      <button type="button" onClick={() => onEdit?.(item)} className="btn-icon edit" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button type="button" onClick={() => onDelete?.(item.id)} className="btn-icon delete" title="Hapus">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>📢</div>
                    <p style={{ fontWeight: 600 }}>Belum ada pengumuman</p>
                    <p style={{ fontSize: '0.875rem' }}>Tambah pengumuman baru untuk memulai</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Menampilkan {filteredData.length} pengumuman
      </div>
    </div>
  );
}

function ReadOnlyPengumumanCards({ filteredData, searchQuery, onSearchChange, isFetching }) {
  return (
    <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
      <PageHeader title="Pengumuman Sekolah" subtitle="Informasi terbaru dari MAS Aisyiyah Medan">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
          />
        </div>
      </PageHeader>

      {/* Cards */}
      {isFetching ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Memuat pengumuman...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredData.length > 0 ? (
            filteredData.slice(0, 8).map((item) => (
              <article key={item.id} style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Thumbnail */}
                <div style={{ height: '160px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Megaphone size={40} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                  )}
                </div>
                {/* Body */}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem', lineClamp: 2 }}>{item.judul}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.isi}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    <CalendarDays size={13} />
                    {item.tanggal_publikasi || '-'}
                  </div>
                  <button type="button" className="btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                    Baca Selengkapnya →
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📢</div>
              <p style={{ fontWeight: 600 }}>Belum ada pengumuman</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PengumumanTable(props) {
  if (props.readOnly) {
    return <ReadOnlyPengumumanCards {...props} />;
  }
  return <AdminPengumumanTable {...props} />;
}
