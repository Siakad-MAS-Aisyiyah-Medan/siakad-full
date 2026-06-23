import { Link } from 'react-router-dom';
import DaftarSekarangButton from '@/shared/ppdb/components/DaftarSekarangButton';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function PpdbCTASection() {
  const { content } = usePpdbContent();

  return (
    <section className="pp-section pp-cta-section">
      <div className="pp-container pp-reveal">
        <div className="pp-cta-card">
          <div>
            <h2>Siap Menjadi Bagian dari MAS Aisyiyah Medan?</h2>
            <p>
              Mulai perjalanan pendidikan putra-putri Anda bersama kami. Daftar akun calon murid
              dan lengkapi formulir PPDB online.
            </p>
          </div>
          <div className="pp-cta-card__actions">
            <DaftarSekarangButton className="pp-btn pp-btn--white pp-btn--lg" />
            {content.brosur && (
              <a
                href={content.brosur}
                target="_blank"
                rel="noreferrer"
                className="pp-btn pp-btn--outline-light pp-btn--lg"
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem'
                }}
              >
                Unduh Brosur
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

