import { School, Quote } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';

export default function AboutSection() {
  return (
    <section id="profil" className="lp-section lp-section--soft">
      <div className="lp-container">
        <div className="lp-section-header">
          <span className="lp-eyebrow">Tentang Kami</span>
          <h2 className="lp-section-title">Profil Sekolah</h2>
          <p className="lp-section-subtitle">
            MAS Aisyiyah Medan berkomitmen untuk memberikan pendidikan berkualitas
            berlandaskan nilai-nilai Islam dan berorientasi pada pengembangan potensi
            peserta didik secara menyeluruh.
          </p>
        </div>

        <div className="lp-about-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          <div className="lp-card lp-sambutan-card">
            <div className="lp-sambutan-card__photo">
              <AppLogo size={80} />
              <span>Kepala Sekolah</span>
            </div>
            <div>
              <h3>Kata Sambutan Kepala Sekolah</h3>
              <blockquote>
                Dengan semangat Islam dan kecintaan terhadap ilmu pengetahuan, kami terus berupaya
                menciptakan lingkungan belajar yang kondusif dan menyenangkan bagi seluruh peserta didik.
                Bersama-sama kita wujudkan generasi unggul yang berakhlak mulia.
              </blockquote>
              <cite>Kepala MAS Aisyiyah Medan</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
