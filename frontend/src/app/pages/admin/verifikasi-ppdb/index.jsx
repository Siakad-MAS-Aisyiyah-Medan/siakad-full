import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import StatusBadge from '@app/shared/ppdb/components/StatusBadge';
import { useAdminPpdb } from '@app/shared/ppdb/hooks/useAdminPpdb';
import PageHeader from '@app/shared/components/PageHeader';
import { fetchAdminPendaftarDetail } from "@app/shared/services/ppdb.service";

export default function AdminVerifikasiPendaftar() {
  const { id } = useParams();
  const ppdb = useAdminPpdb();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAdminPendaftarDetail(id).then(setData);
  }, [id]);

  const status = data?.status || data?.ppdb_status;

  return (
    <AdminPageShell>
      <PageHeader title="Verifikasi Pendaftar" subtitle="Verifikasi dan tindak lanjut pendaftar PPDB">
        <Link to={`/admin/ppdb/${id}`} className="btn-outline">← Detail</Link>
      </PageHeader>
      <div className="data-panel" style={{ paddingTop: '1rem' }}>
        {data && (
          <>
            <div className="glass p-4 mb-4">
              <p>
                {data.nama_lengkap} — <StatusBadge status={status} />
              </p>
            </div>
            <div className="ppdb-admin-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {status === 'diajukan' && (
                <button type="button" className="btn-primary" onClick={() => ppdb.verifikasi(id)}>
                  Terverifikasi
                </button>
              )}
              {['diajukan', 'terverifikasi'].includes(status) && (
                <>
                  <button type="button" className="btn-secondary" onClick={() => ppdb.revisi(id)}>
                    Minta Revisi
                  </button>
                  {status === 'terverifikasi' && (
                    <button type="button" className="btn-primary" onClick={() => ppdb.terima(id)}>
                      Terima
                    </button>
                  )}
                  <button type="button" className="btn-danger" onClick={() => ppdb.tolak(id)}>
                    Tolak
                  </button>
                </>
              )}
              {['diterima', 'daftar_ulang'].includes(status) && (
                <button type="button" className="btn-primary" onClick={() => ppdb.jadikanMurid(id)}>
                  Jadikan Murid Aktif
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </AdminPageShell>
  );
}

