// Features and the footer use content-visibility: auto, so their height can
// change while a smooth scroll passes them. Chrome retargets the scroll when
// that happens but can land far off; other browsers may not retarget at all.
// Re-align once the scroll has settled, unless the user has moved on.
const USER_INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
let cancelPending = () => {};

export function scrollToSection(el) {
  cancelPending();
  el.scrollIntoView({ behavior: 'smooth' });

  let timer;
  const cleanup = () => {
    clearTimeout(timer);
    window.removeEventListener('scrollend', settle);
    USER_INPUT.forEach((type) => window.removeEventListener(type, cleanup, true));
    cancelPending = () => {};
  };
  function settle() {
    cleanup();
    if (Math.abs(el.getBoundingClientRect().top) > 1) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  }

  cancelPending = cleanup;
  window.addEventListener('scrollend', settle);
  USER_INPUT.forEach((type) => window.addEventListener(type, cleanup, true));
  // Fallback for browsers without scrollend, and for when no scroll was needed.
  timer = setTimeout(settle, 1500);
}
