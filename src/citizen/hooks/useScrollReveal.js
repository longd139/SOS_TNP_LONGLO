import { useEffect } from 'react';

/**
 * Shared hook — observes elements with class `.reveal`
 * and adds `.revealed` when they enter the viewport.
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    
    // Slight delay to allow DOM to render before observing
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, deps);
}