import { MapPin, MessageCircle, Phone, User } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { usePpdbContent } from '../context/PpdbContentContext';

function waLink(phone) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export default function ContactSection() {
  const { content } = usePpdbContent();
  const { contacts, address } = content;

  return (
    <section className="pp-section pp-section--soft" id="kontak">
      <div className="pp-container">
        <SectionHeader
          eyebrow="Hubungi Kami"
          title="Kontak Informasi PPDB"
          subtitle="Tim panitia PPDB siap membantu informasi pendaftaran."
        />

        <div className="pp-contact-grid pp-reveal">
          {contacts.map((contact) => (
            <article key={contact.name} className="pp-card pp-contact-card">
              <div className="pp-contact-card__avatar">
                <User size={28} aria-hidden="true" />
              </div>
              <h3>{contact.name}</h3>
              <ul className="pp-contact-card__phones">
                {contact.phones.map((phone) => (
                  <li key={`${contact.name}-${phone}`}>
                    <Phone size={16} aria-hidden="true" />
                    <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                  </li>
                ))}
              </ul>
              <div className="pp-contact-card__wa">
                {[...new Set(contact.phones)].map((phone) => (
                  <a
                    key={`wa-${contact.name}-${phone}`}
                    href={waLink(phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pp-btn pp-btn--whatsapp pp-btn--sm"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp
                  </a>
                ))}
              </div>
            </article>
          ))}

          <article className="pp-card pp-contact-card pp-contact-card--address">
            <div className="pp-contact-card__avatar">
              <MapPin size={28} aria-hidden="true" />
            </div>
            <h3>Alamat Sekolah</h3>
            <p>{address}</p>
            <p className="pp-contact-card__note">{content.schoolName}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
