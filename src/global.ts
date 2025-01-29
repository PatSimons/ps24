import { gsap } from 'gsap';
export { gsap };

import { ScrollTrigger } from 'gsap/ScrollTrigger';
export { ScrollTrigger };
import { Draggable } from 'gsap/Draggable';
// import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, Draggable);

import SplitType from 'split-type';
//import { initMarquees } from 'src/components/marquees';
import { initSliders } from 'src/components/sliders';

//import { horizontalLoop } from './helpers/gsapHorizontalLoop';
import { verticalLoop } from './helpers/gsapVerticalLoop';
import { waitForImages } from './helpers/psWaitForImages';

const global_easeType = 'back.out';
const global_imgsFadeInDuration = 1;

const pageTransition_easeType = 'power4.in';
const pageTransition_duration = 0.5;

const consoleLog: boolean = false;

export let exp_isDestop: boolean = false;

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Window Focus

  // Function to handle when the user leaves the page
  function handleUserLeaves() {
    if (consoleLog) {
      console.log('User has left the page.');
    }
    gsap.globalTimeline.pause();
  }

  // Function to handle when the user returns to the page
  function handleUserReturns() {
    if (consoleLog) {
      console.log('User has returned to the page.');
    }
    gsap.globalTimeline.resume();
    //window.location.reload();
  }

  // Function to check the visibility state of the page
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      handleUserLeaves();
    } else if (document.visibilityState === 'visible') {
      handleUserReturns();
    }
  }

  // Add event listener for visibility change
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initial check to see the visibility state on page load
  handleVisibilityChange();
  //_______________________________________________________________________________________________________ GSAP Match Media
  const mm = gsap.matchMedia();
  const breakPoint = 992;
  // const breakPointMob = 768;

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isTablet: `(max-width: ${breakPoint - 1}px)`,
    },
    (context) => {
      const { isDesktop, isTablet } = context.conditions as {
        isDesktop: boolean;
        isTablet: boolean;
      };
      if (isDesktop) {
        exp_isDestop = true;
      }
      //_______________________________________________________________________________________________________ Body overflow-hidden toggle function
      function bodyOverflowHidden() {
        const body = document.querySelector<HTMLElement>('body');
        setTimeout(() => {
          if (!body?.classList.contains('overflow-hidden')) {
            body?.classList.add('overflow-hidden');
          } else {
            body?.classList.remove('overflow-hidden');
          }
        }, 300);
      }

      //_______________________________________________________________________________________________________ Main Navigation functionalities
      const navMenu = document.querySelector<HTMLElement>('[cs-el="navMenu"]');
      const navItems = document.querySelectorAll<HTMLElement>('[cs-el="navItem"]');
      const btn_navOpen = document.querySelector<HTMLElement>('[cs-el="navOpen"]');
      const btn_navClose = document.querySelector<HTMLElement>('[cs-el="navClose"]');
      // const brandTagline = document.querySelector<HTMLElement>('[cs-el="brandTagline"]');
      const tl_openMainNav = gsap.timeline({ paused: true });
      // const navIsOpen: boolean = false;

      gsap.set(navMenu, { autoAlpha: 0, bottom: '100%' });
      tl_openMainNav.to(navMenu, { autoAlpha: 1, duration: 0 });
      tl_openMainNav.to(navMenu, {
        bottom: '0%',
        duration: 0.35,
        ease: pageTransition_easeType,
      });
      tl_openMainNav.to(btn_navOpen, { autoAlpha: 0, duration: 0.25 }, '<');
      tl_openMainNav.from(navItems, {
        opacity: 0,
        y: '-2rem',
        stagger: 0.15,
        ease: 'back.out',
      });
      //tl_openMainNav.to(brandTagline, { autoAlpha: 0.5 });
      tl_openMainNav.to(btn_navClose, { autoAlpha: 1, duration: 0.25 }, '<');
      if (navMenu && btn_navOpen && btn_navClose) {
        btn_navOpen.addEventListener('click', () => {
          //startMouseFollower();
          bodyOverflowHidden();
          tl_openMainNav.timeScale(1).play();
        });
        btn_navClose.addEventListener('click', () => {
          //stopMouseFollower();
          bodyOverflowHidden();
          tl_openMainNav.timeScale(2).reverse();
        });
        const tl_closeNavPageTransition = gsap.timeline({ paused: true });
        tl_closeNavPageTransition.to(navItems, { autoAlpha: 0, stagger: 0.15 });
        const activeNavItems = document.querySelectorAll<HTMLElement>(
          '[cs-el="navItem"] > a:not(.w--current)'
        );
        activeNavItems.forEach((item) => {
          item.addEventListener('click', () => {
            tl_closeNavPageTransition.timeScale(1).play();
          });
        });
      }

      // //_______________________________________________________________________________________________________ Page Transition
      // Constant for delay time (in milliseconds)
      const delayTime = 500; // .5 second
      const pageTransitionFade = document.querySelector('[cs-el="pageTransitionFade"]');
      const tl_pageTransition = gsap.timeline({ paused: true });

      // Fade Out on page load
      tl_pageTransition.to(pageTransitionFade, {
        autoAlpha: 1,
        duration: pageTransition_duration,
        top: '100%',
        ease: pageTransition_easeType,
      });
      tl_pageTransition.timeScale(2).play();

      // Function to handle page transitions
      function handlePageTransition(event: MouseEvent): void {
        // Prevent default link behavior
        event.preventDefault();

        // Fade Out
        tl_pageTransition.timeScale(1).reverse();

        // Get the URL of the clicked link
        const url = (event.currentTarget as HTMLAnchorElement).href;

        // Add a delay before navigating to the new URL
        setTimeout(() => {
          // Push a state to the history stack
          history.pushState({}, '', url);
          // Navigate to the new URL
          window.location.href = url;
        }, delayTime);
      }

      // Add event listeners to all links
      document.querySelectorAll('a:not([exclude="true"])').forEach((link) => {
        // Check if the href attribute does not start with '#'
        if (!link.getAttribute('href')?.startsWith('#')) {
          //link.addEventListener('click', handlePageTransition);
          link.addEventListener('click', handlePageTransition as EventListener);
          link.classList.add('delayed');
        }
      });

      // Handle the back button and forward button
      window.addEventListener('popstate', () => {
        // Fade In
        tl_pageTransition.timeScale(1).play();

        // Add a delay before navigating back
        setTimeout(() => {
          window.location.reload();
        }, delayTime);
      });

      //_______________________________________________________________________________________________________ Format Text
      function formatText(text: string): string {
        // Add null/undefined check
        if (!text) {
          // console.warn('No text provided to formatText function');
          return '';
        }

        return text
          .replace(/\[(.*?)\]/g, '<span class="underline">$1</span>')
          .replace(/\{(.*?)\}/g, '<span class="strikedout">$1</span>');
      }

      const allTexts = document.querySelectorAll('[cs-el="landingh1"]');

      allTexts.forEach((text) => {
        text.innerHTML = formatText(text.innerHTML);
      });

      //_______________________________________________________________________________________________________ Modal
      const modal = document.querySelector('[cs-el="modal"]');
      if (modal) {
        gsap.set(modal, { autoAlpha: 1, top: '100%', duration: 0 });
        const tl_openModal = gsap.timeline({ paused: true });
        tl_openModal.to(modal, { duration: 0.5, top: '0%', ease: pageTransition_easeType }, '<');
        const modalPanel = gsap.utils.toArray<HTMLElement>('[cs-el="modalPanel"]');
        const modalHeading = document.querySelector<HTMLElement>('[cs-el="modalHeading"]');
        if (modalHeading) {
          gsap.to(modalHeading, {
            autoAlpha: 1,
            duration: 0,
          });
          new SplitType(modalHeading, { types: 'words' });
        }

        gsap.set(modalPanel, { transformOrigin: 'top center' });
        tl_openModal.from(modalPanel, {
          opacity: 0,
          y: '1rem',
          scaleY: 1.025,
          duration: 1,
          ease: 'power2.out',
        });

        const openModalBtns = gsap.utils.toArray<HTMLElement>('[cs-el="openModal"]');
        if (openModalBtns.length > 0) {
          openModalBtns.forEach((item) => {
            item.addEventListener('click', () => {
              // const switchVar = item.getAttribute('switch');

              // let switchBtn: HTMLInputElement | null = null;
              // switch (switchVar) {
              //   case 'freeBranding':
              //     // Do something if test is 'one'
              //     if (consoleLog) {
              //       console.log('freeBranding');
              //     }
              //     switchBtn = modal.querySelector(
              //       '[form-switch="freeBranding"] > .w-checkbox-input'
              //     );
              //     setTimeout(() => {
              //       switchBtn?.click();
              //       //switchBtn?.classList.add('w--redirected-checked');
              //     }, 750); // 1000 milliseconds = 1 second
              //     break;
              //   case 'fantail':
              //     switchBtn = modal.querySelector('[form-switch="fantail"] > .w-checkbox-input');
              //     setTimeout(() => {
              //       switchBtn?.classList.add('w--redirected-checked');
              //       switchBtn?.click();
              //     }, 550); // 1000 milliseconds = 1 second
              //     break;
              //   case 'discovery':
              //     switchBtn = modal.querySelector('[form-switch="discovery"] > .w-checkbox-input');
              //     setTimeout(() => {
              //       switchBtn?.classList.add('w--redirected-checked');
              //       switchBtn?.click();
              //     }, 550); // 1000 milliseconds = 1 second
              //     break;
              //   default:
              //     // Do something if test is neither 'one' nor 'two'
              //     if (consoleLog) {
              //       ('Default case');
              //     }
              //     break;
              // }

              tl_openModal.timeScale(1).play();
              bodyOverflowHidden();
              if (modalHeading) {
                const words = modalHeading.querySelectorAll('.word');
                gsap.from(words, {
                  opacity: 0,
                  delay: 0.5,
                  y: '2rem',
                  x: '.75rem',
                  duration: 0.5,
                  ease: 'back.out',
                  stagger: 0.1,
                });
              }
            });
          });
        }

        const closeModalBtns = gsap.utils.toArray<HTMLElement>('[cs-el="closeModal"]');
        if (closeModalBtns.length > 0) {
          closeModalBtns.forEach((item) => {
            item.addEventListener('click', () => {
              tl_openModal.timeScale(2).reverse();
              bodyOverflowHidden();
            });
          });
        }
      }

      //_______________________________________________________________________________________________________ Teasers
      const teasers = gsap.utils.toArray<HTMLElement>('[cs-el="teaser"]');
      if (!teasers) return;
      if (teasers.length > 0) {
        teasers.forEach((el) => {
          const teaserTitle = el.querySelector('[cs-el="teaserTitle"]');
          const teaserIcon = el.querySelector('[cs-el="teaserIcon"]');
          //const teaserBgImg = el.querySelector('[cs-el="projectImg"]');
          if (!isDesktop) {
            const teaserTitle = el.querySelector('[cs-el="teaserTitle"]');
            gsap.set(teaserTitle, { opacity: 0 });
            return;
          }
          const tl_teaserHover = gsap.timeline({ paused: true });
          //tl_teaserHover.to(teaserBgImg, { scale: 1.025 }, '<');
          tl_teaserHover.from(
            teaserTitle,
            { duration: 0.25, yPercent: -100, ease: 'power1.in' },
            '<'
          );
          tl_teaserHover.from(teaserIcon, {
            opacity: 0,
            xPercent: -15,
            ease: 'back.out',
            duration: 1,
          });
          // tl_teaserHover.from(
          //   teaserTitle.children,
          //   { xPercent: 0, opacity: 0, duration: 0.3, ease: 'linear' },
          //   '<.15'
          // );
          el.addEventListener('mouseover', () => {
            tl_teaserHover.timeScale(1).play();
          });
          el.addEventListener('mouseout', () => {
            tl_teaserHover.timeScale(2).reverse();
          });
        });
      }
      //_______________________________________________________________________________________________________ Split Types

      const splitTypes = gsap.utils.toArray<HTMLElement>('[cs-el="splitType"]');
      if (splitTypes.length > 0) {
        gsap.to(splitTypes, {
          autoAlpha: 1,
          duration: 0,
        });
        splitTypes.forEach((el) => {
          const splitType = new SplitType(el, { types: 'words,chars' });
          gsap.from(splitType.words, {
            opacity: 0,
            y: '2rem',
            x: '.75rem',
            duration: 0.5,
            ease: 'power.out',
            stagger: { amount: 0.5 },
            scrollTrigger: {
              trigger: el,
              start: '25% bottom',
              end: 'top center',
              scrub: false,
            },
          });
        });
      }

      //_______________________________________________________________________________________________________ Form Elements
      // Add/remove class on click Form Checkboxes
      const formCheckboxes = gsap.utils.toArray<HTMLElement>('.w-checkbox');
      if (formCheckboxes.length > 0) {
        formCheckboxes.forEach((el) => {
          // Define the event handler function
          function handleCheckboxClick() {
            if (el.classList.contains('is-checked')) {
              el.classList.remove('is-checked');
            } else {
              el.classList.add('is-checked');
            }
          }

          // Add a different event type, such as 'mousedown', to handle the click
          el.addEventListener('mousedown', handleCheckboxClick);
        });
      }

      // Add/remove class on click Form Radio Buttons
      const formRadioBtns = gsap.utils.toArray<HTMLElement>('.w-radio');
      if (formRadioBtns.length > 0) {
        formRadioBtns.forEach((el) => {
          // Define the event handler function
          function handleRadioClick() {
            formRadioBtns.forEach((radio) => {
              // Remove the 'is-checked' class from all radio buttons
              radio.classList.remove('is-checked');
            });

            // Add the 'is-checked' class to the clicked radio button
            el.classList.add('is-checked');
          }

          // Add a click event listener to the element
          el.addEventListener('click', handleRadioClick);
        });
      }
      //_______________________________________________________________________________________________________ Animate all images when fully loaded
      function fadeInImages() {
        // Select all images on the page
        const images = document.querySelectorAll<HTMLImageElement>('img:not([exclude="true"])');

        images.forEach((image) => {
          // Check if the image is already loaded
          if (image.complete && image.naturalHeight !== 0) {
            // Image is already loaded, apply fade-in animation
            gsap.fromTo(image, { opacity: 0 }, { opacity: 1, duration: global_imgsFadeInDuration });
          } else {
            // Image is not yet loaded, add an event listener
            image.addEventListener('load', () => {
              // Apply fade-in animation when image is fully loaded
              gsap.fromTo(
                image,
                { opacity: 0 },
                { opacity: 1, duration: global_imgsFadeInDuration }
              );
            });
          }
        });
      }
      fadeInImages();
      //_______________________________________________________________________________________________________ Scrolltriggers

      // Animate elements On Page Load
      const onPageLoadElms = gsap.utils.toArray<HTMLElement>('[st*="on-pageload"]');
      if (onPageLoadElms.length > 0) {
        gsap.from(onPageLoadElms, {
          autoAlpha: 0,
          yPercent: 10,
          duration: 1,
          ease: global_easeType,
          stagger: 0.25,
        });
      }
      // // Scrolltrigger elements On Enter Viewport
      // const scrolltriggerOnEnterElms = gsap.utils.toArray<HTMLElement>('[st*="scroll-in"]');
      // if (scrolltriggerOnEnterElms.length > 0) {
      //   scrolltriggerOnEnterElms.forEach((el) => {
      //     gsap.from(el, {
      //       autoalpha: 0,
      //       duration: 1,
      //       yPercent: 10,
      //       ease: 'sin.out',
      //       scrollTrigger: {
      //         trigger: el,
      //         start: 'top bottom',
      //         end: 'top 70%',
      //         scrub: false,
      //       },
      //     });
      //   });
      // }

      // Scrolltrigger elements On Enter Viewport
      const scrolltriggerDropElms = gsap.utils.toArray<HTMLElement>('[st*="drop"]');
      if (scrolltriggerDropElms.length > 0) {
        scrolltriggerDropElms.forEach((el) => {
          gsap.from(el, {
            autoalpha: 0,
            duration: 1,
            yPercent: -10,
            ease: 'sine.out',
            stagger: 0.25,
          });
        });
      }

      // Scrolltrigger paralax auto
      const st_paralaxBgElms = gsap.utils.toArray<HTMLElement>('[st*="paralax-bg"]');
      if (st_paralaxBgElms.length > 0) {
        st_paralaxBgElms.forEach((el) => {
          gsap.to(el, {
            yPercent: 20,
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 },
          });
        });
      }

      //_______________________________________________________________________________________________________ Loop Project Teasers/Images
      const loopWrapper = document.querySelector<HTMLElement>('[cs-el="loopWrapper"]');
      const projectImgList = document.querySelector<HTMLElement>('[cs-el="projectImgList"]');
      const projectImgItems = document.querySelectorAll<HTMLElement>('[cs-el="projectImgItem"]');
      const toolTip = document.querySelector<HTMLElement>('[cs-el="toolTip"]');
      const visibleProjectImgItems = Array.from(projectImgItems).filter(
        (img) => !img.closest('.w-condition-invisible')
      );

      let tl_pLoop: GSAPTimeline;
      let vertical: boolean = true;
      vertical = true;

      if (loopWrapper?.classList.contains('horizontal') || isTablet) {
        vertical = false;
      }
      // if (isTablet) {
      //   vertical = false;
      // }
      // loopWrapper
      // > projectImgList
      // >> projectImgItem

      // Tease on pageLoad
      if (!vertical) {
        // Horizontal Loop Items on Page load
        gsap.from(visibleProjectImgItems, {
          opacity: 0,
          x: '5rem',
          ease: 'power3.out',
          delay: 0.35,
          duration: 1,
          stagger: 0.1,
        });
      }
      // Init Loop Function:
      function initProjectLoop(vertical: boolean) {
        if (vertical) {
          tl_pLoop = verticalLoop(visibleProjectImgItems, {
            repeat: -1,
            speed: 0.25,
            paused: false,
            center: true,
            draggable: false,
          });
          const slowDown = gsap.to(tl_pLoop, {
            timeScale: 1,
            duration: 1,
            delay: 0.5,
            ease: 'expo.out',
          });
          ScrollTrigger.observe({
            target: 'body',
            type: 'pointer,touch,wheel',
            wheelSpeed: 1,
            onChangeY: (self) => {
              tl_pLoop.timeScale(self.deltaY);
              toolTip?.remove();
              // const scaleYfactor = self.deltaY / 2000 + 1;
              // gsap.to(loopWrapper, {
              //   ease: 'none',
              //   // duration: 0.2,
              //   // ...scaleProperties,
              //   scaleY: scaleYfactor,
              // });
            },
            onStop: () => {
              slowDown.invalidate().restart(); // now decelerate
            },
          });
        } else {
          // Horizontal Loop
          const itemWidth = isDesktop ? 45 : isTablet ? 70 : 55; // Align with WF variables
          const snapValue = convertVwToPixels(itemWidth);
          Draggable.create(projectImgList, {
            type: 'x',
            bounds: loopWrapper,
            inertia: true,
            edgeResistance: 0.5,
            snap: {
              x: gsap.utils.snap(snapValue),
            },
            onDragStart: () => {
              toolTip?.remove();
            },
            throwResistance: 10,
            // dragResistance: 0.25,
            maxDuration: 0.5,
          });
        }
      }

      function convertVwToPixels(vw: number): number {
        // Calculate 1% of the window width in pixels
        const onePercentOfWindowWidth = window.innerWidth / 100;
        // Convert vw to pixels
        const pixels = vw * onePercentOfWindowWidth;
        return pixels;
      }

      //_______________________________________________________________________________________________________ Page Init Function
      let pageInitCalled = false;
      function pageInit() {
        if (pageInitCalled) return;
        if (loopWrapper) {
          if (isDesktop) {
            if (vertical) {
              gsap.set('[cs-el="projectImg"]', { opacity: 0, y: '4rem' });
            }
            waitForImages('[cs-el="projectImg"]').then((imagesLoaded) => {
              if (imagesLoaded) {
                initProjectLoop(vertical);
                if (vertical) {
                  gsap.to('[cs-el="projectImg"]', { delay: 0.2, opacity: 1, y: 0, stagger: 0.25 });
                }
              }
            });
          }
          if (isTablet) {
            vertical = false;
            waitForImages('[cs-el="projectImg"]').then((imagesLoaded) => {
              if (imagesLoaded) {
                initProjectLoop(vertical);
              }
            });
          }
        }
        pageInitCalled = true;
      } // End: function pageInit()

      //_______________________________________________________________________________________________________ Init imported Functions
      initSliders();
      //initMarquees();

      //_______________________________________________________________________________________________________ Add window EventListeners
      window.addEventListener('resize', () => {
        // pageInit();
      });
      window.addEventListener('load', () => {
        pageInit();
      });
      pageInit();
      //_______________________________________________________________________________________________________ MM end bit
    }
  ); // End matchMedia context function
}); // End Webflow.push
