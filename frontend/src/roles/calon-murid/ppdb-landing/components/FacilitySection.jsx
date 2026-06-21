import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function FacilitySection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section" id="fasilitas">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Sarana Prasarana"
          title="Fasilitas Sekolah"
          subtitle="Lingkungan belajar yang nyaman dan mendukung aktivitas akademik maupun non-akademik."
        />

        <div className="pp-facility-grid pp-reveal">
          {content.facilities.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="pp-card pp-facility-card">
                <div className="pp-facility-card__icon">
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
