import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function OnboardingTutorial({ name }) {
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('ppdbTutorialSeen');
    
    if (!hasSeenTutorial) {
      // Small delay to let the dashboard render
      const timer = setTimeout(() => {
        Swal.fire({
          title: `<div class="tutorial-title">Halo ${name || 'Calon Murid'}! 👋</div>`,
          html: `
            <div class="tutorial-mascot">🚀</div>
            <p class="tutorial-text">
              Selamat datang di Portal Pendaftaran MAS Aisyiyah. 
              Ini adalah langkah pertama kamu menuju petualangan baru!
            </p>
            <p class="tutorial-text">
              Di halaman ini kamu bisa melihat <strong>Status Pendaftaran</strong>, melengkapi formulir, dan mengunggah berkas-berkas penting. Jangan khawatir, kami akan memandu kamu selangkah demi selangkah!
            </p>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Mulai Petualangan!',
          customClass: {
            popup: 'tutorial-card',
            confirmButton: 'tutorial-btn'
          },
          buttonsStyling: false,
          allowOutsideClick: false,
          backdrop: `rgba(15, 23, 42, 0.7)`
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem('ppdbTutorialSeen', 'true');
          }
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [name]);

  return null; // This component doesn't render any DOM itself
}
