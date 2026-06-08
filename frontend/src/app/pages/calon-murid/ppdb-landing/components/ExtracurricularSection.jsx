import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function ExtracurricularSection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section pp-section--soft" id="ekskul">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Pengembangan Diri"
          title="Ekstrakurikuler"
          subtitle="Kegiatan ekstrakurikuler untuk menumbuhkan bakat, minat, dan karakter siswa."
        />

        <div className="pp-ekskul-grid pp-reveal">
          {content.extracurricular.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="pp-card pp-ekskul-card">
                <div className="pp-ekskul-card__icon">
                  <Icon size={24} aria-hidden="true" />
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
