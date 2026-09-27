import './PenStroke.css';

/* Same nib as docs/brand/traff-wordmark.svg. The hero keeps that path in its
   existing box, so the settled headline matches. A text line is three parts:
   the ends keep their shape, the middle stretches, and the top edge rises at
   a fixed visual angle while the bottom stays on the baseline. */
const LOGO_PEN_D = 'M -70,-81 L 40,-498 L 209,-495 L 378,-501 L 546,-497 L 715,-494 L 884,-500 L 1053,-497 L 1222,-497 L 1390,-495 L 1559,-506 L 1728,-505 L 1897,-493 L 2066,-497 L 2235,-503 L 2403,-497 L 2572,-505 L 2741,-502 L 2631,-76 L 2462,-76 L 2293,-84 L 2125,-81 L 1956,-81 L 1787,-78 L 1618,-86 L 1449,-83 L 1280,-86 L 1112,-73 L 943,-78 L 774,-83 L 605,-78 L 436,-80 L 268,-85 L 99,-84 L -70,-81 Z';

const YELLOW = 'var(--strykgul)';

function LinePen({ topLeft }) {
  const a = topLeft.toFixed(2);
  const wobble = topLeft * 0.08;
  const y = (value) => value.toFixed(2);
  return (
    <span className="pen-rot">
      <span className="pen-clip">
        <svg className="pen-cap pen-cap-l" viewBox="0 0 26 100" aria-hidden="true" focusable="false">
          <path d="M0 98 L26 2 L26 100 Z" fill={YELLOW} fillOpacity="0.92" />
        </svg>
        <svg className="pen-mid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path
            d={`M0 ${a} L18 ${y(topLeft - wobble)} L40 ${y(topLeft * 0.72 + wobble)} L62 ${y(topLeft * 0.42)} L82 ${y(topLeft * 0.22 + wobble)} L100 0 L100 100 L0 100 Z`}
            fill={YELLOW}
            fillOpacity="0.92"
          />
        </svg>
        <svg className="pen-cap pen-cap-r" viewBox="0 0 26 100" aria-hidden="true" focusable="false">
          <path d="M0 2 L26 0 L18 100 L0 100 Z" fill={YELLOW} fillOpacity="0.92" />
        </svg>
      </span>
    </span>
  );
}

/**
 * Highlighter stroke. `variant="hero"` is the headline pen. `variant="line"`
 * is one text line. `phase` is `wait` (hidden), `play` (draw once) or `done`.
 */
export default function PenStroke({
  variant = 'line',
  tilt = -1.25,
  rise = 0,
  boxHeight = 0,
  phase = 'done',
  delay = 0,
  onDone = null,
}) {
  const hero = variant === 'hero';
  const shown = hero ? 'play' : phase;
  const total = Math.max(boxHeight + rise, 1);
  const topLeft = (rise / total) * 100;
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
      <LinePen topLeft={topLeft} />
    </span>
  );
}
