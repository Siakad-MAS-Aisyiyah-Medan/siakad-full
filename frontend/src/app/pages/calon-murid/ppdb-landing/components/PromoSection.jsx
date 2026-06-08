import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function PromoSection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section" id="promo">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Keunggulan"
          title="Program & Promo PPDB"
          subtitle="Berbagai keuntungan dan fasilitas pendidikan yang menunjang prestasi siswa."
        />

        <div className="pp-promo-grid pp-reveal">
          {content.promo.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="pp-card pp-promo-card">
                <div className="pp-promo-card__icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
