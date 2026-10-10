export default function Loader({ label = 'Carico…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader__bars"><i /><i /><i /></span>
      {label}
    </div>
  );
}
