import './global';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

import { exp_isDestop } from './global';
import { gsap } from './global';

window.Webflow ||= [];
window.Webflow.push(() => {
  const isDesktop: boolean = exp_isDestop;

  // //_______________________________________________________________________________________________________ Fancy Hover Test
  // const navHovers = document.querySelectorAll<HTMLElement>('[cs-el="navHoverItem"]');
  // navHovers.forEach((item) => {
  //   const navSplitType = new SplitType(item, { types: 'chars' });
  //   const duplicate = item.cloneNode(true) as HTMLElement;
  //   const staggerTime = 0.035;
  //   const durationTime = 1.5;
  //   const rotationDegree = 0;
  //   const yPercentage = -115;
  //   // Add the 'dupe' class to the cloned element
  //   duplicate.classList.add('dupe');
  //   //item.style.color = 'red';
  //   // Insert the cloned element after the original
  //   item.parentNode?.insertBefore(duplicate, item.nextSibling);
  //   const charsOriginal = item.querySelectorAll('.char');
  //   const charsDuplicate = duplicate.querySelectorAll('.char');
  //   gsap.set(charsDuplicate, { yPercent: yPercentage * -1, rotateZ: rotationDegree * -1 });
  //   const tl_mouseEnter = gsap.timeline({ paused: true });
  //   const tl_mouseLeave = gsap.timeline({ paused: true });
  //   tl_mouseEnter.to(charsOriginal, {
  //     yPercent: yPercentage,
  //     stagger: staggerTime,
  //     duration: durationTime,
  //     rotateZ: rotationDegree,
  //     ease: 'expo.out',
  //   });
  //   tl_mouseEnter.to(
  //     charsDuplicate,
  //     { yPercent: 0, stagger: staggerTime, duration: durationTime, rotateZ: 0, ease: 'expo.out' },
  //     '<'
  //   );
  //   tl_mouseLeave.to(charsOriginal, {
  //     yPercent: 0,
  //     stagger: staggerTime,
  //     duration: durationTime,
  //     rotateZ: 0,
  //     ease: 'expo.out',
  //   });
  //   tl_mouseLeave.to(
  //     charsDuplicate,
  //     {
  //       yPercent: yPercentage * -1,
  //       stagger: staggerTime,
  //       rotateZ: rotationDegree,
  //       duration: durationTime,
  //       ease: 'expo.out',
  //     },
  //     '<'
  //   );
  //   //tl_mouseEnter.play();
  //   duplicate.addEventListener('mouseenter', () => {
  //     tl_mouseEnter.timeScale(1).restart();
  //     console.log('enter');
  //   });
  //   duplicate.addEventListener('mouseleave', () => {
  //     tl_mouseLeave.timeScale(1).restart();
  //     console.log('leave');
  //   });
  // });
}); // End: Webflow Push
