import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { getPublicNewsDetail } from '@app/shared/services/publicNews.service';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';

export default function PublicNewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getPublicNewsDetail(id);
        setNews(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar activeSection="berita" onScrollToSection={() => navigate('/home')} />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate('/pengumuman')}
          className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-4 text-xl text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Pengumuman
        </button>

        <section className="mt-8 rounded-[18px] border border-slate-300 bg-white px-12 py-10">
          {loading ? (
            <p className="py-16 text-center text-xl text-slate-500">Memuat isi pengumuman...</p>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-6xl font-semibold text-slate-900">{news?.judul || 'Judul Pengumuman'}</h1>
                <div className="mt-6 inline-flex items-center gap-3 text-2xl text-slate-500">
                  <CalendarDays className="h-6 w-6" />
                  {news?.tanggal_publikasi || '00 Mei 2024'}
                </div>
              </div>
              <div className="mt-8 border-t border-slate-300 pt-10">
                {news?.isi ? (
                  <div className="whitespace-pre-wrap text-2xl leading-[2.2] text-slate-700">{news.isi}</div>
                ) : (
                  <div className="space-y-5">
                    <div className="h-2 rounded-full bg-slate-300" />
                    <div className="h-2 rounded-full bg-slate-300" />
                    <div className="h-2 w-5/6 rounded-full bg-slate-300" />
                    <div className="h-2 rounded-full bg-slate-300" />
                    <div className="h-2 rounded-full bg-slate-300" />
                    <div className="h-2 w-4/5 rounded-full bg-slate-300" />
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
      <LandingFooter onScrollToSection={() => navigate('/home')} />
    </div>
  );
}
