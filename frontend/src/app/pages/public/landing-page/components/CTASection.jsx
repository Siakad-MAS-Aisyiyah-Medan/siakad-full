import { ArrowRight } from 'lucide-react';

export default function CTASection({ onPendaftaranClick }) {
  return (
    <section className="lp-section lp-cta-section">
      <div className="lp-container lp-reveal">
        <div className="lp-cta-card">
          <div className="lp-cta-card__content">
            <h2>Bergabunglah Bersama MAS Aisyiyah Medan</h2>
            <p>
              Daftarkan putra-putri Anda sekarang dan wujudkan masa depan cerah dengan pendidikan
              islami yang unggul dan berprestasi.
            </p>
          </div>
          <button
            type="button"
            className="lp-btn lp-btn--white lp-btn--lg"
            onClick={onPendaftaranClick}
          >
            Informasi Pendaftaran
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
