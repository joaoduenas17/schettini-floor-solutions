export default function Loading() {
  return (
    <main className="page-loading" id="main-content" aria-busy="true" aria-live="polite">
      <span className="loading-mark" aria-hidden="true">S</span>
      <span className="loading-spinner" aria-hidden="true" />
      <p>Preparing the site…</p>
    </main>
  );
}
