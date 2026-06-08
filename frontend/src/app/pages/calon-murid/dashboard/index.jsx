import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import DashboardWelcomeHeader from '@app/shared/ppdb/components/dashboard/DashboardWelcomeHeader';
import RegistrationStatusCard from '@app/shared/ppdb/components/dashboard/RegistrationStatusCard';
import DashboardPrimaryAction from '@app/shared/ppdb/components/dashboard/DashboardPrimaryAction';
import PpdbProgressStepper from '@app/shared/ppdb/components/dashboard/PpdbProgressStepper';
import PpdbTimeline from '@app/shared/ppdb/components/dashboard/PpdbTimeline';
import QuickActionsGrid from '@app/shared/ppdb/components/dashboard/QuickActionsGrid';
import DashboardAnnouncementsPreview from '@app/shared/ppdb/components/dashboard/DashboardAnnouncementsPreview';
import ImportantInfoPanel from '@app/shared/ppdb/components/dashboard/ImportantInfoPanel';
import { computePpdbProgress } from '@app/shared/ppdb/utils/ppdbProgress';
import { resolveDashboardState } from '@app/shared/ppdb/utils/dashboardState';
import { mapPpdbInfoToPanel } from '@app/shared/ppdb/utils/formatPpdbInfo';
import { fetchMyRegistration, fetchPpdbInfo } from "@app/shared/services/ppdb.service";
import { startOrResumePpdb } from '@app/shared/ppdb/utils/startOrResumePpdb';
import { getStoredUser } from '@app/shared/services/auth.service';

export default function DashboardCalonMurid() {
  const navigate = useNavigate();
  const [reg, setReg] = useState(null);
  const [ppdbInfo, setPpdbInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const user = getStoredUser();
  const name = user?.name || user?.username;

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
  const { activeIndex, percent, steps } = computePpdbProgress(p);
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
        <div className="calon-murid-loading">
          <span className="calon-murid-spinner calon-murid-spinner--lg" />
          <p>Memuat dashboard...</p>
        </div>
      ) : (
        <>
          <DashboardWelcomeHeader name={name} />

          <div className="calon-murid-dashboard-grid">
            <div className="calon-murid-dashboard-main">
              <RegistrationStatusCard
                pendaftaran={p}
                progressPercent={percent}
                dashboardState={dashboardState}
              />

              <DashboardPrimaryAction
                dashboardState={dashboardState}
                onStart={handleStart}
                onNavigate={navigate}
                starting={starting}
              />

              {dashboardState.showProgress ? (
                <PpdbProgressStepper steps={steps} activeIndex={activeIndex} percent={percent} />
              ) : null}

              <PpdbTimeline activeIndex={timelineActiveIndex} />

              <QuickActionsGrid dashboardState={dashboardState} />
            </div>

            <aside className="calon-murid-dashboard-aside">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <DashboardAnnouncementsPreview ppdbInfo={ppdbInfo} />
                <ImportantInfoPanel info={infoPanelData} />
              </div>
            </aside>
          </div>
        </>
      )}
    </CalonMuridLayout>
  );
}




