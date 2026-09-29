// Features and the footer use content-visibility: auto, so their height can
// change while a smooth scroll passes them. Chrome retargets the scroll when
// that happens but can land far off; other browsers may not retarget at all.
// Re-align once the scroll has settled.
export function scrollToSection(el) {
  el.scrollIntoView({ behavior: 'smooth' });
  let timer;
  const settle = () => {
    clearTimeout(timer);
    window.removeEventListener('scrollend', settle);
    if (Math.abs(el.getBoundingClientRect().top) > 1) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  };
  window.addEventListener('scrollend', settle);
  // Fallback for browsers without scrollend, and for when no scroll was needed.
  timer = setTimeout(settle, 1500);
}
