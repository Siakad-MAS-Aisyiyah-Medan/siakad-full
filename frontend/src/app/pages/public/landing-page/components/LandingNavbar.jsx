import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import DaftarSekarangButton from '@app/shared/ppdb/components/DaftarSekarangButton';
import { NAV_ITEMS } from '../data/landingData';

export default function LandingNavbar({
  activeSection,
  menuOpen,
  scrolled,
  onToggleMenu,
  onScrollToSection,
  onCloseMenu,
}) {
  return (
    <>
      <header
        className={`lp-navbar ${scrolled ? 'lp-navbar--scrolled' : ''}`}
        role="banner"
      >
        <div className="lp-container lp-navbar__inner">
          <Link to="/home" className="lp-navbar__brand" aria-label="Beranda">
            <AppLogo size="sm" variant="navbar" />
            <div className="lp-navbar__brand-text">
              <span className="lp-navbar__brand-title">Madrasah Aliyah</span>
              <span className="lp-navbar__brand-sub">Aisyiyah Medan</span>
            </div>
          </Link>

          <nav className="lp-navbar__menu" aria-label="Navigasi utama">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`lp-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
                onClick={() => onScrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="lp-navbar__actions">
            <Link to="/login" className="lp-btn lp-btn--outline" style={{ marginRight: '8px' }}>
              Login Staff
            </Link>

            <DaftarSekarangButton
              className="lp-btn lp-btn--primary"
              showIcon={false}
            />
            <button
              type="button"
              className="lp-navbar__toggle"
              onClick={onToggleMenu}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`lp-mobile-drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="lp-mobile-drawer__nav" aria-label="Navigasi mobile">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`lp-mobile-link ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={() => onScrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="lp-mobile-drawer__actions">
            <Link to="/login" className="lp-btn lp-btn--outline lp-btn--block" onClick={onCloseMenu}>
              Login Staff
            </Link>

            <DaftarSekarangButton
              className="lp-btn lp-btn--primary lp-btn--block"
              showIcon={false}
              block
              onAfterNavigate={onCloseMenu}
            />
          </div>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="lp-mobile-backdrop"
          aria-label="Tutup menu"
          onClick={onCloseMenu}
        />
      )}
    </>
  );
}

