import SectionHeader from './SectionHeader';
import { STATS } from '../data/landingData';

export default function StatsSection() {
  return (
    <section className="lp-section lp-section--stats">
      <div className="lp-container">
        <SectionHeader
          eyebrow="Statistik"
          title="Kepercayaan Orang Tua & Masyarakat"
          subtitle="Data yang mencerminkan komitmen kami dalam pendidikan bermutu."
        />

        <div className="lp-stats-grid lp-reveal">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.id} className="lp-stat-card">
                <div className="lp-stat-card__icon">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <strong className="lp-stat-card__value">{stat.value}</strong>
                <span className="lp-stat-card__label">{stat.label}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
