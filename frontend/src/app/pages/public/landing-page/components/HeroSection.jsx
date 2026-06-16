import { ArrowRight, Sparkles } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { SCHOOL_NAME } from '../data/landingData';

export default function HeroSection({ onPendaftaranClick, onLearnMore }) {
  return (
    <section id="home" className="lp-hero">
      <div className="lp-hero__bg" aria-hidden="true">
        <div className="lp-hero__grid" />
      </div>

      <div className="lp-container lp-hero__grid-layout">
        <div className="lp-hero__content lp-reveal">

          <h1 className="lp-hero__title">{SCHOOL_NAME}</h1>
          <p className="lp-hero__subtitle">
            Membentuk generasi islami yang unggul dalam IPTEK dan berakhlakul karimah
            melalui pendidikan bermutu dan lingkungan yang religius.
          </p>
          <div className="lp-hero__actions">
            <button
              type="button"
              className="lp-btn lp-btn--primary lp-btn--lg"
              onClick={onPendaftaranClick}
            >
              Informasi Pendaftaran
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

        </div>

        <div className="lp-hero__visual lp-reveal lp-reveal--delay">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <AppLogo size={320} style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))', opacity: 0.9 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
