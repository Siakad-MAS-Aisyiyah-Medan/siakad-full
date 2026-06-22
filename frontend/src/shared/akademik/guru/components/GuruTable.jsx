import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';

import { exportToExcel } from '@/shared/utils/exportExcel';

export default function GuruTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  const handleDownload = () => {
    const dataToExport = filteredData.map(item => {
      const profile = item.guru || item.profile || {};
      return {
        'Nama Guru': profile.nama_guru || '-',
        'NIP/NUPTK': profile.nip_nuptk || '-',
        'Jenis Kelamin': profile.jenis_kelamin === 'L' ? 'Laki-Laki' : profile.jenis_kelamin === 'P' ? 'Perempuan' : '-',
        'No. Handphone': profile.no_hp || '-',
        'Alamat': profile.alamat || '-',
        'Jabatan': item.role_label || 'Guru',
      };
    });
    exportToExcel('Data_Guru.xlsx', dataToExport);
  };

  return (
    <div className="animate-fade-in" style={{ margin: '-1.5rem', background: 'var(--color-white)', minHeight: 'calc(100vh - 84px)', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Data Guru" subtitle="Kelola data guru MAS Aisyiyah Medan">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', color: '#94a3b8', pointerEvents: 'none', transition: 'color 0.2s ease' }} className="search-icon" />
          <input
            type="text"
            placeholder="Cari data guru..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              paddingLeft: '2.75rem', paddingRight: '1rem', height: '42px',
              border: '1px solid var(--color-border)', borderRadius: '12px',
              fontSize: '0.9rem', outline: 'none', width: '260px',
              background: '#f8fafc', color: 'var(--color-text-dark)',
              transition: 'all 0.2s ease', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
            }}
            onFocus={(e) => { 
              e.target.style.background = '#fff'; 
              e.target.style.borderColor = 'var(--color-primary)'; 
              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-soft)';
              e.target.previousElementSibling.style.color = 'var(--color-primary)';
            }}
            onBlur={(e) => { 
              e.target.style.background = '#f8fafc'; 
              e.target.style.borderColor = 'var(--color-border)'; 
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)';
              e.target.previousElementSibling.style.color = '#94a3b8';
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {readOnly ? (
            <button type="button" onClick={handleDownload} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} />
              Unduh Data
            </button>
          ) : (
            <>
              <button type="button" onClick={handleDownload} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}>
                <Download size={16} />
                Unduh Data
              </button>
              <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} />
                Tambah Guru
              </button>
            </>
          )}
        </div>
      </PageHeader>

      {/* Table */}
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Guru</th>
              <th>NIP/NUPTK</th>
              <th>Jenis Kelamin</th>
              <th>No HP</th>
              <th>Alamat</th>
              <th>Status</th>
              {!readOnly ? <th style={{ textAlign: 'right' }}>Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={readOnly ? 7 : 8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat data guru...
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((user, idx) => {
                const profile = user.guru || user.profile || {};
                const isAktif = profile.status !== 'nonaktif';
                return (
                  <tr key={user.id_user}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600, paddingLeft: '2rem' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)', whiteSpace: 'nowrap', minWidth: '180px' }}>{profile.nama_guru || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{profile.nip_nuptk || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{profile.jenis_kelamin === 'L' ? 'Laki-laki' : profile.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{profile.no_hp || '-'}</td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.alamat || '-'}</td>
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
                      <td style={{ paddingRight: '2rem' }}>
                        <div className="actions-cell">
                          <button type="button" onClick={() => onEdit && onEdit(user)} className="btn-icon edit" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button type="button" onClick={() => onDelete && onDelete(user.id_user)} className="btn-icon delete" title="Hapus">
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
                <td colSpan={readOnly ? 7 : 8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>👩‍🏫</div>
                    <p style={{ fontWeight: 600 }}>Tidak ada data guru</p>
                    <p style={{ fontSize: '0.875rem' }}>Tambah guru baru untuk memulai</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: '#f8fafc' }}>
        Menampilkan {filteredData.length} data guru
      </div>
    </div>
  );
}
