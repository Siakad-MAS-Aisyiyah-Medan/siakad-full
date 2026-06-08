import { Calendar } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function RegistrationWaveSection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section pp-section--soft" id="periode">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Jadwal Pendaftaran"
          title="Periode Pendaftaran"
          subtitle="Pilih gelombang pendaftaran yang sesuai dan manfaatkan promo yang tersedia."
        />

        <div className="pp-wave-grid pp-reveal">
          {content.waves.map((wave) => (
            <article key={wave.id} className="pp-card pp-wave-card">
              <div className="pp-wave-card__head">
                <span className="pp-wave-card__badge">{wave.badge}</span>
                <div className="pp-wave-card__icon">
                  <Calendar size={24} aria-hidden="true" />
                </div>
              </div>
              <h3>{wave.title}</h3>
              <p className="pp-wave-card__period">{wave.period}</p>
              <ul className="pp-wave-card__perks">
                {wave.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
