import './global';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { exp_isDestop } from './global';
import { gsap } from './global';
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
window.Webflow ||= [];
window.Webflow.push(() => {
  const projectImgItems = document.querySelectorAll<HTMLElement>('[cs-el="projectImgItem"]');
  gsap.from(projectImgItems, {
    y: '5rem',
    ease: 'power3.out',
    delay: 0.2,
    duration: 1,
    stagger: 0.1,
  });
  projectImgItems.forEach((item) => {});
  //   const pinParents = document.querySelectorAll<HTMLElement>('[cs-el="pinParent"]');
  //   console.log(pinParents.length);
  //   pinParents.forEach((pinParent) => {
  //     // Select the child element within the current parent
  //     const pins = pinParent.querySelectorAll<HTMLElement>('[cs-el="pin"]');
  //     // Check if the child element exists
  //     pins.forEach((pin) => {
  //       if (pin) {
  //         // Create the pinning animation for the current parent and child
  //         gsap.to(pin, {
  //           scrollTrigger: {
  //             trigger: pinParent,
  //             start: 'top top', // when the top of the parent hits the top of the viewport
  //             end: 'bottom top', // when the bottom of the parent hits the top of the viewport
  //             pin: pin, // pin the child element
  //             pinSpacing: false, // maintain space for pin element, optional
  //           },
  //         });
  //       } else {
  //         console.error('Pin element not found within pinParent:', pinParent);
  //       }
  //     });
  //   });
}); // End: Webflow Push
