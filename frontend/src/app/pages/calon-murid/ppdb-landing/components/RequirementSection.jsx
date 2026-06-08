import { CheckCircle2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function RequirementSection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section pp-section--soft" id="syarat">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Persyaratan"
          title="Syarat Pendaftaran"
          subtitle="Siapkan berkas berikut sebelum melakukan pendaftaran online."
        />

        <div className="pp-requirement-card pp-card pp-reveal">
          <ul className="pp-requirement-list">
            {content.requirements.map((item) => (
              <li key={item}>
                <CheckCircle2 size={20} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
