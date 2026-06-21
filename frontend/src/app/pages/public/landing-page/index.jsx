import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingNav } from '@app/pages/public/landing-page/hooks/useLandingNav';
import { useReveal } from '@app/pages/public/landing-page/hooks/useReveal';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import HeroSection from '@app/pages/public/landing-page/components/HeroSection';
import AboutSection from '@app/pages/public/landing-page/components/AboutSection';
import VisionMissionSection from '@app/pages/public/landing-page/components/VisionMissionSection';
import NewsPreview from '@app/pages/public/landing-page/components/NewsPreview';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';
import { getProfilSekolah } from '@app/shared/services/profilSekolah.service';
import '@app/pages/public/landing-page/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const {
    activeSection,
    menuOpen,
    scrolled,
    setMenuOpen,
    scrollToSection,
  } = useLandingNav();

  useReveal();

  const [profil, setProfil] = useState(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await getProfilSekolah();
        if (response?.data) {
          setProfil(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profil sekolah:', error);
      }
    };
    fetchProfil();
  }, []);

  const handlePendaftaranClick = () => {
    navigate('/ppdb/informasi');
  };

  return (
    <div className="landing-page">
      <LandingNavbar
        profil={profil}
        activeSection={activeSection}
        menuOpen={menuOpen}
        scrolled={scrolled}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onScrollToSection={scrollToSection}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <main>
        <HeroSection
          profil={profil}
          onPendaftaranClick={handlePendaftaranClick}
          onLearnMore={() => scrollToSection('profil')}
        />
        <AboutSection profil={profil} />
        <VisionMissionSection profil={profil} />
        <NewsPreview />
      </main>

      <LandingFooter profil={profil} onScrollToSection={scrollToSection} />
    </div>
  );
};

export default LandingPage;

