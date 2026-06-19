import { Sparkles, BookOpen, Users, Award } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { SCHOOL_NAME } from '../data/landingData';

export default function HeroSection({ onPendaftaranClick, onLearnMore }) {
  return (
    <section className="lp-hero" id="home">
      <div className="lp-hero__bg">
        <div className="lp-hero__grid" />
      </div>

      <div className="lp-container lp-hero__grid-layout">
        <div>
          <div className="lp-badge">
            <Sparkles size={14} />
            <span>Penerimaan Murid Baru 2026/2027</span>
          </div>

          <h1 className="lp-hero__title">
            {SCHOOL_NAME}
          </h1>

          <p className="lp-hero__subtitle">
            Membentuk generasi islami yang unggul dalam IPTEK dan berakhlakul karimah
            melalui pendidikan bermutu dan lingkungan yang religius.
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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            padding: '3rem', 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <AppLogo size={320} style={{ filter: 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.15))' }} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
}
