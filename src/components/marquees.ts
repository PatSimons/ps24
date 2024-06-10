/* COMPONENTS > MARQUEES

//// DATA ATTRIBUTES:
[cs-el="marquee"]
[cs-el="marquee-content"]

//// CONFIG OPTIONS
*/

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { Draggable } from 'gsap/Draggable';
// import { InertiaPlugin } from 'gsap/InertiaPlugin';
gsap.registerPlugin(Draggable);
//gsap.registerPlugin(InertiaPlugin);

// Export Initialize all Marquees
export function initMarquees() {
  const marquees = gsap.utils.toArray<HTMLElement>('[cs-el="marquee"]');
  console.log('Marquees present: ' + marquees.length);
  if (marquees.length > 0) {
    marquees.forEach((marquee) => {
      if (marquee) {
        initMarquee(marquee); // Call the function for each marquee
      }
    });
  }
} // End: Initialize all Marquees

// Init each Marquee
function initMarquee(marquee: HTMLElement) {
  const marqueeType = marquee?.getAttribute('cs-marquee-type');
  const marqueeDirection = marquee?.getAttribute('cs-marquee-direction');
  const marqueeDrag = marquee?.getAttribute('cs-marquee-nodrag');
  const duration = 100;
  const marqueeContent = marquee.querySelector('[cs-el="marquee-content"]');
  if (!marqueeContent) {
    console.log('No marquee content present!');
    return;
  }
  if (!marqueeDrag && isMobile) {
    //console.log('drag');
    Draggable.create(marqueeContent, {
      type: 'x',
      bounds: marquee,
      //inertia: true,
    });
    return;
  }
  const marqueeContentClone = marqueeContent.cloneNode(true);
  marquee.append(marqueeContentClone);

  let tween: any;
  const progress = tween ? tween.progress() : 0;
  tween && tween.progress(0).kill();
  const width = parseInt(getComputedStyle(marqueeContent).getPropertyValue('width'), 10);
  const distanceToTranslate = -width / (marqueeType === 'scroll' ? 8 : 1);

  let startPoint = 0;
  let endPoint = distanceToTranslate;
  if (marqueeDirection === 'right') {
    startPoint = distanceToTranslate;
    endPoint = 0;
  }
  if (marqueeType === 'scroll') {
    tween = gsap.fromTo(
      marquee.children,
      { x: startPoint },
      {
        x: endPoint,
        duration,
        scrollTrigger: {
          trigger: marqueeContent,
          scrub: 1,
          start: 'top bottom',
          end: 'bottom top',
          invalidateOnRefresh: true,
        },
      }
    );
  }
  if (marqueeType === 'loop') {
    tween = gsap.fromTo(
      marquee.children,
      { x: startPoint },
      {
        x: endPoint,
        duration,
        repeat: -1,
      }
    );
  }
  tween.progress(progress);
} // End: Fnc initMarquee

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
