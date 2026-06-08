import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStoredUser, getRedirectPathForRole, isAuthenticated } from '@app/shared/services/auth.service';

export default function NotFoundPage() {
  const authed = isAuthenticated();
  const home = authed ? getRedirectPathForRole(getStoredUser()?.role) : '/';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg, #f5f7fa)' }}>
      <div className="glass p-8 text-center" style={{ borderRadius: '16px', maxWidth: 480 }}>
        <FileQuestion size={56} className="mx-auto mb-4 opacity-60" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Halaman Tidak Ditemukan</h1>
        <p className="text-secondary mt-2">URL yang Anda buka tidak terdaftar di sistem SIAKAD.</p>
        <Link to={home} className="btn-primary mt-6 inline-block">
          {authed ? 'Ke Dashboard' : 'Ke Halaman Login'}
        </Link>
      </div>
    </div>
  );
}
