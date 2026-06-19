import AdminPageShell from '@app/shared/components/AdminPageShell';
import InfoProfilPage from './info';

export default function ProfilSekolahPage({ readOnly = false }) {
  return (
    <AdminPageShell>
      <InfoProfilPage readOnly={readOnly} />
    </AdminPageShell>
  );
}
