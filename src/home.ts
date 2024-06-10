import './global';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { gsap } from './global';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  const fbBadge = document.querySelector('[cs-el="fbBadge"]');
  const rotate = gsap
    .timeline({
      scrollTrigger: {
        trigger: 'body',
        scrub: 2,
        start: 'top top',
        end: '+=10000',
      },
    })
    .to(fbBadge, {
      rotation: 360 * 5,
      duration: 1,
      ease: 'none',
    });
}); // End: Webflow Push
