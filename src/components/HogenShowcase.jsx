import React, { useState, useEffect, useRef, useCallback } from 'react';
import TraffMark from './TraffMark';
import './HogenShowcase.css';

export default function HogenShowcase({ onScrollToDemo }) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse parallax tracking with smooth lerp
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalized offset between -1 and 1
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    setTilt({
      x: normY * -4, // tilt X by ±4 deg
      y: normX * 4,  // tilt Y by ±4 deg
    });
  }, []);

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const rotX = 52 + tilt.x;
  const rotZ = -32 + tilt.y;

  return (
    <div
      className="hogen-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onScrollToDemo}
      role="button"
      tabIndex={0}
      title="Klicka för att öppna den lysande sidan i demon"
      aria-label="3D-motivet Högen: En belagd sida lyser upp ur dokumentarkivet"
    >
      {/* Sökljus beam traversing through the stack */}
      <div className="hogen-sokljus-beam" aria-hidden="true" />

      {/* 3D Paper Stack (§04 Högen) */}
      <div className="hogen-perspective-stage">
        <div
          className="hogen-stack-transform"
          style={{
            transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
          }}
        >
          {/* Upper dark sheets */}
          <div className="hogen-sheet s1" />
          <div className="hogen-sheet s2" />
          <div className="hogen-sheet s3" />
          <div className="hogen-sheet s4" />
          <div className="hogen-sheet s5" />
          <div className="hogen-sheet s6" />
          <div className="hogen-sheet s7" />
          <div className="hogen-sheet s8" />

          {/* THE LIT LEAF (Den lysande sidan med belägget) */}
          <div className="hogen-leaf-lit">
            <div className="hogen-lit-spine" />
            <div className="hogen-lit-glow-line" />
            <div className="hogen-lit-page-tag">S. 6</div>
          </div>

          {/* Lower dark sheets */}
          <div className="hogen-sheet s8" />
          <div className="hogen-sheet s7" />
          <div className="hogen-sheet s6" />
          <div className="hogen-sheet s5" />
          <div className="hogen-sheet s4" />
          <div className="hogen-sheet s3" />
          <div className="hogen-sheet s2" />
          <div className="hogen-sheet s1" />
        </div>
      </div>

      {/* Verified Status Pill (§03 & §04) */}
      <div className="hogen-meta-lockup">
        <div className="hogen-status-pill">
          <TraffMark size={16} variant="status" state="belagt" decorative />
          <span className="hogen-mono-tag">BELAGT · SIDA 6 AV 1 214</span>
        </div>

        {/* Verbatim quote from the lit leaf */}
        <blockquote className="hogen-quote-serif">
          ”En bostadsrättshavare får upplåta sin lägenhet i andra hand endast om styrelsen ger sitt samtycke.”
        </blockquote>

        <div className="hogen-jump-hint">
          <span>Klicka för att granska beviset i demon</span>
          <span className="hogen-hint-arrow">↓</span>
        </div>
      </div>
    </div>
  );
}
