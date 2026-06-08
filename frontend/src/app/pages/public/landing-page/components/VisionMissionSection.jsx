import { CheckCircle2, Target } from 'lucide-react';
import SectionHeader from './SectionHeader';

const MISI_ITEMS = [
  'Menyelenggarakan pendidikan berbasis IT dan Islam.',
  'Mengembangkan potensi bakat dan minat siswa secara holistik.',
  'Membangun lingkungan sekolah yang religius dan inklusif.',
  'Menjalin kemitraan dengan orang tua dan masyarakat.',
];

export default function VisionMissionSection() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <SectionHeader
          eyebrow="Visi & Misi"
          title="Arah Pendidikan Kami"
          subtitle="Landasan untuk menghadirkan pembelajaran bermutu dan berkarakter mulia."
        />

        <div className="lp-visi-misi-grid lp-reveal">
          <article className="lp-card lp-visi-card">
            <div className="lp-card-icon">
              <Target size={24} aria-hidden="true" />
            </div>
            <h3>Visi</h3>
            <p>
              Menjadi lembaga pendidikan Islam yang unggul, kompetitif, dan berkarakter mulia di
              tingkat regional maupun nasional.
            </p>
          </article>

          <article className="lp-card lp-misi-card">
            <h3>Misi</h3>
            <ul className="lp-misi-list">
              {MISI_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
