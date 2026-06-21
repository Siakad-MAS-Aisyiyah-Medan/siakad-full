import { Mail, MapPin, Phone } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';
import { FOOTER_LINKS } from '../data/landingData';
import { resolveStorageUrl } from '@app/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';
const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Youtube = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);
export default function LandingFooter({ profil, onScrollToSection = () => {} }) {
  const logoUrl = profil?.hero_image ? resolveStorageUrl(profil.hero_image, apiConfig) : undefined;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer__grid">
          <div>
            <div className="lp-footer__logo">
              <AppLogo size={48} srcUrl={logoUrl} />
              <div>
                <strong>{profil?.nama_sekolah || 'MAS Aisyiyah Medan'}</strong>
                <p>Sistem Informasi Akademik</p>
              </div>
            </div>
  
            <div className="lp-footer__social">
              {profil?.facebook && <a href={profil.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>}
              {profil?.instagram && <a href={profil.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
              {profil?.youtube && <a href={profil.youtube} target="_blank" rel="noreferrer" aria-label="Youtube"><Youtube size={18} /></a>}
              {(!profil?.facebook && !profil?.instagram && !profil?.youtube) && (
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Belum ada media sosial</span>
              )}
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
              <li><Phone size={16} /> {profil?.no_hp || '(061) 1234567'}</li>
              <li><Mail size={16} /> {profil?.email || 'info@masaisyiyahmedan.sch.id'}</li>
              <li><MapPin size={16} /> {profil?.alamat || 'Jl. Demak No. 3, Medan'}</li>
            </ul>
          </div>
        </div>

        <div className="lp-footer__bottom">
          © {currentYear} {profil?.nama_sekolah || 'MAS Aisyiyah Medan'}. Semua Hak Dilindungi.
        </div>
      </div>
    </footer>
  );
}
