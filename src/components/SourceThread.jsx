import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import './SourceThread.css';

export default function SourceThread({
  startRef,
  targetSelector = '#pdf-highlight-0',
  containerRef,
  active = true,
  color = '#4FC79C',
}) {
  const [coords, setCoords] = useState(null);

  const updateCoordinates = useCallback(() => {
    if (!active || !containerRef?.current || !startRef?.current) {
      setCoords(null);
      return;
    }

    const container = containerRef.current;
    const startEl = startRef.current;
    const targetEl = container.querySelector(targetSelector);

    if (!targetEl) {
      setCoords(null);
      return;
    }

    const cRect = container.getBoundingClientRect();
    const sRect = startEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();

    // Check if elements are visible and within container
    if (sRect.width === 0 || tRect.width === 0) {
      setCoords(null);
      return;
    }

    const x1 = sRect.right - cRect.left;
    const y1 = sRect.top + sRect.height / 2 - cRect.top;
    const x2 = tRect.left - cRect.left;
    const y2 = tRect.top + tRect.height / 2 - cRect.top;

    setCoords({ x1, y1, x2, y2 });
  }, [active, startRef, targetSelector, containerRef]);

  useLayoutEffect(() => {
    updateCoordinates();
    const timer = setTimeout(updateCoordinates, 50);
    const timer2 = setTimeout(updateCoordinates, 250);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateCoordinates]);

  useEffect(() => {
    if (!active || !containerRef?.current) return undefined;
    const container = containerRef.current;
    const mo = new MutationObserver(() => updateCoordinates());
    mo.observe(container, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [active, containerRef, updateCoordinates]);

  useEffect(() => {
    window.addEventListener('resize', updateCoordinates);
    const scrollContainer = containerRef?.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateCoordinates, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoordinates);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateCoordinates, true);
      }
    };
  }, [updateCoordinates, containerRef]);

  if (!active || !coords) return null;

  const { x1, y1, x2, y2 } = coords;

  // Don't render if start and target are reversed or weird
  if (x2 <= x1 + 10) return null;

  // Orthogonal routed path with rounded corners (fillets)
  const midX = x1 + Math.max(30, (x2 - x1) * 0.42);
  const deltaY = y2 - y1;
  const absDeltaY = Math.abs(deltaY);

  let pathD = '';
  if (absDeltaY < 8) {
    pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
  } else {
    const dir = deltaY > 0 ? 1 : -1;
    const r = Math.min(10, absDeltaY / 2, (x2 - x1) / 3);
    pathD = `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 + dir * r} L ${midX} ${y2 - dir * r} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`;
  }

  return (
    <svg className="source-thread-svg" aria-hidden="true">
      {/* Crisp white halo for high legibility on light background */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.95)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Crisp primary line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="source-thread-line-anim"
      />
      {/* Origin dot on citation pill */}
      <circle cx={x1} cy={y1} r="3.5" fill={color} />
      {/* Target anchor point on document highlight */}
      <circle cx={x2} cy={y2} r="3.5" fill={color} />
    </svg>
  );
}
