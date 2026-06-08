import MainLayout from '@app/shared/layouts/MainLayout';
import { getJsonItem } from '../utils/storage';
import { getAdminDisplayName } from '../utils/profile';

export default function AdminPageShell({ children, title, subtitle }) {
  const profile = getJsonItem('profile');

  return (
    <MainLayout role="admin" name={getAdminDisplayName(profile)}>
      <div className="admin-page-wrapper animate-fade-in">
        {(title || subtitle) && (
          <div className="section-header mb-4">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </MainLayout>
  );
}
