import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import AppLogo from '@app/shared/components/AppLogo';
import {
  login,
  saveSession,
  getRedirectPathForRole,
  getStoredUser,
  isAuthenticated,
} from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import './login-calon.css';

const CALON_DASHBOARD = '/calon-murid/dashboard';

const BRAND_FEATURES = [
  'Login dengan NISN atau email',
  'Akses dashboard calon murid',
  'Kelola formulir PPDB setelah masuk',
];

function resolveTargetPath(user, redirectParam) {
  if (redirectParam) return redirectParam;
  if (user.role === 'calon_siswa') return CALON_DASHBOARD;
  return getRedirectPathForRole(user.role);
}

export default function LoginCalonMurid() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      const msg =
        searchParams.get('message') ||
        'Sesi Anda telah berakhir. Silakan login kembali.';
      Swal.fire({
        icon: 'warning',
        title: 'Sesi Berakhir',
        text: decodeURIComponent(msg),
        confirmButtonColor: '#0f7a5c',
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const user = getStoredUser();
    if (user?.role === 'calon_siswa') {
      navigate(CALON_DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setError('NISN / email wajib diisi.');
      return;
    }
    if (!password) {
      setError('Password wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await login({ login: loginId.trim(), password });
      const { user, profile, token, permissions, menus, redirect_path } = result;

      if (user.role !== 'calon_siswa') {
        setError('Akun ini bukan calon siswa. Gunakan halaman login staff.');
        return;
      }

      saveSession({ user, profile, token, permissions, menus, redirect_path });

      const displayName = getDisplayName(profile, user.role, user.username);
      const target = resolveTargetPath(user, searchParams.get('redirect'));

      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: `Selamat datang, ${displayName}!`,
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(target, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login gagal. Periksa kembali data Anda.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-calon-page">
      <aside className="login-calon-page__brand" aria-label="Portal calon siswa">
        <div className="login-calon-page__brand-bg" aria-hidden="true" />
        <div className="login-calon-page__brand-inner">
          <div className="login-calon-page__logo">
            <AppLogo size="lg" />
          </div>
          <h1>Login Calon Siswa</h1>
          <p>Masuk ke portal PPDB dengan akun yang sudah Anda daftarkan.</p>
          <ul className="login-calon-page__features">
            {BRAND_FEATURES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link to="/home" className="login-calon-page__back-link">
            <ArrowLeft size={18} aria-hidden="true" />
            Kembali ke Profil Sekolah
          </Link>
        </div>
      </aside>

      <section className="login-calon-page__form-area">
        <div className="login-calon-page__card">
          <header className="login-calon-page__card-header">
            <span className="login-calon-page__card-icon" aria-hidden="true">
              <LogIn size={22} />
            </span>
            <div>
              <h2>Masuk ke Akun</h2>
              <p>Gunakan NISN atau email beserta password Anda.</p>
            </div>
          </header>

          {error ? (
            <div className="login-calon-page__alert" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={onSubmit} noValidate>
            <div className="login-calon-page__field">
              <label htmlFor="login">NISN / Email</label>
              <input
                type="text"
                id="login"
                name="login"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Masukkan NISN atau email"
                autoComplete="username"
                required
                disabled={loading}
              />
              <span className="login-calon-page__field-hint">
                Boleh menggunakan NISN atau alamat email terdaftar
              </span>
            </div>

            <div className="login-calon-page__field">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
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

            <button type="submit" className="login-calon-page__submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-calon-page__spinner" aria-hidden="true" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <footer className="login-calon-page__footer">
            <p>
              Belum punya akun? <Link to="/register-calon-murid">Registrasi Akun</Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
