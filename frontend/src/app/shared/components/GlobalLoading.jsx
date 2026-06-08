export default function GlobalLoading({ message = 'Memuat data...' }) {
  return (
    <div className="global-loading" role="status">
      <div className="global-loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
