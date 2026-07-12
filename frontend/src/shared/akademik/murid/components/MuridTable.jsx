import { Download, Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';

import { exportToExcel } from '@/shared/utils/exportExcel';

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
  const handleDownload = () => {
    const dataToExport = data.map(item => {
      const isAktif = item.status_aktif !== false;
      const nama = item.siswa?.nama_siswa || item.pendaftaran?.nama_lengkap || '-';
      const noHp = item.siswa?.no_hp || item.siswa?.no_hp_wali || item.pendaftaran?.no_hp || item.pendaftaran?.no_hp_wali || '-';
      const jenisKelamin = item.siswa?.jenis_kelamin || item.pendaftaran?.jenis_kelamin;
      const jkelLabel = jenisKelamin === 'L' ? 'Laki-Laki' : jenisKelamin === 'P' ? 'Perempuan' : '-';

      return {
        'Nama Murid': nama,
        'NISN': item.siswa?.nisn || item.pendaftaran?.nisn || '-',
        'Jenis Kelamin': jkelLabel,
        'Tahun Masuk': item.siswa?.tahun_masuk || item.pendaftaran?.tahun_masuk || '-',
        'Tahun Keluar': item.siswa?.tahun_lulus || '-',
        'Status': isAktif ? 'Aktif' : 'Nonaktif',
        'No. HP': noHp,
        'Alamat': item.siswa?.alamat || item.pendaftaran?.alamat || '-',
      };
    });
    exportToExcel('Data_Murid.xlsx', dataToExport);
  };

  return (
    <div className="animate-fade-in" style={{ background: 'var(--color-white)', minHeight: 'calc(100vh - 84px)', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Data Murid" subtitle="Kelola data siswa MAS Aisyiyah Medan">
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {readOnly ? (
            <button type="button" onClick={handleDownload} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} />
              <span className="hidden sm:inline">Unduh Data</span>
            </button>
          ) : (
            <>
              <button type="button" onClick={handleDownload} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}>
                <Download size={16} />
                <span className="hidden sm:inline">Unduh Data</span>
              </button>
              <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Murid</span>
                <span className="inline sm:hidden">Tambah</span>
              </button>
            </>
          )}
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 px-6 pt-4">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Cari data murid..."
            style={{ paddingLeft: '2.5rem', height: '42px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '100%', background: '#fff', color: 'var(--color-text-dark)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '2rem' }}>No</th>
              <th>Nama Murid</th>
              <th>No HP</th>
              <th>Tahun Masuk</th>
              <th>Tahun Lulus</th>
              <th>Status</th>
              {!readOnly ? <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={readOnly ? 6 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat data murid...
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((murid, idx) => {
                const isAktif = murid.status_aktif !== false;
                const nama = murid.siswa?.nama_siswa || murid.pendaftaran?.nama_lengkap || '-';
                const noHp = murid.siswa?.no_hp || murid.siswa?.no_hp_wali || murid.pendaftaran?.no_hp || murid.pendaftaran?.no_hp_wali || '-';
                return (
                  <tr key={murid.id_user}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600, paddingLeft: '2rem' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)', whiteSpace: 'nowrap', minWidth: '180px' }}>{nama}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{noHp}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{murid.siswa?.tahun_masuk || murid.pendaftaran?.tahun_masuk || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{murid.siswa?.tahun_lulus || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
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
                <td colSpan={readOnly ? 6 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
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

      <div style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: '#f8fafc' }}>
        Menampilkan {data.length} data murid
      </div>
    </div>
  );
}
