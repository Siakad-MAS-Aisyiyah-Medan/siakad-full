import { Download, Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';

import PageHeader from '@app/shared/components/PageHeader';

export default function MuridTable({
  data,
  searchQuery,
  onSearchChange,
  onPromote,
  onDelete,
  onEdit,
  isFetching = false,
  readOnly = false,
  onAdd,
}) {
  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader title="Data Murid" subtitle="Kelola data siswa MAS Aisyiyah Medan">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Cari data murid..."
            style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
          />
        </div>
        {readOnly ? (
          <button type="button" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} />
            Unduh Data
          </button>
        ) : (
          <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            Tambah Murid
          </button>
        )}
      </PageHeader>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>No HP</th>
              <th>Tahun Masuk</th>
              <th>Tahun Lulus</th>
              <th>Status</th>
              {!readOnly ? <th style={{ textAlign: 'right' }}>Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={readOnly ? 5 : 6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat data murid...
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((murid, idx) => {
                const isAktif = murid.status_aktif !== false;
                return (
                  <tr key={murid.id_user}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                    <td>{murid.siswa?.no_hp || murid.pendaftaran?.no_hp || '-'}</td>
                    <td>{murid.siswa?.tahun_masuk || murid.pendaftaran?.tahun_masuk || '-'}</td>
                    <td>{murid.siswa?.tahun_lulus || '-'}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isAktif ? 'var(--color-primary-soft)' : '#fef2f2',
                        color: isAktif ? 'var(--color-primary-dark)' : '#991b1b',
                        border: `1px solid ${isAktif ? 'var(--color-primary-light)' : '#fecaca'}`,
                      }}>
                        {isAktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    {!readOnly ? (
                      <td>
                        <div className="actions-cell">
                          <button type="button" onClick={() => onEdit && onEdit(murid)} className="btn-icon edit" title="Edit">
                            <Pencil size={15} />
                          </button>
                          {onPromote && murid.role !== 'siswa' && (
                            <button type="button" onClick={() => onPromote(murid)} className="btn-icon" title="Promosikan" style={{ background: 'var(--color-primary-soft)', borderColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                              <ShieldCheck size={15} />
                            </button>
                          )}
                          <button type="button" onClick={() => onDelete && onDelete(murid.id_user)} className="btn-icon delete" title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={readOnly ? 5 : 6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>🎓</div>
                    <p style={{ fontWeight: 600 }}>Data murid tidak ditemukan</p>
                    <p style={{ fontSize: '0.875rem' }}>Tambah murid baru untuk memulai</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Menampilkan {data.length} data murid
      </div>
    </div>
  );
}
