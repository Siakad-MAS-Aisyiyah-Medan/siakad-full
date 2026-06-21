export default function PageLoading() {
  return (
    <div className="global-loading" role="status" aria-label="Memuat halaman">
      <span className="global-loading-spinner" />
      <p>Memuat halaman...</p>
    </div>
  );
}
