import { MapPin, School, Users } from 'lucide-react';
import SectionHeader from './SectionHeader';

export default function AboutSection() {
  return (
    <section id="profil" className="lp-section lp-section--soft">
      <div className="lp-container">
        <SectionHeader
          eyebrow="Tentang Kami"
          title="Profil Madrasah Aliyah Aisyiyah Medan"
          subtitle="Lembaga pendidikan Islam yang berkomitmen mencetak generasi cerdas, berkarakter, dan siap menghadapi tantangan masa depan."
        />

        <div className="lp-about-grid lp-reveal">
          <article className="lp-card lp-about-card">
            <div className="lp-about-card__icon">
              <School size={28} aria-hidden="true" />
            </div>
            <h3>Identitas Sekolah</h3>
            <p>
              MAS Aisyiyah Medan berdiri sejak 1985 di bawah naungan Aisyiyah, mengintegrasikan
              kurikulum nasional dengan penguatan nilai keislaman, kedisiplinan, dan kepemimpinan.
            </p>
            <div className="lp-about-meta">
              <span>
                <MapPin size={16} aria-hidden="true" />
                Jl. Pendidikan No. 12, Medan
              </span>
            </div>
          </article>

          <article className="lp-card lp-sambutan-card">
            <div className="lp-sambutan-card__photo">
              <Users size={72} strokeWidth={1.25} aria-hidden="true" />
              <span>Kepala Sekolah</span>
            </div>
            <div className="lp-sambutan-card__body">
              <h3>Kata Sambutan</h3>
              <blockquote>
                &ldquo;Assalamu&apos;alaikum Warahmatullahi Wabarakatuh. Selamat datang di MAS
                Aisyiyah Medan. Kami berkomitmen memberikan pendidikan terbaik yang menggabungkan
                kurikulum nasional dengan nilai-nilai keislaman yang kuat.&rdquo;
              </blockquote>
              <cite>Dr. H. Budi Santoso, M.Pd.</cite>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
