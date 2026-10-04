/**
 * Search status only. The ring is not a logo — see docs/brand/BRAND.md.
 * Geometry is the 120-unit mark in docs/brand/status-marks.svg.md, drawn as
 * SVG so 14px still reads. The core exists only in belagt.
 */

const STATE_LABEL = {
  vila: 'Vilande',
  soker: 'Söker',
  belagt: 'Belagt',
  ejbelagt: 'Ej belagt',
  fel: 'Tekniskt fel',
};

export default function TraffMark({
  size = 22,
  state = 'vila',
  title,
  decorative = false,
  className = '',
  style = {},
}) {
  const shown = STATE_LABEL[state] ? state : 'vila';
  const label = title ?? STATE_LABEL[shown];

  return (
    <span
      className={`traff-mark traff-mark--${shown}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, ...style }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : label}
    >
      <svg viewBox="-60 -60 120 120" aria-hidden="true" focusable="false">
        {shown === 'vila' && (
          <circle r="40" fill="none" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="8" />
        )}
        {shown === 'soker' && (
          <circle r="40" fill="none" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="8" />
        )}
        {shown === 'belagt' && (
          <>
            <circle className="traff-mark-echo" r="52" fill="none" stroke="var(--belagt-grafik)" strokeOpacity="0.28" strokeWidth="6" />
            <circle r="40" fill="none" stroke="var(--belagt-grafik)" strokeWidth="8" />
            <circle className="traff-mark-core" r="16" fill="var(--belagt-grafik)" />
          </>
        )}
        {shown === 'ejbelagt' && (
          <>
            <circle r="40" fill="none" stroke="var(--ej-belagt-grafik)" strokeWidth="11" />
            <g className="traff-mark-stamp">
              <rect x="-22" y="-7" width="44" height="14" rx="7" fill="var(--ej-belagt-grafik)" />
            </g>
          </>
        )}
        {shown === 'fel' && (
          <>
            <rect x="-38" y="-38" width="76" height="76" rx="18" fill="none" stroke="var(--fel-grafik)" strokeWidth="8" />
            <rect x="-7" y="-22" width="14" height="28" rx="7" fill="var(--fel-grafik)" />
            <circle cy="22" r="8" fill="var(--fel-grafik)" />
          </>
        )}
      </svg>
      {shown === 'soker' && (
        <span className="traff-mark-seek">
          <svg viewBox="-60 -60 120 120" aria-hidden="true" focusable="false">
            <path d="M 0,-40 A 40,40 0 0 1 38,-12" fill="none" stroke="var(--soker)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 38,-12 A 40,40 0 0 1 28,28" fill="none" stroke="var(--soker)" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </span>
  );
}
