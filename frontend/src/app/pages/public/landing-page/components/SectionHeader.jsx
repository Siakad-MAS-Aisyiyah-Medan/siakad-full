export default function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <header className={`lp-section-header lp-section-header--${align}`}>
      {eyebrow && <span className="lp-eyebrow">{eyebrow}</span>}
      <h2 className="lp-section-title">{title}</h2>
      {subtitle && <p className="lp-section-subtitle">{subtitle}</p>}
    </header>
  );
}
