import './PenStroke.css';

/* Two pen modes that are never mixed. The logo and the headline use the
   nib from docs/brand/traff-wordmark.svg: tilted -6 degrees with slanted ends.
   The mark on a cited sentence in a document lies straight, 0 degrees, with
   square ends. */
const LOGO_PEN_D = 'M -70,-81 L 40,-498 L 209,-495 L 378,-501 L 546,-497 L 715,-494 L 884,-500 L 1053,-497 L 1222,-497 L 1390,-495 L 1559,-506 L 1728,-505 L 1897,-493 L 2066,-497 L 2235,-503 L 2403,-497 L 2572,-505 L 2741,-502 L 2631,-76 L 2462,-76 L 2293,-84 L 2125,-81 L 1956,-81 L 1787,-78 L 1618,-86 L 1449,-83 L 1280,-86 L 1112,-73 L 943,-78 L 774,-83 L 605,-78 L 436,-80 L 268,-85 L 99,-84 L -70,-81 Z';

const YELLOW = 'var(--strykgul)';

function LinePen() {
  return (
    <span className="pen-rot">
      <span className="pen-clip" />
    </span>
  );
}

/**
 * Highlighter stroke. `variant="hero"` is the headline pen. `variant="line"`
 * is one text line. `phase` is `wait` (hidden), `play` (draw once) or `done`.
 */
export default function PenStroke({
  variant = 'line',
  tilt = 0,
  rise = 0,
  boxHeight = 0,
  phase = 'done',
  delay = 0,
  onDone = null,
}) {
  const hero = variant === 'hero';
  const shown = hero ? 'play' : phase;
  const style = {
    '--pen-tilt': `${tilt}deg`,
    '--pen-rise': `${rise}px`,
    '--pen-delay': `${delay}ms`,
    '--pen-duration': hero ? '0.82s' : '0.52s',
  };

  if (hero) {
    return (
      <svg
        viewBox="-100 -680 2860 760"
        preserveAspectRatio="none"
        className="pen-stroke-hero"
        style={style}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={LOGO_PEN_D}
          fill={YELLOW}
          fillOpacity="0.92"
          stroke={YELLOW}
          strokeOpacity="0.92"
          strokeWidth="10"
          strokeLinejoin="round"
          transform="rotate(-6 1336 -290)"
        />
      </svg>
    );
  }

  return (
    <span
      className={`pen-stroke pen-stroke--line pen-stroke--${shown}`}
      style={style}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.animationName !== 'pen-line-draw') return;
        if (event.target !== event.currentTarget.querySelector('.pen-clip')) return;
        onDone?.();
      }}
    >
      <LinePen />
    </span>
  );
}
