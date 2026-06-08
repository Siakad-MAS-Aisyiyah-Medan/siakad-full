import { Globe, Mail, MapPin, Phone, Share2, Video } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { FOOTER_LINKS, SCHOOL_NAME } from '../data/landingData';

export default function LandingFooter({ onScrollToSection }) {
  return (
    <footer className="lp-footer">
      <div className="lp-container lp-footer__grid">
        <div className="lp-footer__brand">
          <div className="lp-footer__logo">
            <AppLogo size="md" />
            <div>
              <strong>{SCHOOL_NAME}</strong>
              <p>Madrasah Aliyah Aisyiyah Medan</p>
            </div>
          </div>
          <p className="lp-footer__desc">
            Pendidikan Islam bermutu untuk generasi unggul, berakhlak, dan siap berkontribusi
            bagi bangsa.
          </p>
          <div className="lp-footer__social">
            <a href="#website" aria-label="Website sekolah">
              <Globe size={18} />
            </a>
            <a href="#media" aria-label="Media sosial">
              <Share2 size={18} />
            </a>
            <a href="#video" aria-label="Kanal video">
              <Video size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4>Tautan Cepat</h4>
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
            <li>
              <MapPin size={16} aria-hidden="true" />
              Jl. Pendidikan No. 12, Medan, Sumatera Utara
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              (061) 123-4567
            </li>
            <li>
              <Mail size={16} aria-hidden="true" />
              info@masaisyiyahmedan.sch.id
            </li>
          </ul>
        </div>
      </div>

      <div className="lp-footer__bottom">
        <div className="lp-container">
          <p>&copy; {new Date().getFullYear()} {SCHOOL_NAME}. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
