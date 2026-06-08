import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@app/shared/layouts/MainLayout';
import { fetchBuktiPendaftaran } from "@app/shared/services/ppdb.service";
import { getJsonItem } from '@app/shared/utils/storage';

export default function BuktiPendaftaran() {
  const [bukti, setBukti] = useState(null);
  const [error, setError] = useState('');
  const user = getJsonItem('user');

  useEffect(() => {
    fetchBuktiPendaftaran()
      .then(setBukti)
      .catch((e) => setError(e.response?.data?.message || 'Gagal memuat bukti'));
  }, []);

  const handlePrint = () => window.print();

  return (
    <MainLayout role="calon_siswa" name={user?.username}>
      <div className="pendaftaran-container">
        <div className="panel-header glass no-print">
          <h2>Bukti Pendaftaran</h2>
          <Link to="/calon-murid/dashboard">← Kembali</Link>
        </div>
        {error && <div className="alert-error">{error}</div>}
        {bukti && (
          <div className="ppdb-bukti glass" id="ppdb-bukti-print">
            <h2>SURAT BUKTI DITERIMA PPDB</h2>
            <p>{bukti.sekolah}</p>
            <p>Tahun Ajaran {bukti.tahun_ajaran}</p>
            <hr />
            <p>No. Registrasi: <strong>{bukti.no_registrasi}</strong></p>
            <p>Nama: <strong>{bukti.nama_lengkap}</strong></p>
            <p>NISN: <strong>{bukti.nisn}</strong></p>
            <p>Status: <strong>{bukti.status}</strong></p>
            <button type="button" className="btn-primary no-print mt-4" onClick={handlePrint}>
              Cetak / Download PDF
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

