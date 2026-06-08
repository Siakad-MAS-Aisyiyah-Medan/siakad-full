import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, Megaphone, Tag, ArrowRight } from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PortalPageShell from '@app/shared/ppdb/components/portal/PortalPageShell';
import Button from '@app/shared/ppdb/components/portal/Button';
import EmptyState from '@app/shared/ppdb/components/portal/EmptyState';
import { fetchPpdbInfo } from "@app/shared/services/ppdb.service";

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Penerimaan Peserta Didik Baru 2026/2027',
    category: 'PPDB',
    date: '2026',
    body: 'MAS Aisyiyah Medan membuka pendaftaran peserta didik baru Tahun Pelajaran 2026/2027. Buat akun calon murid, lengkapi formulir dan berkas, lalu pantau status pendaftaran secara online.',
    featured: true,
  },
  {
    id: 2,
    title: 'Alur Pendaftaran Online',
    category: 'Informasi',
    date: '2026',
    body: 'Buat akun → login → lengkapi formulir → upload berkas → submit → pantau status di portal.',
    featured: false,
  },
];

const CATEGORY_COLORS = {
  PPDB: 'cm-badge--green',
  Informasi: 'cm-badge--blue',
  Pengumuman: 'cm-badge--amber',
  Akademik: 'cm-badge--purple',
};

function mapAnnouncements(info) {
  if (!info) return DEFAULT_ANNOUNCEMENTS;
  const list = info.pengumuman_list || info.announcements;
  if (Array.isArray(list) && list.length) {
    return list.map((item, i) => ({
      id: item.id || i,
      title: item.judul || item.title || 'Pengumuman',
      category: item.kategori || item.category || 'PPDB',
      date: item.tanggal || item.published_at || item.date || '—',
      body: item.isi || item.body || item.deskripsi || '',
      featured: i === 0,
    }));
  }
  if (info.deskripsi || info.description) {
    return [
      {
        id: 'main',
        title: info.judul || info.title || 'Informasi PPDB',
        category: 'PPDB',
        date: info.tahun_ajaran || info.academic_year || '2026/2027',
        body: info.deskripsi || info.description,
        featured: true,
      },
      ...DEFAULT_ANNOUNCEMENTS.slice(1),
    ];
  }
  return DEFAULT_ANNOUNCEMENTS;
}

export default function PengumumanCalonMurid() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPpdbInfo()
      .then((info) => setItems(mapAnnouncements(info)))
      .catch(() => setItems(DEFAULT_ANNOUNCEMENTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CalonMuridLayout>
      <PortalPageShell>
        {/* Page Header */}
        <div className="cm-page-header cm-page-header--pengumuman">
          <div className="cm-page-header__icon">
            <Megaphone size={28} strokeWidth={1.5} />
          </div>
          <div className="cm-page-header__content">
            <h1 className="cm-page-header__title">Pengumuman</h1>
            <p className="cm-page-header__subtitle">
              Informasi resmi terbaru dari panitia PPDB.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p>Memuat pengumuman...</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum ada pengumuman"
            description="Pengumuman resmi PPDB akan ditampilkan di halaman ini."
            actionLabel="Lihat Informasi PPDB"
            onAction={() => navigate('/ppdb/informasi')}
            icon={Megaphone}
          />
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const categoryColor = CATEGORY_COLORS[item.category] || 'cm-badge--green';
              return (
                <article key={item.id} className={`cm-announce-card${item.featured ? ' cm-announce-card--featured' : ''}`}>
                  <div className="cm-announce-card__header">
                    <div className="cm-announce-card__meta">
                      <span className={`cm-badge ${categoryColor}`}>
                        <Tag size={11} />
                        {item.category}
                      </span>
                      <span className="cm-announce-card__date">
                        <Calendar size={13} />
                        {item.date}
                      </span>
                    </div>
                    {item.featured && (
                      <span className="cm-announce-card__featured-label">Terbaru</span>
                    )}
                  </div>
                  <div className="cm-announce-card__icon-wrap" aria-hidden>
                    <Megaphone size={18} />
                  </div>
                  <h2 className="cm-announce-card__title">{item.title}</h2>
                  <p className="cm-announce-card__body">{item.body}</p>
                </article>
              );
            })}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" onClick={() => navigate('/ppdb/informasi')}>
                Buka Halaman Informasi Lengkap
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </PortalPageShell>
    </CalonMuridLayout>
  );
}
