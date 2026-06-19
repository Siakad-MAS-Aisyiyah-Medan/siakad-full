import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { renderMenuIcon } from '@app/shared/constants/icons';
import AppLogo from '@app/shared/components/AppLogo';
import { ROLE_LABELS } from '@/config/roles.config';
import { logout, getMenuItems } from '@app/shared/services/auth.service';
import { confirmAction, showLoadingAlert, closeAlert } from '@app/shared/hooks/useConfirm';

export default function MainLayout({ children, role, name }) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuItems();

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: 'Apakah Anda Yakin?',
      text: 'Anda akan keluar dari sistem.',
      confirmText: 'Yakin',
      cancelText: 'Batal',
    });

    if (!confirmed) return;

    showLoadingAlert('Memproses...');
    try {
      await logout();
    } finally {
      closeAlert();
      navigate('/login', { replace: true });
    }
  };

  const roleLabel = ROLE_LABELS[role] || role?.replace('_', ' ').toUpperCase();

  const isMenuItemActive = (itemPath) => {
    const pathname = location.pathname;
    if (pathname === itemPath) return true;

    const hasMoreSpecificMatch = menuItems.some((menuItem) => {
      return menuItem.path !== itemPath
        && pathname.startsWith(menuItem.path)
        && menuItem.path.startsWith(itemPath + '/');
    });

    if (hasMoreSpecificMatch) return false;
    return pathname.startsWith(itemPath + '/');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand__logo">
            <AppLogo size={54} variant="sidebar" />
          </div>
          <div className="sidebar-brand__text">
            <strong>MAS Aisyiyah Medan</strong>
            <span>{roleLabel}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={`${item.path}-${index}`}
              to={item.path}
              className={() => `nav-item ${isMenuItemActive(item.path) ? 'active' : ''}`}
            >
              {renderMenuIcon(item.iconKey)} {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <div className="content-header__greeting" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>Halo, {name && name !== 'Pengguna' ? name : roleLabel} 👋</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '0.25rem' }}>Selamat datang di Sistem Informasi Akademik.</p>
          </div>

          <div className="content-header__right">
            <button type="button" className="content-header__bell" aria-label="Notifikasi">
              <Bell size={22} />
            </button>
            <MotionUserInfo name={name} roleLabel={roleLabel} />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function MotionUserInfo({ name, roleLabel }) {
  const displayName = name && name !== 'Pengguna' ? name : roleLabel;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  return (
    <div className="user-info">
      <div className="user-info__avatar">{initial}</div>
      <span className="user-info__name">{displayName}</span>
    </div>
  );
}
