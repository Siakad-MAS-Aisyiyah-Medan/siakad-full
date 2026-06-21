import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function RegistrationFlowSection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section" id="alur">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Panduan"
          title="Alur Pendaftaran Online"
          subtitle="Ikuti langkah berikut untuk menyelesaikan pendaftaran PPDB secara online."
        />

        <ol className="pp-flow pp-reveal">
          {content.flow.map((step, index) => (
            <li key={step} className="pp-flow__step">
              <span className="pp-flow__number">{index + 1}</span>
              <span className="pp-flow__label">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
