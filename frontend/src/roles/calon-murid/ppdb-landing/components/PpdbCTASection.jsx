import DaftarSekarangButton from '@/shared/ppdb/components/DaftarSekarangButton';
import { downloadBrosurPpdb } from '@/shared/ppdb/utils/downloadBrosur';

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
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await downloadBrosurPpdb();
                } catch (error) {
                  console.error('Download error:', error);
                  alert('Gagal mengunduh brosur. Silakan coba lagi nanti.');
                }
              }}
              className="pp-btn pp-btn--outline-light pp-btn--lg"
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                background: 'transparent'
              }}
            >
              Unduh Brosur
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

