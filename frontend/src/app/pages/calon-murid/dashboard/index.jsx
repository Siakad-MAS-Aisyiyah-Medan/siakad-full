import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import DashboardWelcomeHeader from '@app/shared/ppdb/components/dashboard/DashboardWelcomeHeader';
import RegistrationStatusCard from '@app/shared/ppdb/components/dashboard/RegistrationStatusCard';
import DashboardPrimaryAction from '@app/shared/ppdb/components/dashboard/DashboardPrimaryAction';
import PpdbTimeline from '@app/shared/ppdb/components/dashboard/PpdbTimeline';
import ImportantInfoPanel from '@app/shared/ppdb/components/dashboard/ImportantInfoPanel';
import { resolveDashboardState } from '@app/shared/ppdb/utils/dashboardState';
import { mapPpdbInfoToPanel } from '@app/shared/ppdb/utils/formatPpdbInfo';
import { fetchMyRegistration, fetchPpdbInfo } from "@app/shared/services/ppdb.service";
import { startOrResumePpdb } from '@app/shared/ppdb/utils/startOrResumePpdb';
import { getStoredUser } from '@app/shared/services/auth.service';
import OnboardingTutorial from '@app/shared/ppdb/components/dashboard/OnboardingTutorial';

export default function DashboardCalonMurid() {
  const navigate = useNavigate();
  const [reg, setReg] = useState(null);
  const [ppdbInfo, setPpdbInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const user = getStoredUser();
  const name = user?.name || user?.username || 'Calon Siswa';

  useEffect(() => {
    Promise.all([
      fetchMyRegistration().catch(() => ({ has_registration: false, pendaftaran: null })),
      fetchPpdbInfo().catch(() => null),
    ])
      .then(([regData, info]) => {
        setReg(regData);
        setPpdbInfo(info);
      })
      .finally(() => setLoading(false));
  }, []);

  const dashboardState = useMemo(() => resolveDashboardState(reg), [reg]);
  const p = dashboardState.pendaftaran;
  const timelineActiveIndex = dashboardState.timelineIndex ?? 0;

  const handleStart = async () => {
    setStarting(true);
    try {
      const result = await startOrResumePpdb();
      if (!result.ok) {
        alert(result.error);
        return;
      }
      navigate(result.path);
    } finally {
      setStarting(false);
    }
  };

  const infoPanelData = mapPpdbInfoToPanel(ppdbInfo);

  return (
    <CalonMuridLayout>
      {loading ? (
        <div className="calon-murid-loading animate-stagger-1">
          <span className="calon-murid-spinner calon-murid-spinner--lg" />
          <p>Memuat dashboard...</p>
        </div>
      ) : (
        <>
          <OnboardingTutorial name={name} />
          <DashboardWelcomeHeader name={name} />

          <div className="calon-murid-dashboard-grid animate-stagger-1">
            <div className="calon-murid-dashboard-main">
              <div className="animate-stagger-2 hover-lift">
                <RegistrationStatusCard
                  pendaftaran={p}
                  dashboardState={dashboardState}
                />
              </div>

              <div className="animate-stagger-3">
                <DashboardPrimaryAction
                  dashboardState={dashboardState}
                  onStart={handleStart}
                  onNavigate={navigate}
                  starting={starting}
                />
              </div>
              <div className="animate-stagger-4">
                <PpdbTimeline activeIndex={timelineActiveIndex} />
              </div>
            </div>

            <aside className="calon-murid-dashboard-aside animate-stagger-3">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="hover-lift">
                  <ImportantInfoPanel info={infoPanelData} />
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </CalonMuridLayout>
  );
}




