import { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import { fetchPpdbInfo } from '@app/shared/services/ppdb.service';
import './pengumuman-ppdb.css';

export default function PengumumanPpdb() {
  const [pengumumanData, setPengumumanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchPpdbInfo();
      // data.pengumuman might be available, depending on the API. 
      // If it's a list, we use it. 
      if (data && Array.isArray(data.pengumuman)) {
        setPengumumanData(data.pengumuman);
      } else if (data && data.data && Array.isArray(data.data)) {
        setPengumumanData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalonMuridLayout>
      <div className="pengumuman-header animate-stagger-1">
        <div className="pengumuman-header__icon">
          <Bell size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Pengumuman Terkini</h1>
          <p className="text-emerald-700/80">
            Pusat informasi dan pemberitahuan resmi terkait pendaftaran peserta didik baru.
          </p>
        </div>
      </div>

      <div className="pengumuman-content animate-stagger-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white/50 backdrop-blur rounded-3xl">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p>Memuat pengumuman...</p>
          </div>
        ) : pengumumanData.length === 0 ? (
          <div className="empty-pengumuman">
            <div className="empty-pengumuman__icon">
              <Bell size={48} />
            </div>
            <h3>Belum Ada Pengumuman</h3>
            <p>Saat ini belum ada pengumuman terbaru untuk Anda. Silakan cek kembali nanti secara berkala.</p>
          </div>
        ) : (
          <div className="pengumuman-grid">
            {pengumumanData.map((item, index) => (
              <div key={item.id || index} className="pengumuman-card">
                <div className="pengumuman-card__head">
                  <span className="pengumuman-card__badge">Pemberitahuan</span>
                  {item.created_at && (
                    <span className="pengumuman-card__date">
                      <Calendar size={14} />
                      {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 className="pengumuman-card__title">{item.judul || 'Pengumuman Penting'}</h3>
                <p className="pengumuman-card__excerpt">
                  {item.konten || item.deskripsi || item.isi || 'Tidak ada konten deskripsi untuk pengumuman ini.'}
                </p>
                <div className="pengumuman-card__footer">
                  <button className="pengumuman-btn">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalonMuridLayout>
  );
}
