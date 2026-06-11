import { useNavigate, NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { renderMenuIcon } from '@app/shared/constants/icons';
import AppLogo from '@app/shared/components/AppLogo';
import { ROLE_LABELS } from '@/config/roles.config';
import { logout, getMenuItems } from '@app/shared/services/auth.service';

export default function MainLayout({ children, role, name }) {
  const navigate = useNavigate();
  const menuItems = getMenuItems();

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Anda akan keluar dari sistem!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Memproses...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await logout();
        Swal.close();
        navigate('/login', { replace: true });
      }
    });
  };

  const roleLabel = ROLE_LABELS[role] || role?.replace('_', ' ').toUpperCase();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <AppLogo size="md" variant="sidebar" />
          <span>SIAKAD</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={`${item.path}-${index}`}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
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
        <header className="content-header flex justify-between items-center px-8 py-4 bg-white border-b border-slate-100">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">🏫 Sistem Informasi Akademik</h1>
            <span className="text-sm text-slate-500 font-medium ml-7">MAS Aisyiyah Medan</span>
          </div>
          <MotionUserInfo name={name} roleLabel={roleLabel} />
        </header>
        {children}
      </main>
    </div>
  );
}

function MotionUserInfo({ name, roleLabel }) {
  return (
    <div className="user-info flex flex-col items-end text-right">
      <span className="font-bold text-slate-800 text-sm">
        {name && name !== 'Pengguna' ? name : roleLabel}
      </span>
      <span className="text-xs text-slate-500 mt-0.5">Terakhir login hari ini</span>
    </div>
  );
}
