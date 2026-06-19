import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import DaftarSekarangButton from '@app/shared/ppdb/components/DaftarSekarangButton';
import { NAV_ITEMS } from '../data/landingData';

export default function LandingNavbar({ activeSection, menuOpen, scrolled, onToggleMenu, onScrollToSection, onCloseMenu }) {
  return (
    <>
      <header className={`lp-navbar ${scrolled ? 'lp-navbar--scrolled' : ''}`}>
        <div className="lp-container lp-navbar__inner">
          <Link to="/home" className="lp-navbar__brand">
            <AppLogo size={42} />
            <div className="lp-navbar__brand-text">
              <span className="lp-navbar__brand-title">MAS Aisyiyah Medan</span>
              <span className="lp-navbar__brand-sub">Sistem Informasi Akademik</span>
            </div>
          </Link>

          <nav className="lp-navbar__menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onScrollToSection(item.id)}
                className={`lp-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="lp-navbar__actions">
            <Link to="/login" className="lp-btn lp-btn--outline">
              Login Sistem
            </Link>
            <DaftarSekarangButton className="lp-btn lp-btn--primary" showIcon={false} />
            <button type="button" className="lp-navbar__toggle" onClick={onToggleMenu} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <button type="button" className="lp-mobile-backdrop" onClick={onCloseMenu} aria-label="Tutup menu" />
      )}
      <aside className={`lp-mobile-drawer ${menuOpen ? 'is-open' : ''}`}>
        <nav className="lp-mobile-drawer__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { onScrollToSection(item.id); onCloseMenu(); }}
              className={`lp-mobile-link ${activeSection === item.id ? 'is-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="lp-mobile-drawer__actions">
          <Link to="/login" className="lp-btn lp-btn--outline lp-btn--block" onClick={onCloseMenu}>
            Login Sistem
          </Link>
          <DaftarSekarangButton className="lp-btn lp-btn--primary lp-btn--block" showIcon={false} />
        </div>
      </aside>
    </>
  );
}
