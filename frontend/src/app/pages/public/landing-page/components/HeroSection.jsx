import { Sparkles } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { SCHOOL_NAME } from '../data/landingData';
import { resolveStorageUrl } from '@app/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';

export default function HeroSection({ profil, onPendaftaranClick }) {
  const logoUrl = profil?.hero_image ? resolveStorageUrl(profil.hero_image, apiConfig) : undefined;
  
  return (
    <section className="lp-hero" id="home">
      <div className="lp-hero__bg"></div>
      <div className="lp-hero__grid" />

      <div className="lp-container lp-hero__grid-layout">
        <div>
          <h1 className="lp-hero__title" style={{ marginTop: '2rem' }}>
            {profil?.nama_sekolah || SCHOOL_NAME}
          </h1>

          <p className="lp-hero__subtitle">
            {profil?.hero_subtitle || 'Membentuk generasi islami yang unggul dalam IPTEK dan berakhlakul karimah melalui pendidikan bermutu dan lingkungan yang religius.'}
          </p>

          <div className="lp-hero__actions">
            <button
              type="button"
              onClick={onPendaftaranClick}
              className="lp-btn lp-btn--primary lp-btn--lg"
            >
              Informasi Pendaftaran
            </button>
          </div>
        </div>

        <div className="lp-hero-logo-presentation">
          <div className="lp-hero-logo-circle">
            <AppLogo size={340} srcUrl={logoUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
