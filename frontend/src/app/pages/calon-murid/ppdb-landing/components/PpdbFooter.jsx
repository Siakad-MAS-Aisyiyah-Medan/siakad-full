import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { FOOTER_LINKS } from '../data/ppdbDefaults';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function PpdbFooter() {
  const { content } = usePpdbContent();

  return (
    <footer className="pp-footer">
      <div className="pp-container pp-footer__grid">
        <div className="pp-footer__brand">
          <div className="pp-footer__logo">
            <AppLogo size="md" />
            <div>
              <strong>{content.schoolName}</strong>
              <p>PPDB Online {content.academicYear}</p>
            </div>
          </div>
          <p className="pp-footer__desc">
            Penerimaan Peserta Didik Baru Madrasah Aliyah Aisyiyah Medan.
          </p>
        </div>

        <div>
          <h4>Tautan</h4>
          <ul className="pp-footer__links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Kontak</h4>
          <ul className="pp-footer__contact">
            <li>
              <MapPin size={16} aria-hidden="true" />
              {content.address}
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              {content.contacts[0]?.phones[0] ?? '+62 813 9686 5480'}
            </li>
            <li>
              <Mail size={16} aria-hidden="true" />
              info@masaisyiyahmedan.sch.id
            </li>
          </ul>
        </div>
      </div>

      <div className="pp-footer__bottom">
        <div className="pp-container">
          <p>
            &copy; {new Date().getFullYear()} {content.schoolName}. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
