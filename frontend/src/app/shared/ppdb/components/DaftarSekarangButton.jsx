import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { handleDaftarSekarang } from '../utils/handleDaftarSekarang';

export default function DaftarSekarangButton({
  className = 'pp-btn pp-btn--primary pp-btn--lg',
  children = 'Daftar Sekarang',
  showIcon = true,
  block = false,
  onAfterNavigate,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await handleDaftarSekarang();
      if (!result.ok) {
        console.error('DaftarSekarangButton: alur gagal', result);
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.error || 'Terjadi kesalahan. Silakan coba lagi.',
          confirmButtonColor: '#198754',
        });
        return;
      }
      if (result.path) {
        onAfterNavigate?.();
        navigate(result.path);
      }
    } catch (err) {
      console.error('DaftarSekarangButton: unexpected error', err?.response?.data ?? err);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err?.response?.data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi.',
        confirmButtonColor: '#198754',
      });
    } finally {
      setLoading(false);
    }
  };

  const btnClass = [className, block ? 'pp-btn--block' : ''].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={btnClass}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="daftar-sekarang-spin" aria-hidden="true" />
          Memproses...
        </>
      ) : (
        <>
          {children}
          {showIcon ? <ArrowRight size={18} aria-hidden="true" /> : null}
        </>
      )}
    </button>
  );
}
