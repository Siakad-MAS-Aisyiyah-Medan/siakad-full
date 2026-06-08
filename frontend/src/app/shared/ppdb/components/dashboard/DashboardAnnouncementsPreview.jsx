import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight, Bell } from 'lucide-react';

const DEFAULT_ITEMS = [
  {
    id: 'default-1',
    title: 'PPDB Tahun Pelajaran 2026/2027',
    body: 'Pendaftaran peserta didik baru dibuka. Lengkapi formulir dan unggah berkas sebelum batas waktu.',
    tag: 'PPDB',
  },
];

function pickAnnouncements(ppdbInfo) {
  const list = ppdbInfo?.pengumuman_list || ppdbInfo?.announcements;
  if (!Array.isArray(list) || !list.length) return DEFAULT_ITEMS;
  return list.slice(0, 3).map((item, i) => ({
    id: item.id || i,
    title: item.judul || item.title || 'Pengumuman',
    body: item.isi || item.body || item.deskripsi || '',
    tag: item.kategori || item.category || 'PPDB',
  }));
}

export default function DashboardAnnouncementsPreview({ ppdbInfo }) {
  const items = pickAnnouncements(ppdbInfo);

  return (
    <div className="cm-panel">
      <div className="cm-panel__header">
        <div className="cm-panel__header-icon">
          <Bell size={18} />
        </div>
        <div className="cm-panel__header-text">
          <h2>Pengumuman</h2>
          <p>Informasi resmi terbaru dari panitia PPDB.</p>
        </div>
        <Link to="/calon-murid/pengumuman" className="cm-panel__link-more">
          Lihat semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <ul className="cm-announce-list">
        {items.map((item) => (
          <li key={item.id} className="cm-announce-item">
            <span className="cm-announce-item__icon" aria-hidden="true">
              <Megaphone size={16} />
            </span>
            <div className="cm-announce-item__content">
              <div className="cm-announce-item__tag">{item.tag}</div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
