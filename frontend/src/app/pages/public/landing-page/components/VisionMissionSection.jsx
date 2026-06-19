import { Eye, Target, CheckCircle2 } from 'lucide-react';

const MISI_ITEMS = [
  'Menyelenggarakan pendidikan berbasis IT dan Islam.',
  'Mengembangkan potensi bakat dan minat siswa secara holistik.',
  'Membangun lingkungan sekolah yang religius.',
  'Menjalin kemitraan dengan orang tua dan masyarakat.',
];

export default function VisionMissionSection() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-section-header">
          <span className="lp-eyebrow">Arah & Tujuan</span>
          <h2 className="lp-section-title">Visi & Misi</h2>
        </div>

        <div className="lp-visi-misi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <article className="lp-card lp-visi-card">
            <div className="lp-card-icon">
              <Eye size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#064e3b' }}>Visi</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#5f736c', lineHeight: 1.6 }}>
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.2rem' }} />
                Menjadi lembaga pendidikan Islam yang unggul.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#5f736c', lineHeight: 1.6 }}>
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.2rem' }} />
                Berkarakter mulia dan kompetitif.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#5f736c', lineHeight: 1.6 }}>
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.2rem' }} />
                Siap menghadapi tantangan masa depan.
              </li>
            </ul>
          </article>

          <article className="lp-card lp-misi-card">
            <div className="lp-card-icon">
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#064e3b' }}>Misi</h3>
            <ul className="lp-misi-list">
              {MISI_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
