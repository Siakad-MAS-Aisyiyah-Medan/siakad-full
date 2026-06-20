import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { FOOTER_LINKS } from '../data/landingData';

export default function LandingFooter({ onScrollToSection = () => {} }) {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer__grid">
          <div>
            <div className="lp-footer__logo">
              <AppLogo size={48} />
              <div>
                <strong>MAS Aisyiyah Medan</strong>
                <p>Sistem Informasi Akademik</p>
              </div>
            </div>
  
            <div className="lp-footer__social">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Youtube"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4>Menu</h4>
            <ul className="lp-footer__links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.sectionId}>
                  <button type="button" onClick={() => onScrollToSection(link.sectionId)}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Kontak</h4>
            <ul className="lp-footer__contact">
              <li><Phone size={16} /> (061) 1234567</li>
              <li><Mail size={16} /> info@masaisyiyahmedan.sch.id</li>
              <li><MapPin size={16} /> Jl. Demak No. 3, Medan</li>
            </ul>
          </div>
        </div>

        <div className="lp-footer__bottom">
          © 2026 MAS Aisyiyah Medan. Semua Hak Dilindungi.
        </div>
      </div>
    </footer>
  );
}
