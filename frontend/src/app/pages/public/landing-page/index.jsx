import { useNavigate } from 'react-router-dom';
import { useLandingNav } from '@app/pages/public/landing-page/hooks/useLandingNav';
import { useReveal } from '@app/pages/public/landing-page/hooks/useReveal';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import HeroSection from '@app/pages/public/landing-page/components/HeroSection';
import AboutSection from '@app/pages/public/landing-page/components/AboutSection';
import VisionMissionSection from '@app/pages/public/landing-page/components/VisionMissionSection';
import StatsSection from '@app/pages/public/landing-page/components/StatsSection';
import NewsPreview from '@app/pages/public/landing-page/components/NewsPreview';
import ExtracurricularSection from '@app/pages/public/landing-page/components/ExtracurricularSection';
import CTASection from '@app/pages/public/landing-page/components/CTASection';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';
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

  const handlePendaftaranClick = () => {
    navigate('/ppdb/informasi');
  };

  return (
    <div className="landing-page">
      <LandingNavbar
        activeSection={activeSection}
        menuOpen={menuOpen}
        scrolled={scrolled}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onScrollToSection={scrollToSection}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <main>
        <HeroSection
          onPendaftaranClick={handlePendaftaranClick}
          onLearnMore={() => scrollToSection('profil')}
        />
        <AboutSection />
        <VisionMissionSection />
        <StatsSection />
        <NewsPreview />
        <ExtracurricularSection />
        <CTASection onPendaftaranClick={handlePendaftaranClick} />
      </main>

      <LandingFooter onScrollToSection={scrollToSection} />
    </div>
  );
};

export default LandingPage;

