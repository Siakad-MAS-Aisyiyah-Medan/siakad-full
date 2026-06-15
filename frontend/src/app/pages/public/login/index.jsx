import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login, saveSession, getRedirectPathForRole } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import AppLogo from '@app/shared/components/AppLogo';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('Murid & Calon Murid');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      saveSession({ user, profile, token, permissions, menus, redirect_path });

      const displayName = getDisplayName(profile, user.role, user.username);

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
              <span className="stat-value">15k+</span>
              <span className="stat-label">Mahasiswa</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-value">450+</span>
              <span className="stat-label">Dosen</span>
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

          <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {['Administrator', 'Pegawai', 'Murid & Calon Murid'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleType(role)}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: roleType === role ? '2px solid var(--primary)' : '2px solid transparent',
                  color: roleType === role ? 'var(--primary)' : '#6b7280',
                  fontWeight: roleType === role ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
              >
                {role}
              </button>
            ))}
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
