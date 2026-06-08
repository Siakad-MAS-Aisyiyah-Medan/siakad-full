import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import StatusBadge from '@app/shared/ppdb/components/StatusBadge';
import { fetchAdminPendaftarDetail } from "@app/shared/services/ppdb.service";
import { BERKAS_LABELS } from "@app/shared/services/ppdb.service";

export default function AdminDetailPendaftar() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPendaftarDetail(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  const status = data?.status || data?.ppdb_status;

  return (
    <AdminPageShell>
      <DetailPanel loading={loading} data={data} status={status} id={id} />
    </AdminPageShell>
  );
}

function DetailPanel({ loading, data, status, id }) {
  return (
    <div className="data-panel">
      <div className="panel-header glass">
        <h2>Detail Pendaftar</h2>
        <Link to="/admin/ppdb">← Daftar</Link>
        <Link to={`/admin/ppdb/${id}/verifikasi`} className="btn-primary sm">
          Verifikasi
        </Link>
      </div>
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <DetailContent data={data} status={status} />
      )}
    </div>
  );
}

function DetailContent({ data, status }) {
  return (
    <div className="glass p-6">
      <p>
        <strong>Status:</strong> <StatusBadge status={status} />
      </p>
      <p>
        <strong>No. Registrasi:</strong> {data?.no_registrasi || '-'}
      </p>
      <p>
        <strong>Nama:</strong> {data?.nama_lengkap}
      </p>
      <p>
        <strong>NISN:</strong> {data?.nisn}
      </p>
      <p>
        <strong>Email:</strong> {data?.user?.email}
      </p>
      <h3 className="mt-4">Biodata</h3>
      <p>Tempat/Tgl Lahir: {data?.tempat_lahir}, {data?.tanggal_lahir || data?.tgl_lahir}</p>
      <p>Asal Sekolah: {data?.asal_sekolah || data?.sekolah_asal}</p>
      <h3 className="mt-4">Orang Tua</h3>
      <p>Ayah: {data?.nama_ayah} ({data?.pekerjaan_ayah})</p>
      <p>Ibu: {data?.nama_ibu} ({data?.pekerjaan_ibu})</p>
      <h3 className="mt-4">Berkas</h3>
      <ul>
        {(data?.berkas || []).map((b) => (
          <li key={b.id}>
            {BERKAS_LABELS[b.jenis_berkas] || b.jenis_berkas}:{' '}
            <a href={b.url} target="_blank" rel="noreferrer">
              Lihat
            </a>
          </li>
        ))}
      </ul>
      {data?.catatan_admin && (
        <p className="mt-4">
          <strong>Catatan:</strong> {data.catatan_admin}
        </p>
      )}
    </div>
  );
}

