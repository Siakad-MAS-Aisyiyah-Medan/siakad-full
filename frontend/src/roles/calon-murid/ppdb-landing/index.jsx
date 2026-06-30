import { PpdbContentProvider, usePpdbContent } from './context/PpdbContentContext';
import { useReveal } from './hooks/useReveal';
import PpdbNavbar from './components/PpdbNavbar';
import PpdbSyncBanner from './components/PpdbSyncBanner';
import HeroPPDBSection from './components/HeroPPDBSection';
import RegistrationWaveSection from './components/RegistrationWaveSection';
import PromoSection from './components/PromoSection';
import RequirementSection from './components/RequirementSection';
import FacilitySection from './components/FacilitySection';
import ExtracurricularSection from './components/ExtracurricularSection';
import RegistrationFlowSection from './components/RegistrationFlowSection';
import ContactSection from './components/ContactSection';
import PpdbCTASection from './components/PpdbCTASection';
import PpdbFooter from './components/PpdbFooter';
import './ppdb-page.css';

function PpdbLandingContent() {
  const { content, loading } = usePpdbContent();

  useReveal([loading, content.updatedAt, content.fromApi]);

  return (
    <div className="ppdb-page">
      <PpdbNavbar />
      <PpdbSyncBanner />
      <main>
        <HeroPPDBSection />
        <RegistrationWaveSection />
        <PromoSection />
        <RequirementSection />
        <FacilitySection />
        <ExtracurricularSection />
        <RegistrationFlowSection />
        <ContactSection />
        <PpdbCTASection />
      </main>
      <PpdbFooter />
    </div>
  );
}

export default function PpdbLandingPage() {
  return (
    <PpdbContentProvider>
      <PpdbLandingContent />
    </PpdbContentProvider>
  );
}
