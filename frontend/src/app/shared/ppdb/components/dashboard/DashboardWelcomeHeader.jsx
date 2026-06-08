import { GraduationCap, Sparkles } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Selamat Malam';
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 19) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function DashboardWelcomeHeader({ name }) {
  const displayName = name || 'Calon Siswa';
  const greeting = getGreeting();

  return (
    <div className="cm-welcome-hero">
      <div className="cm-welcome-hero__left">
        <div className="cm-welcome-hero__avatar">
          <GraduationCap size={32} strokeWidth={1.5} />
        </div>
        <div className="cm-welcome-hero__text">
          <div className="cm-welcome-hero__eyebrow">
            <Sparkles size={13} />
            Portal PPDB Calon Siswa
          </div>
          <h1 className="cm-welcome-hero__title">
            {greeting}, <span>{displayName}</span>!
          </h1>
          <p className="cm-welcome-hero__subtitle">
            Pantau progres PPDB, lengkapi formulir, dan unggah berkas dari satu tempat.
          </p>
        </div>
      </div>
      <div className="cm-welcome-hero__badge-wrap">
        <div className="cm-welcome-hero__badge">
          <span>Tahun Pelajaran</span>
          <strong>2026/2027</strong>
        </div>
      </div>
    </div>
  );
}
