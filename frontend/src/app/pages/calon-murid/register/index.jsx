import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import AppLogo from '@app/shared/components/AppLogo';
import { registerCalonSiswa } from '@app/shared/services/auth.service';
import './register-calon.css';

const LOGIN_CALON_MURID = '/login-calon-murid';

const FIELDS = [
  {
    id: 'name',
    label: 'Nama Lengkap',
    type: 'text',
    placeholder: 'Masukkan nama lengkap',
    autoComplete: 'name',
    hint: null,
  },
  {
    id: 'username',
    label: 'NISN',
    type: 'text',
    placeholder: 'Masukkan NISN',
    autoComplete: 'username',
    hint: 'Digunakan saat login (10 digit angka)',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'nama@email.com',
    autoComplete: 'email',
    hint: null,
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Minimal 8 karakter',
    autoComplete: 'new-password',
    hint: 'Minimal 8 karakter',
  },
  {
    id: 'password_confirmation',
    label: 'Konfirmasi Password',
    type: 'password',
    placeholder: 'Ulangi password',
    autoComplete: 'new-password',
    hint: null,
  },
];

const INITIAL_FORM = {
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const BRAND_STEPS = [
  'Buat akun login calon siswa',
  'Login ke portal PPDB',
  'Akses dashboard calon murid',
  'Formulir PPDB (setelah login, opsional)',
];

function buildPayload(form) {
  return {
    name: form.name.trim(),
    username: form.username.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    password_confirmation: form.password_confirmation,
  };
}

function mapServerErrors(err) {
  const errors = err.response?.data?.errors;
  if (!errors || typeof errors !== 'object') {
    return { form: err.response?.data?.message || 'Gagal membuat akun. Periksa kembali data Anda.', fields: {} };
  }
  const fields = {};
  Object.entries(errors).forEach(([key, messages]) => {
    const msg = Array.isArray(messages) ? messages[0] : messages;
    if (FIELDS.some((f) => f.id === key)) {
      fields[key] = msg;
    }
  });
  const form =
    fields.name || fields.username || fields.email || fields.password
      ? ''
      : err.response?.data?.message || 'Periksa data yang Anda masukkan.';
  return { form, fields };
}

export default function RegisterCalonMurid() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setFieldErrors((prev) => ({ ...prev, [id]: '' }));
    if (formError) setFormError('');
  };

  const validateClient = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Nama lengkap wajib diisi.';
    if (!form.username.trim()) errors.username = 'NISN wajib diisi.';
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Format email tidak valid.';
    }
    if (!form.password) {
      errors.password = 'Password wajib diisi.';
    } else if (form.password.length < 8) {
      errors.password = 'Password minimal 8 karakter.';
    }
    if (!form.password_confirmation) {
      errors.password_confirmation = 'Konfirmasi password wajib diisi.';
    } else if (form.password !== form.password_confirmation) {
      errors.password_confirmation = 'Konfirmasi password tidak cocok.';
    }
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError('Lengkapi semua field dengan benar.');
      return;
    }

    setLoading(true);
    setFormError('');
    setFieldErrors({});
    try {
      await registerCalonSiswa(buildPayload(form));
      await Swal.fire({
        icon: 'success',
        title: 'Akun berhasil didaftarkan',
        text: 'Silakan login untuk masuk ke portal calon siswa.',
        confirmButtonText: 'Ke Halaman Login',
        confirmButtonColor: '#0f7a5c',
      });
      navigate(LOGIN_CALON_MURID);
    } catch (err) {
      const { form: msg, fields } = mapServerErrors(err);
      setFormError(msg);
      setFieldErrors(fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <aside className="register-page__brand" aria-label="Informasi registrasi akun">
        <div className="register-page__brand-bg" aria-hidden="true" />
        <div className="register-page__brand-inner">
          <div className="register-page__logo">
            <AppLogo size="lg" />
          </div>
          <h1>Registrasi Akun Calon Siswa</h1>
          <p>
            Halaman ini hanya untuk membuat akun login. Formulir PPDB diisi setelah Anda login ke
            dashboard.
          </p>
          <ol className="register-page__steps">
            {BRAND_STEPS.map((step, i) => (
              <li key={step}>
                <span className="register-page__step-num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <section className="register-page__form-area">
        <div className="register-page__card">
          <header className="register-page__card-header">
            <span className="register-page__card-icon" aria-hidden="true">
              <UserPlus size={22} />
            </span>
            <div>
              <h2>Buat Akun Login</h2>
              <p>
                Isi data berikut untuk mendaftar akun calon siswa. Belum termasuk formulir
                pendaftaran PPDB.
              </p>
            </div>
          </header>

          {formError ? (
            <div className="register-page__alert" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{formError}</span>
            </div>
          ) : null}

          <form onSubmit={onSubmit} noValidate>
            {FIELDS.map((field) => (
              <div
                key={field.id}
                className={`register-page__field${fieldErrors[field.id] ? ' register-page__field--error' : ''}`}
              >
                <label htmlFor={field.id}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={field.type === 'password' && visiblePasswords[field.id] ? 'text' : field.type}
                    id={field.id}
                    name={field.id}
                    value={form[field.id]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    disabled={loading}
                    aria-invalid={fieldErrors[field.id] ? 'true' : undefined}
                    aria-describedby={fieldErrors[field.id] ? `${field.id}-error` : undefined}
                    style={{ paddingRight: field.type === 'password' ? '50px' : '1rem' }}
                  />
                  {field.type === 'password' ? (
                    <button
                      type="button"
                      onClick={() => setVisiblePasswords((prev) => ({ ...prev, [field.id]: !prev[field.id] }))}
                      aria-label="Tampilkan atau sembunyikan password"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0
                      }}
                    >
                      {visiblePasswords[field.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  ) : null}
                </div>
                {field.hint && !fieldErrors[field.id] ? (
                  <span className="register-page__field-hint">{field.hint}</span>
                ) : null}
                {fieldErrors[field.id] ? (
                  <span id={`${field.id}-error`} className="register-page__field-error" role="alert">
                    {fieldErrors[field.id]}
                  </span>
                ) : null}
              </div>
            ))}

            <button type="submit" className="register-page__submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="register-page__spinner" aria-hidden="true" />
                  Membuat Akun...
                </>
              ) : (
                'Daftarkan Akun'
              )}
            </button>
          </form>

          <footer className="register-page__footer">
            <p>
              Sudah punya akun? <Link to={LOGIN_CALON_MURID}>Login Calon Siswa</Link>
            </p>
            <p style={{ marginTop: '10px' }}>
              <Link to="/home">Kembali ke Profil Sekolah</Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
