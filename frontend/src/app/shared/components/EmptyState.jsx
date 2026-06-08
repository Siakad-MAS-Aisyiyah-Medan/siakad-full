import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Belum ada data', description, action }) {
  return (
    <div className="glass p-8 mt-4 text-center text-secondary" style={{ borderRadius: '12px' }}>
      <Inbox size={48} className="mx-auto mb-3 opacity-50" />
      <h3 className="font-semibold text-primary-dark">{title}</h3>
      {description && <p className="mt-2 text-sm">{description}</p>}
      {action}
    </div>
  );
}
