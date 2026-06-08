export default function PortalPageShell({ children, className = '' }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}
