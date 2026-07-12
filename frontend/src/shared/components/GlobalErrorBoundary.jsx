import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed');
      
    return { hasError: true, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Global Error Caught:', error, errorInfo);
    
    // Auto-reload once if it's a chunk error
    if (this.state.isChunkError) {
      const reloaded = sessionStorage.getItem('chunk_error_reloaded');
      if (!reloaded) {
        sessionStorage.setItem('chunk_error_reloaded', 'true');
        window.location.reload(true);
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('chunk_error_reloaded');
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h2 style={{ color: '#0f172a', marginBottom: '0.5rem', fontWeight: 700 }}>Versi Baru Tersedia</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
              Sistem telah diperbarui ke versi terbaru. Kami sedang memuat ulang halaman untuk menyinkronkan data Anda.
            </p>
            <button onClick={this.handleReload} style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Muat Ulang Sekarang
            </button>
          </div>
        );
      }

      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#dc2626', marginBottom: '0.5rem', fontWeight: 700 }}>Terjadi Kesalahan Sistem</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Maaf, halaman ini mengalami kesalahan teknis yang tidak terduga. Silakan muat ulang halaman atau kembali ke beranda.
          </p>
          <button onClick={this.handleReload} style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
