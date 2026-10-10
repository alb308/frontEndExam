export default function Logo({ size = 28 }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="currentColor" opacity="0.08" />
        <g fill="var(--accent)">
          <path d="M19 12h6l-4 40h-6z" />
          <path d="M31 12h6l-4 40h-6z" />
          <path d="M43 12h6l-4 40h-6z" />
        </g>
      </svg>
      <span className="logo__word">CAN<b>VAULT</b></span>
    </span>
  );
}
