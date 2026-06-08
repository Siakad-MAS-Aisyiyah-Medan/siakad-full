import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, School, Calendar, User, Share2 } from 'lucide-react';
import AppLogo from '@app/shared/components/AppLogo';

const NewsDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // TODO: fetch by id from API when endpoint tersedia.
    const news = {
        title: 'Juara 1 Lomba MTK Nasional Tingkat SMA/MA',
        date: '12 April 2026',
        author: 'Admin Sekolah',
        image: 'HERO IMAGE TERKAIT',
        content: `
            MADRASAH ALIYAH AISYIYAH MEDAN kembali mengukir prestasi gemilang di tingkat nasional. 
            Siswa kami yang bernama Rizky Pratama berhasil meraih medali emas dalam kompetisi 
            Matematika Nasional yang diselenggarakan oleh Universitas ternama.

            Prestasi ini merupakan hasil kerja keras siswa dan guru pembimbing yang telah 
            berlatih secara intensif selama 3 bulan terakhir. Kepala Sekolah menyatakan rasa 
            bangga yang mendalam atas pencapaian ini. "Ini membuktikan bahwa siswa madrasah 
            mampu bersaing di tingkat nasional dan memberikan kontribusi nyata bagi prestasi sekolah," 
            ujarnya.

            Diharapkan prestasi ini dapat menjadi motivasi bagi seluruh siswa lainnya untuk terus 
            belajar dan berkarya di bidang minat masing-masing. Pihak sekolah akan terus memberikan 
            dukungan penuh bagi pengembangan bakat siswa, baik di bidang akademik maupun non-akademik.
        `
    };

    return (
        <div className="landing-container">
             <header className="landing-navbar glass">
                <div className="nav-logo">
                    <AppLogo size="sm" variant="navbar" />
                    <div>
                        <h1>Madrasah Aliyah</h1>
                        <span>Aisyiyah Medan</span>
                    </div>
                </div>
                <nav className="nav-menu">
                    <Link to="/home">Beranda</Link>
                    <Link to="/home">Profil Sekolah</Link>
                    <Link to="/home">Berita & Prestasi</Link>
                    <Link to="/home">Ekstrakurikuler</Link>
                </nav>
            </header>

            <div className="news-detail-content animate-fade-in">
                <div className="detail-hero glass">
                    <div className="news-meta">
                        <span className="badge-pending">PRESTASI</span>
                        <div className="meta-items">
                            <span><Calendar size={16}/> {news.date}</span>
                            <span><User size={16}/> {news.author}</span>
                        </div>
                    </div>
                    <h1>{news.title}</h1>
                </div>

                <div className="news-article-body">
                    <button onClick={() => navigate('/home')} className="btn-back">
                        <ArrowLeft size={20} /> Kembali ke Berita
                    </button>

                    <div className="article-image glass">
                        {/* Placeholder for Hero Image */}
                        <p>{news.image}</p>
                    </div>

                    <div className="article-text">
                        {news.content.split('\n\n').map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    <div className="article-footer">
                        <button className="btn-share"><Share2 size={18}/> Bagikan Berita</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;

