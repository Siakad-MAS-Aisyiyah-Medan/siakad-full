export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="pp-section-header">
      {eyebrow && <span className="pp-eyebrow">{eyebrow}</span>}
      <h2 className="pp-section-title">{title}</h2>
      {subtitle && <p className="pp-section-subtitle">{subtitle}</p>}
    </header>
  );
}
