import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login, saveSession, getRedirectPathForRole } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import AppLogo from '@app/shared/components/AppLogo';
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('Murid & Calon Murid');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      const msg =
        searchParams.get('message') ||
        'Sesi Anda telah berakhir. Silakan login kembali.';
      Swal.fire({ icon: 'warning', title: 'Sesi Berakhir', text: decodeURIComponent(msg) });
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ login: username.trim(), password });
      const { user, profile, token, permissions, menus, redirect_path } = result;

      const allowedRolesForAdmin = ['admin', 'superadmin'];
      const allowedRolesForPegawai = ['pegawai', 'guru', 'kepsek', 'staff'];
      const allowedRolesForMurid = ['siswa', 'calon_siswa'];

      let isRoleValid = false;
      if (roleType === 'Administrator' && allowedRolesForAdmin.includes(user.role)) {
        isRoleValid = true;
      } else if (roleType === 'Pegawai' && allowedRolesForPegawai.includes(user.role)) {
        isRoleValid = true;
      } else if (roleType === 'Murid & Calon Murid' && allowedRolesForMurid.includes(user.role)) {
        isRoleValid = true;
      }

      if (!isRoleValid) {
        throw { response: { data: { message: `Akses ditolak: Akun Anda tidak memiliki hak akses sebagai ${roleType}.` } } };
      }

      saveSession({ user, profile, token, permissions, menus, redirect_path });

      const displayName = getDisplayName(profile, user.role, user.name ?? user.username);

      const redirectParam = searchParams.get('redirect');
      let target = redirectParam || redirect_path || getRedirectPathForRole(user.role);
      if (user.role === 'calon_siswa' && !redirectParam) {
        target = '/calon-murid/dashboard';
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Login',
        text: `Selamat datang kembali, ${displayName}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(target), 1500);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: err.response?.data?.message || 'Username, NIP, NISN, Email, atau Password salah!',
      });
    } finally {
      setLoading(false);
    }
  };

  const getLoginLabel = () => {
    if (roleType === 'Administrator') return 'Username';
    if (roleType === 'Pegawai') return 'NIP / Email';
    return 'NISN / Email';
  };

  const getLoginPlaceholder = () => {
    if (roleType === 'Administrator') return 'Masukkan Username';
    if (roleType === 'Pegawai') return 'Masukkan NIP atau email';
    return 'Masukkan NISN atau email';
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-content">
          <AppLogo size="lg" className="login-visual-logo" />
          <h1>Sistem Informasi Akademik</h1>
          <p>
            Kelola data akademik dengan mudah, cepat, dan transparan dalam satu platform
            terintegrasi.
          </p>
          <div className="stats-grid">
            <div className="stat-card glass">
              <span className="stat-value">1k+</span>
              <span className="stat-label">Siswa</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-value">50+</span>
              <span className="stat-label">Guru</span>
            </div>
          </div>
        </div>
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      <div className="login-form-side">
        <div className="form-card animate-fade-in">
          <header>
            <AppLogo size="lg" className="login-form-logo" />
            <h2>Selamat Datang</h2>
            <p>Silakan pilih akses dan masuk ke akun Anda</p>
          </header>

          <div className="input-group" style={{ marginBottom: '1.5rem', position: 'relative' }} ref={dropdownRef}>
            <label>Pilih Akses</label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: isDropdownOpen ? '1px solid #059669' : '1px solid #e2e8f0',
                backgroundColor: isDropdownOpen ? '#ffffff' : '#f8fafb',
                color: '#0f172a',
                cursor: 'pointer',
                boxShadow: isDropdownOpen ? '0 0 0 4px rgba(5, 150, 105, 0.12)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.9rem',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontWeight: '500' }}>{roleType}</span>
              <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', color: '#6b7280' }} />
            </div>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                zIndex: 50,
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                {['Administrator', 'Pegawai', 'Murid & Calon Murid'].map((role) => (
                  <div
                    key={role}
                    onClick={() => { setRoleType(role); setIsDropdownOpen(false); }}
                    style={{
                      padding: '0.875rem 1rem',
                      cursor: 'pointer',
                      backgroundColor: roleType === role ? '#ecfdf5' : 'transparent',
                      color: roleType === role ? '#059669' : '#4b5563',
                      fontWeight: roleType === role ? '600' : '400',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderLeft: roleType === role ? '3px solid #059669' : '3px solid transparent',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => {
                      if (roleType !== role) e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      if (roleType !== role) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {role}
                    {roleType === role && <Check size={18} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">{getLoginLabel()}</label>
              <input
                type="text"
                id="username"
                placeholder={getLoginPlaceholder()}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Memproses...' : 'Login Sistem'}
            </button>
          </form>

          <footer>
            <p>
              Belum punya akun? <Link to="/register-calon-murid">Registrasi Akun</Link>
            </p>
            <p style={{ marginTop: '10px' }}>
              <Link to="/home">Kembali ke Profil Sekolah</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
