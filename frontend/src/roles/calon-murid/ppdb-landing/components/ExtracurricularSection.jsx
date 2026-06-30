import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function ExtracurricularSection() {
  const { content } = usePpdbContent();

  if (!content.extracurricular || content.extracurricular.length === 0) {
    return null;
  }

  return (
    <section className="pp-section pp-section--soft" id="ekstrakurikuler">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Pengembangan Diri"
          title="Ekstrakurikuler"
          subtitle="Beragam pilihan kegiatan ekstrakurikuler untuk mengembangkan bakat dan minat siswa di luar jam pelajaran akademis."
        />

        <div className="pp-ekskul-grid pp-reveal">
          {content.extracurricular.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="pp-card pp-ekskul-card">
                <div className="pp-ekskul-card__icon">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <h3>{item.name}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
