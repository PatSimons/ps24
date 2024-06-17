import './global';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { exp_isDestop } from './global';
import { gsap } from './global';
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
window.Webflow ||= [];
window.Webflow.push(() => {
  const projectImgItems = document.querySelectorAll<HTMLElement>('[cs-el="projectsTeaserWrap"]');
  gsap.from(projectImgItems, {
    y: '5rem',
    ease: 'power3.out',
    delay: 0.2,
    duration: 1,
    stagger: 0.1,
  });

  //_______________________________________________________________________________________________________ CMS Filter
  const cmsFilter = document.querySelector<HTMLElement>('[cs-el="cmsFilter"]');
  if (cmsFilter) {
    gsap.from(cmsFilter, { opacity: 0, delay: 3 });
    // const tl_fadeInItem = gsap.timeline({ paused: true });
    // const tl_fadeOutItem = gsap.timeline({ paused: true });

    gsap.set(cmsFilter, { autoAlpha: 1 });
    const cmsFilterLinks = cmsFilter.querySelectorAll<HTMLElement>('[cs-el="cmsFilterLink"]');
    const cmsItems = document.querySelectorAll<HTMLElement>('[cs-el="projectsTeaserWrap"]');
    cmsFilterLinks[0].classList.add('is-active');

    cmsFilterLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault;
        cmsFilterLinks.forEach((link) => {
          link.classList.remove('is-active');
        });
        link.classList.add('is-active');

        const linkFilter = link?.querySelector('a').getAttribute('data-linkfilter');
        //const event: Event = new Event('filter');
        cmsItems.forEach((item) => {
          const cmsFilterItemsArray = item?.querySelectorAll<HTMLElement>(
            '[cs-el="cmsFilterItem"] a'
          );
          const filtersArray: string[] = [];
          cmsFilterItemsArray.forEach((el) => {
            const filterValue = el.getAttribute('data-filter');
            // Check if the attribute exists and is not null
            if (filterValue !== null) {
              // Push the value into the array
              filtersArray.push(filterValue);
            }
            // console.log(filtersArray);
            // console.log('filter by: ' + linkFilter);
            // console.log('filters: ' + el.getAttribute('data-filter'));
            // if (linkFilter === el.getAttribute('data-filter') || linkFilter === 'all-projects') {
            if (filtersArray.includes(linkFilter) || linkFilter === 'all-projects') {
              item.style.display = 'block';
              gsap.set(item, { autoAlpha: 0, y: '5rem' });
              gsap.to(item, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 1 });
            } else {
              //gsap.to(item, { autoAlpha: 0, duration: 0.2 });
              item.style.display = 'none';
            }
          });
        });
        //cmsFilter.dispatchEvent(event);
      });
      // cmsFilter.addEventListener('filter', () => {
      //   gsap.to(projectImgItems, {
      //     autoAlpha: 1,
      //     y: '0rem',
      //     ease: 'power3.out',
      //     duration: 1,
      //     stagger: 0.1,
      //   });
      // });
    });
  }
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
