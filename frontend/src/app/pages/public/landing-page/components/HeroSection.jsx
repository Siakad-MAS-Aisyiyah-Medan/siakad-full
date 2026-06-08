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
          <span className="lp-badge">
            <Sparkles size={14} aria-hidden="true" />
            Website Resmi
          </span>
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
            <button
              type="button"
              className="lp-btn lp-btn--outline lp-btn--lg"
              onClick={onLearnMore}
            >
              Pelajari Sekolah
            </button>
          </div>
          <ul className="lp-hero__highlights">
            <li>Akreditasi Unggul</li>
            <li>Kurikulum Nasional + Islam</li>
            <li>Fasilitas Lengkap</li>
          </ul>
        </div>

        <div className="lp-hero__visual lp-reveal lp-reveal--delay">
          <div className="lp-hero-card">
            <div className="lp-hero-card__inner">
              <AppLogo size={120} className="lp-hero-card__logo" />
              <h2>{SCHOOL_NAME}</h2>
              <p>Madrasah Aliyah Aisyiyah Medan</p>
              <div className="lp-hero-card__tags">
                <span>Islami</span>
                <span>Unggul</span>
                <span>Berprestasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
