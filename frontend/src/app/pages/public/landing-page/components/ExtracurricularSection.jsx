import { useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { Award } from 'lucide-react';
import { getPublicEkskul } from '@app/shared/services/publicEkskul.service';

export default function ExtracurricularSection() {
  const [ekskulList, setEkskulList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEkskul();
  }, []);

  const fetchEkskul = async () => {
    try {
      setLoading(true);
      const response = await getPublicEkskul();
      setEkskulList(response.data || []);
    } catch (error) {
      console.error('Gagal mengambil data ekskul:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ekskul" className="lp-section">
      <div className="lp-container">
        <SectionHeader
          eyebrow="Ekstrakurikuler"
          title="Wadah Pengembangan Bakat"
          subtitle="Beragam kegiatan untuk menumbuhkan minat, bakat, dan karakter siswa."
        />

        {loading ? (
          <p className="lp-empty-state">Memuat data ekstrakurikuler...</p>
        ) : ekskulList.length === 0 ? (
          <p className="lp-empty-state">Belum ada data ekstrakurikuler.</p>
        ) : (
          <div className="lp-ekskul-grid lp-reveal">
            {ekskulList.map((item) => (
              <article key={item.id_ekskul} className="lp-card lp-ekskul-card">
                <div className="lp-ekskul-card__icon">
                  <Award size={28} aria-hidden="true" />
                </div>
                <h3>{item.nama_ekskul}</h3>
                <p>{item.deskripsi || 'Kegiatan ekstrakurikuler di sekolah.'}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
