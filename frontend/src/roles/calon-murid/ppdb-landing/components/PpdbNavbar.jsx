import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AppLogo from '@/shared/components/AppLogo';
import DaftarSekarangButton from '@/shared/ppdb/components/DaftarSekarangButton';
import { usePpdbContent } from '../context/PpdbContentContext';

const SECTION_LINKS = [
  { href: '#periode', label: 'Periode' },
  { href: '#syarat', label: 'Syarat' },
  { href: '#alur', label: 'Alur' },
  { href: '#kontak', label: 'Kontak' },
];

export default function PpdbNavbar() {
  const { content } = usePpdbContent();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="pp-navbar" role="banner">
        <div className="pp-container pp-navbar__inner">
          <Link to="/" className="pp-navbar__brand" aria-label="Kembali ke profil sekolah">
            <AppLogo size="sm" variant="navbar" />
            <div className="pp-navbar__brand-text">
              <span className="pp-navbar__brand-title">{content.schoolName}</span>
              <span className="pp-navbar__brand-sub">PPDB Online {content.academicYear}</span>
            </div>
          </Link>

          <nav className="pp-navbar__menu" aria-label="Navigasi PPDB">
            <Link to="/" className="pp-navbar__menu-route">
              Profil Sekolah
            </Link>
            {SECTION_LINKS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pp-navbar__actions">
            <Link to="/login" className="pp-btn pp-btn--outline" style={{ marginRight: '8px' }}>
              Login
            </Link>

            <DaftarSekarangButton
              className="pp-btn pp-btn--primary"
              showIcon={false}
            />
            <button
              type="button"
              className="pp-navbar__toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`pp-mobile-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="pp-mobile-drawer__nav" aria-label="Navigasi mobile">
          <Link to="/" className="pp-mobile-drawer__route" onClick={closeMenu}>
            Profil Sekolah
          </Link>
          {SECTION_LINKS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <div className="pp-mobile-drawer__actions">
            <Link
              to="/login"
              className="pp-btn pp-btn--outline pp-btn--block"
              onClick={closeMenu}
            >
              Login
            </Link>

            <DaftarSekarangButton
              className="pp-btn pp-btn--primary pp-btn--block"
              showIcon={false}
              block
              onAfterNavigate={closeMenu}
            />
          </div>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="pp-mobile-backdrop"
          aria-label="Tutup menu"
          onClick={closeMenu}
        />
      )}
    </>
  );
}

