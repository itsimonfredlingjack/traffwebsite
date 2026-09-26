import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  FileText, ArrowRight, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Eye, Copy, RotateCcw, AlertTriangle
} from 'lucide-react';
import PdfPane from './PdfPane';
import TraffMark from './TraffMark';
import SourceThread from './SourceThread';
import ThumbnailStrip from './ThumbnailStrip';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import './InteractiveDemo.css';

/* ──────────────────────────────────────────────────────────
   Story phases & timing (total ≈ 7 s per scenario)
   ────────────────────────────────────────────────────────── */
const STORY_TIMING = {
  soker:      800,   // SÖKER scan-bar phase
  connecting: 450,   // SourceThread draw-on
  verified:   400,   // BELAGT badge + golden pulse start
  hold:       8500,  // Generous reading hold time (8.5s)
  resetting:  400,   // Fade-out before next scenario
};

const TYPE_SPEED = 16;  // ms per step
const TYPE_STEP  = 2;   // characters per step

const getScenarioDuration = (sc) => {
  const typingMs = Math.ceil((sc.answer?.length || 200) / TYPE_STEP) * TYPE_SPEED;
  return (
    STORY_TIMING.soker +
    typingMs +
    120 +
    STORY_TIMING.connecting +
    STORY_TIMING.verified +
    STORY_TIMING.hold +
    STORY_TIMING.resetting
  );
};

export default function InteractiveDemo({ onOpenBooking }) {
  /* ── Scenario ────────────────────────────────────────── */
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = DEMO_SCENARIOS[selectedScenarioIndex];

  /* ── Active citation within the scenario ─────────────── */
  const [activeCitationId, setActiveCitationId] = useState(1);
  const activeCitation = useMemo(() => {
    const list = activeScenario.citations || [];
    return list.find((c) => c.id === activeCitationId) || list[0] || {
      id: 1,
      page: activeScenario.page,
      rects: activeScenario.rects || [],
      label: activeScenario.citationBadge || '§ 1',
      docName: activeScenario.docName,
      quote: activeScenario.answer,
    };
  }, [activeScenario, activeCitationId]);

  /* ── PDF display state ───────────────────────────────── */
  const [currentPage, setCurrentPage] = useState(activeScenario.page);
  const [highlightActive, setHighlightActive] = useState(true);
  const [numPages, setNumPages] = useState(activeScenario.totalPages);
  const [containerWidth, setContainerWidth] = useState(540);
  const [zoomScale, setZoomScale] = useState(1);

  /* ── Story engine state ──────────────────────────────── */
  // Phases: 'idle' | 'soker' | 'typing' | 'connecting' | 'verified' | 'hold' | 'resetting'
  const [storyPhase, setStoryPhase] = useState('idle');
  const [isInView, setIsInView] = useState(false);
  const storyTimerRef = useRef(null);
  const typingIntervalRef = useRef(null);

  /* ── Chat animation state ────────────────────────────── */
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [showCitation, setShowCitation] = useState(false);
  const [searchState, setSearchState] = useState('vila'); // 'vila' | 'soker' | 'belagt' | 'ejbelagt'
  const [pulseHighlights, setPulseHighlights] = useState(false);

  /* ── Mobile tab state: 'chat' | 'doc' ───────────────── */
  const [mobileTab, setMobileTab] = useState('chat');

  /* ── Cycle counter for re-keying SourceThread ─────────── */
  const [storyCycle, setStoryCycle] = useState(0);

  /* ── DOM Refs ────────────────────────────────────────── */
  const frameRef = useRef(null);
  const splitContainerRef = useRef(null);
  const activePillRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const isHoveredRef = useRef(false);

  /* ── Measure container width for PDF fitWidth ────────── */
  useEffect(() => {
    if (!pdfContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width - 40));
        }
      }
    });
    observer.observe(pdfContainerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── IntersectionObserver — autoplay trigger ─────────── */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Story cleanup helper ────────────────────────────── */
  const clearStoryTimers = useCallback(() => {
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current);
      storyTimerRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  /* ── Reset everything for a fresh scenario ───────────── */
  const resetForScenario = useCallback((scenarioIndex) => {
    clearStoryTimers();
    const sc = DEMO_SCENARIOS[scenarioIndex];
    setSelectedScenarioIndex(scenarioIndex);
    setActiveCitationId(1);
    setCurrentPage(sc.page);
    setHighlightActive(true);
    setNumPages(sc.totalPages);
    setZoomScale(1);
    setDisplayedAnswer('');
    setShowCitation(false);
    setSearchState('vila');
    setPulseHighlights(false);
    setStoryPhase('idle');
    setMobileTab('chat');
  }, [clearStoryTimers]);

  /* ── Run one story cycle ─────────────────────────────── */
  const runStory = useCallback(() => {
    const sc = DEMO_SCENARIOS[selectedScenarioIndex];
    clearStoryTimers();

    // Phase 1: SÖKER
    setStoryPhase('soker');
    setSearchState('soker');
    setDisplayedAnswer('');
    setShowCitation(false);
    setPulseHighlights(false);

    storyTimerRef.current = setTimeout(() => {
      // Phase 2: TYPING
      setStoryPhase('typing');
      const fullText = sc.answer;
      let currentLength = 0;

      typingIntervalRef.current = setInterval(() => {
        currentLength += TYPE_STEP;
        if (currentLength >= fullText.length) {
          setDisplayedAnswer(fullText);
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;

          // Phase 3: CONNECTING — show citations + SourceThread draws on
          storyTimerRef.current = setTimeout(() => {
            setStoryPhase('connecting');
            setShowCitation(true);
            setSearchState(sc.state || 'belagt');
            setStoryCycle((c) => c + 1); // re-key SourceThread for fresh draw-on

            // Phase 4: VERIFIED — golden pulse
            storyTimerRef.current = setTimeout(() => {
              setStoryPhase('verified');
              setPulseHighlights(true);

              // Phase 5: HOLD — generous reading time, pauses if user hovers
              storyTimerRef.current = setTimeout(() => {
                setStoryPhase('hold');

                const checkAndAdvance = () => {
                  if (isHoveredRef.current) {
                    // User is hovering / reading — hold and check again in 1s
                    storyTimerRef.current = setTimeout(checkAndAdvance, 1000);
                    return;
                  }

                  // Phase 6: RESETTING — fade out, advance scenario
                  setStoryPhase('resetting');

                  storyTimerRef.current = setTimeout(() => {
                    const nextIndex = (selectedScenarioIndex + 1) % DEMO_SCENARIOS.length;
                    resetForScenario(nextIndex);
                  }, STORY_TIMING.resetting);
                };

                storyTimerRef.current = setTimeout(checkAndAdvance, STORY_TIMING.hold);
              }, STORY_TIMING.verified);
            }, STORY_TIMING.connecting);
          }, 100); // tiny buffer after typing completes

        } else {
          setDisplayedAnswer(fullText.slice(0, currentLength));
        }
      }, TYPE_SPEED);

    }, STORY_TIMING.soker);
  }, [selectedScenarioIndex, clearStoryTimers, resetForScenario]);

  /* ── Start story when in view + idle ─────────────────── */
  useEffect(() => {
    if (isInView && storyPhase === 'idle') {
      // Small delay so the reset transition has settled
      const kickoff = setTimeout(() => runStory(), 200);
      return () => clearTimeout(kickoff);
    }
    // If the demo scrolls out of view mid-story, we let it finish
    // and it will pause at 'idle' after reset if still out of view
  }, [isInView, storyPhase, runStory]);

  /* ── Cleanup on unmount ──────────────────────────────── */
  useEffect(() => {
    return () => clearStoryTimers();
  }, [clearStoryTimers]);

  /* ── Page navigation (still available for user exploration) */
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage((p) => p + 1);
  };

  const handleZoom = (delta) => {
    setZoomScale((prev) => Math.min(Math.max(0.8, prev + delta), 1.3));
  };

  /* ── Derived state ───────────────────────────────────── */
  const isTyping = storyPhase === 'typing';
  const threadActive = ['connecting', 'verified', 'hold'].includes(storyPhase) &&
    showCitation && highlightActive && currentPage === activeCitation.page && mobileTab === 'chat';

  // Container classes for fade transitions
  const splitClasses = [
    'demo-split-container',
    storyPhase === 'resetting' ? 'story-resetting' : 'story-active',
  ].join(' ');

  return (
    <div
      className="demo-showcase-frame"
      id="demo-section"
      ref={frameRef}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {/* Top Scenario Selector Bar — display-only indicators during autoplay */}
      <div className="demo-scenario-strip">
        <span className="demo-mono-header">VÄLJ TESTHANDLING</span>
        <div className="demo-scenario-tabs" role="tablist">
          {DEMO_SCENARIOS.map((sc, idx) => {
            const isSelected = idx === selectedScenarioIndex;
            return (
              <button
                key={`tab-${sc.id}-${selectedScenarioIndex === idx ? storyCycle : 'idle'}`}
                role="tab"
                aria-selected={isSelected}
                className={`demo-scenario-tab-btn ${isSelected ? 'active' : ''} ${sc.state === 'ejbelagt' ? 'is-refusal' : ''}`}
                style={isSelected ? { '--story-duration': `${getScenarioDuration(sc)}ms` } : undefined}
                onClick={() => resetForScenario(idx)}
                aria-label={`${sc.tag}: ${sc.title}`}
                title={`Klicka för att se handling: ${sc.title}`}
              >
                <span className="tab-category">{sc.tag}</span>
                <span className="tab-title">{sc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="demo-mobile-bar">
        <button
          className={`demo-mobile-tab-btn ${mobileTab === 'chat' ? 'active' : ''}`}
          onClick={() => setMobileTab('chat')}
        >
          <span>Ärende &amp; Svar</span>
        </button>
        <button
          className={`demo-mobile-tab-btn ${mobileTab === 'doc' ? 'active' : ''}`}
          onClick={() => setMobileTab('doc')}
        >
          <span>Källdokument (Sida {currentPage})</span>
          {highlightActive && currentPage === activeCitation.page && (
            <span className="demo-belagt-dot" />
          )}
        </button>
      </div>

      {/* Main Split Grid */}
      <div className={splitClasses} ref={splitContainerRef}>
        {/* Dynamic SVG Connection Thread — re-keyed each cycle for fresh draw-on */}
        <SourceThread
          key={`thread-${storyCycle}`}
          startRef={activePillRef}
          targetSelector="#pdf-highlight-0"
          containerRef={splitContainerRef}
          active={threadActive}
          color={activeScenario.state === 'ejbelagt' ? '#D97706' : '#059669'}
        />

        {/* Left Column: Authentic Träff Inquiry Flow */}
        <div className={`demo-chat-pane ${mobileTab === 'doc' ? 'mobile-hidden' : ''}`}>
          {/* Inquiry Question Header */}
          <div className="inquiry-head-block">
            <div className="inquiry-meta-row">
              <span className="inquiry-mono-step">FRÅGA {activeScenario.questionNum || 1}</span>
              <span className="inquiry-mono-time">{activeScenario.timestamp || '12:07'}</span>
            </div>
            <p className="inquiry-query-title">{activeScenario.question}</p>
          </div>

          {/* Timeline Node & Status State */}
          <div className="inquiry-timeline-row">
            <div className="timeline-spine-track">
              <TraffMark
                size={22}
                variant="status"
                state={searchState}
                breathing={searchState === 'soker'}
                decorative
              />
              <div className={`timeline-stem-line ${searchState}`} />
            </div>

            <div className="timeline-state-body">
              {searchState === 'soker' ? (
                <div className="state-soker-box">
                  <div className="state-soker-label">SÖKER</div>
                  <div className="state-soker-sub">
                    <span>JÄMFÖR ORDALYDELSE</span>
                    <div className="state-soker-bar" />
                  </div>
                </div>
              ) : searchState === 'vila' ? (
                <div className="state-badge-row vila">
                  <span className="state-name-mono">VILA</span>
                </div>
              ) : (
                <div className={`state-badge-row ${searchState}`}>
                  <span className="state-name-mono">
                    {searchState === 'ejbelagt' ? 'EJ BELAGT' : 'BELAGT'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Answer Card Surface */}
          <div className="inquiry-answer-card">
            <div className="answer-prose-text">
              {displayedAnswer}
              {isTyping && <span className="demo-cursor-blink">|</span>}
              {!displayedAnswer && !isTyping && (
                <span className="answer-placeholder">Inväntar sökning…</span>
              )}
            </div>

            {/* Inline Citation Pills (1, 2, 3...) */}
            {showCitation && (activeScenario.citations || []).length > 0 && (
              <div className="answer-pills-row" role="group" aria-label="Källcitat">
                {activeScenario.citations.map((cit) => {
                  const isActive = cit.id === activeCitationId;
                  return (
                    <button
                      key={cit.id}
                      ref={isActive ? activePillRef : null}
                      type="button"
                      className={`citation-num-pill ${isActive ? 'active' : ''} ${activeScenario.state === 'ejbelagt' ? 'ejbelagt' : ''}`}
                      onClick={() => {
                        setActiveCitationId(cit.id);
                        setCurrentPage(cit.page);
                        setHighlightActive(true);
                      }}
                      title={`Klicka för att förankra vid ${cit.label} (sida ${cit.page})`}
                      aria-pressed={isActive}
                    >
                      <span>{cit.id}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Warning Callout for Refusal / Contradiction */}
            {showCitation && activeScenario.warning && (
              <div className="inquiry-refusal-alert">
                <AlertTriangle size={15} className="refusal-icon" aria-hidden="true" />
                <p className="refusal-text">{activeScenario.warning}</p>
              </div>
            )}
          </div>

          {/* Citation List Index in Mono */}
          {showCitation && (activeScenario.citations || []).length > 0 && (
            <div className="inquiry-citations-index">
              {activeScenario.citations.map((cit) => {
                const isActive = cit.id === activeCitationId;
                return (
                  <button
                    key={cit.id}
                    type="button"
                    className={`citation-index-row ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCitationId(cit.id);
                      setCurrentPage(cit.page);
                      setHighlightActive(true);
                    }}
                  >
                    <span className="index-num">[{cit.id}]</span>
                    <span className="index-doc-name">{cit.docName}</span>
                    <span className="index-page-ref">s. {cit.page}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Row & Model Identity Badge */}
          <div className="inquiry-bottom-meta">
            <div className="inquiry-quick-actions">
              <button
                type="button"
                className="inquiry-text-action"
                onClick={() => navigator.clipboard?.writeText(displayedAnswer)}
                title="Kopiera svaret"
              >
                <Copy size={12} />
                <span>Kopiera</span>
              </button>
              <button
                type="button"
                className="inquiry-text-action"
                onClick={() => resetForScenario(selectedScenarioIndex)}
                title="Kör om sökningen"
              >
                <RotateCcw size={12} />
                <span>Gör om</span>
              </button>
            </div>

            <div className="inquiry-model-tag">
              <span>{(activeScenario.citations || []).length || 1} KÄLLOR · GEMMA 4 12B · SELF-HOSTED · {activeScenario.timestamp || '12:09'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic PDF Document Workspace with Thumbnail Strip */}
        <div
          className={`demo-doc-pane ${mobileTab === 'chat' ? 'mobile-hidden' : ''}`}
          ref={pdfContainerRef}
        >
          {/* Document Viewer Title Bar */}
          <div className="demo-doc-header">
            <div className="demo-doc-title-group">
              <FileText size={15} className="doc-icon" />
              <span className="demo-doc-file-name">{activeScenario.docName}</span>
              <span className="demo-doc-category-badge">{activeScenario.category}</span>
            </div>

            <div className="demo-doc-toolbar-actions">
              <div className="demo-pagination-box">
                <button
                  className="demo-nav-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  aria-label="Föregående sida"
                  title="Föregående sida"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="demo-mono-page-count">
                  Sida {currentPage} av {numPages}
                </span>
                <button
                  className="demo-nav-btn"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  aria-label="Nästa sida"
                  title="Nästa sida"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="demo-zoom-box">
                <button
                  className="demo-nav-btn"
                  onClick={() => handleZoom(-0.1)}
                  disabled={zoomScale <= 0.8}
                  aria-label="Minska zoom"
                  title="Minska"
                >
                  <ZoomOut size={13} />
                </button>
                <button
                  className="demo-nav-btn"
                  onClick={() => handleZoom(0.1)}
                  disabled={zoomScale >= 1.3}
                  aria-label="Öka zoom"
                  title="Förstora"
                >
                  <ZoomIn size={13} />
                </button>
              </div>

              <button
                className={`demo-highlight-toggle ${highlightActive ? 'active' : ''}`}
                onClick={() => setHighlightActive(!highlightActive)}
                title="Växla överstrykning"
              >
                <Eye size={13} />
                <span>{highlightActive ? 'Markering på' : 'Dold'}</span>
              </button>
            </div>
          </div>

          {/* Top Page Thumbnail Carousel Strip */}
          <ThumbnailStrip
            totalPages={numPages}
            currentPage={currentPage}
            onSelectPage={(p) => setCurrentPage(p)}
            pagesWithHits={activeScenario.pagesWithHits || [activeScenario.page]}
          />

          {/* Document Canvas Surface on Paper Matta */}
          <div className="demo-canvas-viewport">
            <div
              className="demo-paper-frame"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
              }}
            >
              <div className="demo-white-sheet">
                <PdfPane
                  url={activeScenario.pdfUrl}
                  page={currentPage}
                  onNumPages={setNumPages}
                  rects={highlightActive && currentPage === activeCitation.page ? activeCitation.rects : []}
                  highlightPage={activeCitation.page}
                  fitWidth={Math.max(340, containerWidth)}
                  pulseHighlights={pulseHighlights}
                />
              </div>
            </div>

            {/* Citation Notification Pill */}
            {highlightActive && currentPage === activeCitation.page && showCitation && (
              <div className={`demo-belagt-floating-badge ${activeScenario.state === 'ejbelagt' ? 'ejbelagt' : ''}`}>
                <TraffMark
                  size={15}
                  variant="status"
                  state={activeScenario.state || 'belagt'}
                  decorative
                />
                <span className="badge-mono-text">
                  {activeScenario.state === 'ejbelagt' ? 'EJ BELAGT' : 'BELAGT'} · {activeCitation.label?.toUpperCase() || 'ORDAGRANT'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="demo-frame-footer">
        <div className="demo-footer-copy">
          <span className="demo-footer-lead">Vill du testa med era egna handlingar?</span>
          <span className="demo-footer-sub">Vi visar hur Träff hittar svaren i era avtal och protokoll under en 15-minuters genomgång.</span>
        </div>
        <button className="demo-footer-action-btn" onClick={onOpenBooking}>
          <span>Boka genomgång</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
