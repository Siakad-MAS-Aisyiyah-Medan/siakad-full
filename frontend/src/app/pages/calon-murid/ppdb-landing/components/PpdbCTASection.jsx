import { Link } from 'react-router-dom';
import DaftarSekarangButton from '@app/shared/ppdb/components/DaftarSekarangButton';

export default function PpdbCTASection() {
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

          </div>
        </div>
      </div>
    </section>
  );
}

