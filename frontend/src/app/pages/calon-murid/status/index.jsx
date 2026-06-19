import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PageHeader from '@app/shared/components/PageHeader';
import { fetchPpdbStatus, PPDB_STATUS_LABELS } from '@app/shared/services/ppdb.service';
import { getJsonItem } from '@app/shared/utils/storage';
import './status-pendaftaran.css';

export default function StatusPendaftaran() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getJsonItem('user');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchPpdbStatus();
      setStatusData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const status = statusData?.status || 'belum';
  const label = PPDB_STATUS_LABELS[status] || status;

  return (
    <CalonMuridLayout>
      <PageHeader 
        title="Status Pendaftaran"
        subtitle="Pantau perkembangan dan hasil verifikasi pendaftaran Anda di sini."
      >
        <button onClick={loadData} disabled={loading} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem' }} aria-label="Refresh status">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </PageHeader>

      <div className="status-content animate-stagger-2">
        {/* Kartu Status Utama */}
        <div className="status-card-main">
          <div className="status-card-main__badge-wrap">
            <span className={`status-badge-lg status-badge-lg--${status}`}>
              {status === 'accepted' ? <CheckCircle2 size={24} /> : 
               status === 'rejected' ? <AlertCircle size={24} /> : <Clock size={24} />}
              {label}
            </span>
          </div>
          
          <div className="status-card-main__info">
            <h2>{user?.name || user?.username || 'Calon Siswa'}</h2>
            <p><strong>No. Pendaftaran:</strong> {statusData?.no_pendaftaran || '-'}</p>
            <p><strong>Tanggal Submit:</strong> {statusData?.submitted_at ? new Date(statusData.submitted_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
          </div>

          {statusData?.catatan_admin && (
            <div className="status-alert status-alert--warning mt-4">
              <strong>Catatan dari Admin:</strong>
              <p>{statusData.catatan_admin}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="status-timeline-card">
          <h3 className="status-timeline-card__title">Perjalanan Pendaftaran</h3>
          <ul className="status-timeline">
            <li className="status-timeline__item status-timeline__item--done">
              <div className="status-timeline__dot"><CheckCircle2 size={16} /></div>
              <div className="status-timeline__content">
                <strong>Pembuatan Akun</strong>
                <span>Akun Anda telah berhasil dibuat.</span>
              </div>
            </li>
            
            <li className={`status-timeline__item ${statusData?.submitted_at ? 'status-timeline__item--done' : 'status-timeline__item--active'}`}>
              <div className="status-timeline__dot">
                {statusData?.submitted_at ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div className="status-timeline__content">
                <strong>Pengisian Formulir</strong>
                <span>{statusData?.submitted_at ? 'Formulir telah dikirim.' : 'Harap lengkapi dan submit formulir pendaftaran.'}</span>
              </div>
            </li>

            <li className={`status-timeline__item ${['verified', 'accepted', 'rejected'].includes(status) ? 'status-timeline__item--done' : (status === 'submitted' ? 'status-timeline__item--active' : '')}`}>
              <div className="status-timeline__dot">
                {['verified', 'accepted', 'rejected'].includes(status) ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div className="status-timeline__content">
                <strong>Verifikasi Berkas</strong>
                <span>Admin sedang memeriksa kesesuaian data dan dokumen.</span>
              </div>
            </li>

            <li className={`status-timeline__item ${['accepted', 'rejected'].includes(status) ? 'status-timeline__item--done' : (status === 'verified' ? 'status-timeline__item--active' : '')}`}>
              <div className="status-timeline__dot">
                {status === 'accepted' ? <CheckCircle2 size={16} /> : status === 'rejected' ? <AlertCircle size={16} /> : <Clock size={16} />}
              </div>
              <div className="status-timeline__content">
                <strong>Hasil Akhir</strong>
                <span>
                  {status === 'accepted' ? 'Selamat! Anda diterima.' : 
                   status === 'rejected' ? 'Mohon maaf, pendaftaran ditolak.' : 'Menunggu pengumuman akhir.'}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </CalonMuridLayout>
  );
}
