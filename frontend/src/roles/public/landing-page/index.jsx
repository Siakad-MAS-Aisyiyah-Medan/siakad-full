import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLandingNav } from '@/roles/public/landing-page/hooks/useLandingNav';
import { useReveal } from '@/roles/public/landing-page/hooks/useReveal';
import LandingNavbar from '@/roles/public/landing-page/components/LandingNavbar';
import HeroSection from '@/roles/public/landing-page/components/HeroSection';
import AboutSection from '@/roles/public/landing-page/components/AboutSection';
import VisionMissionSection from '@/roles/public/landing-page/components/VisionMissionSection';
import NewsPreview from '@/roles/public/landing-page/components/NewsPreview';
import LandingFooter from '@/roles/public/landing-page/components/LandingFooter';
import { getProfilSekolah } from '@/shared/services/profilSekolah.service';
import '@/roles/public/landing-page/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeSection,
    menuOpen,
    scrolled,
    setMenuOpen,
    scrollToSection,
  } = useLandingNav();

  useReveal();

  useEffect(() => {
    const returnScrollY = location.state?.returnScrollY;
    const sectionId = location.state?.scrollToSection;

    const animationFrame = window.requestAnimationFrame(() => {
      if (Number.isFinite(returnScrollY)) {
        window.scrollTo({ top: returnScrollY, behavior: 'auto' });
        return;
      }

      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [location.key, location.state]);

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

