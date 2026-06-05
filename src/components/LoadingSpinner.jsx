export default function LoadingSpinner({ fullPage, small }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="spinner" />
        <p>Cargando...</p>
      </div>
    );
  }
  return <div className={`spinner ${small ? 'spinner--small' : ''}`} />;
}
