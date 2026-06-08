import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import Swal from 'sweetalert2';
import AppLogo from '@app/shared/components/AppLogo';
import { renderMenuIcon } from '@app/shared/constants/icons';
import { logout } from '@app/shared/services/auth.service';
import { getJsonItem } from '@app/shared/utils/storage';
import { ROLE_LABELS } from '@/config/roles.config';
import { CALON_MURID_NAV } from '../config/calonMuridNav';

export default function CalonMuridLayout({ children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getJsonItem('user');
  const displayName = user?.name || user?.username || 'Calon Siswa';
  const accountStatus = user?.status_akun || (user?.status_aktif !== false ? 'aktif' : 'nonaktif');

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari akun?',
      text: 'Anda akan keluar dari portal PPDB.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <div className={`dashboard-layout calon-murid-layout${mobileOpen ? ' sidebar-open' : ''}`}>
      {mobileOpen && (
        <button
          type="button"
          className="calon-murid-overlay"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="sidebar-brand">
          <AppLogo size="md" variant="sidebar" />
          <span>SIAKAD</span>
        </div>
        <p className="calon-murid-sidebar-sub">Portal PPDB</p>

        <nav className="sidebar-nav">
          {CALON_MURID_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {renderMenuIcon(item.iconKey, 20)}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          Keluar
        </button>
      </aside>

      <main className="dashboard-content bg-slate-50 min-h-screen">
        <header className="content-header sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm transition-all">
          <div className="content-header-left">
            <button
              type="button"
              className="calon-murid-menu-btn"
              aria-label="Buka menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1>Sistem Informasi Akademik</h1>
          </div>
          <div className="user-info">
            <span>
              Halo, <strong>{displayName}</strong>
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 ml-3">
              {ROLE_LABELS.calon_siswa || 'Calon Siswa'}
            </span>
            {accountStatus !== 'aktif' && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 ml-2">
                Nonaktif
              </span>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
