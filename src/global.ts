import { gsap } from 'gsap';
export { gsap };

import { ScrollTrigger } from 'gsap/ScrollTrigger';
export { ScrollTrigger };
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

import SplitType from 'split-type';
import { initMarquees } from 'src/components/marquees';
import { initSliders } from 'src/components/sliders';

//import { horizontalLoop } from './helpers/gsapHorizontalLoop';
import { verticalLoop } from './helpers/gsapVerticalLoop';
import { waitForImages } from './helpers/psWaitForImages';

const global_easeType = 'back.out';
const global_imgsFadeInDuration = 1;

const pageTransition_easeType = 'power4.in';
const pageTransition_duration = 0.5;

export let exp_isDestop: boolean = false;

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Window Focus

  // Function to handle when the user leaves the page
  function handleUserLeaves() {
    console.log('User has left the page.');
    gsap.globalTimeline.pause();
  }

  // Function to handle when the user returns to the page
  function handleUserReturns() {
    console.log('User has returned to the page.');
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
  const breakPointMob = 768;

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isTablet: `(max-width: ${breakPoint - 1}px)`,
      isMobile: `(max-width: ${breakPointMob - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions;
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
      const brandTagline = document.querySelector<HTMLElement>('[cs-el="brandTagline"]');
      const tl_openMainNav = gsap.timeline({ paused: true });
      const navIsOpen: boolean = false;

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
        // btn_navOpen.addEventListener('click', () => {
        //   if (navIsOpen === false) {
        //     navIsOpen = true;
        //     tl_openMainNav.timeScale(1).play();
        //   } else {
        //     navIsOpen = false;
        //     tl_openMainNav.timeScale(1.5).reverse();
        //   }
        // });
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
      //_______________________________________________________________________________________________________ PS
      // const brandWrap = document.querySelector<HTMLElement>('[cs-el="brandWrap"]');
      // const psLetters = document.querySelectorAll<HTMLElement>('[cs-el="psLetter"]');
      // const psPlay = gsap.timeline({ paused: true });
      // gsap.set(psLetters, { width: 0, opacity: 0, x: '-100px' });
      // gsap.set(brandWrap, { transformOrigin: 'left' });
      // // psLetters.forEach((item, i) => {
      // //   gsap.to(item, { x: 4 * (i * 50), width: 'auto', duration: 0.15, ease: 'back.out' });
      // // });
      // const psDuration = 0.1;
      // const psStagger = 0.08;
      // psPlay.to(psLetters, {
      //   x: '0',
      //   width: 'auto',
      //   opacity: 1,
      //   duration: psDuration,
      //   stagger: psStagger,
      //   ease: 'back.out',
      // });
      // psPlay.to(
      //   brandWrap,
      //   {
      //     x: '0.75rem',
      //     scaleX: 1.05,
      //     yoyo: true,
      //     repeat: 1,
      //     duration: psDuration / 2 + 3 * psStagger,
      //     ease: 'power.out',
      //   },
      //   '<'
      // );
      // brandWrap?.addEventListener('mouseenter', () => {
      //   psPlay.timeScale(1).play();
      // });
      // brandWrap?.addEventListener('mouseleave', () => {
      //   psPlay.timeScale(3).reverse();
      // });
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

      // // Constant for delay time (in milliseconds)
      // const delayTime = 500; // .5 second
      // const pageTransitionFade = document.querySelector('[cs-el="pageTransitionFade"]');
      // const tl_pageTransition = gsap.timeline({ paused: true });
      // // Fade Out on page load
      // tl_pageTransition.to(pageTransitionFade, {
      //   autoAlpha: 1,
      //   duration: pageTransition_duration,
      //   top: '100%',
      //   ease: pageTransition_easeType,
      // });
      // tl_pageTransition.timeScale(1).play();

      // // Function to handle page transitions
      // function handlePageTransition(event: MouseEvent) {
      //   // Prevent default link behavior
      //   event.preventDefault();

      //   // Fade Out
      //   tl_pageTransition.timeScale(1.5).reverse();

      //   // Get the URL of the clicked link
      //   const url = (event.currentTarget as HTMLAnchorElement).href;

      //   // Add a delay before navigating to the new URL
      //   setTimeout(() => {
      //     window.location.href = url;
      //   }, delayTime);
      // }

      // // Add event listeners to all links
      // document.querySelectorAll('a').forEach((link) => {
      //   // Check if the href attribute does not start with '#'
      //   if (!link.getAttribute('href')?.startsWith('#')) {
      //     link.addEventListener('click', handlePageTransition);
      //     link.classList.add('delayed');
      //   }
      // });
      //_______________________________________________________________________________________________________ Mouse Trail

      // const svgns = 'http://www.w3.org/2000/svg';
      // const root = document.createElementNS(svgns, 'svg');
      // root.setAttribute('width', window.innerWidth.toString());
      // root.setAttribute('height', window.innerHeight.toString());
      // const trailWrapper = document.querySelector('.mousetrail-wrap');
      // const on = false;

      // function startMouseFollower() {
      //   if (!trailWrapper) return;
      //   trailWrapper.appendChild(root);

      //   gsap.to(trailWrapper, { opacity: 1, delay: 0.75, duration: 1 });
      //   const ease = 0.75;

      //   const pointer = {
      //     x: window.innerWidth / 2,
      //     y: window.innerHeight / 2,
      //   };

      //   window.addEventListener('mousemove', updatePointer);

      //   let leader = (prop) => (prop === 'x' ? pointer.x : pointer.y);

      //   const total = 30;
      //   for (let i = 0; i < total; i++) {
      //     leader = createLine(leader);
      //   }
      //   const primaryColor = '#fb5751';
      //   function createLine(leader) {
      //     const line = document.createElementNS(svgns, 'line');
      //     line.setAttribute('stroke', '#fb5751');
      //     line.setAttribute('stroke-width', '8');
      //     line.setAttribute('stroke-linecap', 'round');

      //     root.appendChild(line);

      //     const pos = gsap.getProperty(line);
      //     gsap.set(trailWrapper, { opacity: 0 });
      //     gsap.to(line, {
      //       duration: 10000,
      //       x: '+=150',
      //       y: '+=10',
      //       repeat: -1,
      //       ease: 'expo.out',
      //       opacity: 0,
      //       modifiers: {
      //         x: () => {
      //           const posX = pos('x');
      //           const leaderX = leader('x');
      //           const x = posX + (leaderX - posX) * ease;
      //           line.setAttribute('x2', leaderX - x);
      //           return x;
      //         },
      //         y: () => {
      //           const posY = pos('y');
      //           const leaderY = leader('y');
      //           const y = posY + (leaderY - posY) * ease;
      //           line.setAttribute('y2', leaderY - y);
      //           return y;
      //         },
      //       },
      //     });

      //     return pos;
      //   }

      //   function updatePointer(event) {
      //     pointer.x = event.clientX;
      //     pointer.y = event.clientY;
      //   }
      // }

      // function stopMouseFollower() {
      //   gsap.to(trailWrapper, { opacity: 0, delay: 0, duration: 0.25 });
      //   // while (root.firstChild) {
      //   //   root.removeChild(root.firstChild);
      //   // }
      //   // window.removeEventListener('mousemove', updatePointer);
      //   // if (trailWrapper) {
      //   //   trailWrapper.removeChild(root);
      //   // }
      // }

      // if (on) {
      //   startMouseFollower();
      // }
      //_______________________________________________________________________________________________________ Cookie Consent
      // const consent = document.querySelector('[cs-el="consent"]');
      // if (consent) {
      //   gsap.set(consent, { opacity: 0, yPercent: 200 });
      //   gsap.to(consent, { opacity: 1, delay: 1, yPercent: 0 });
      //   const closeConsent = consent.querySelector('[cs-el="closeConsent"]');
      //   closeConsent?.addEventListener('click', () => {
      //     gsap.to(consent, {
      //       opacity: 0,
      //       yPercent: 200,
      //       onComplete: () => {
      //         consent.remove();
      //       },
      //     });
      //   });
      // }

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
              const switchVar = item.getAttribute('switch');
              let switchBtn: HTMLInputElement | null = null;
              switch (switchVar) {
                case 'freeBranding':
                  // Do something if test is 'one'
                  console.log('freeBranding');
                  switchBtn = modal.querySelector(
                    '[form-switch="freeBranding"] > .w-checkbox-input'
                  );
                  setTimeout(() => {
                    switchBtn?.click();
                    //switchBtn?.classList.add('w--redirected-checked');
                  }, 750); // 1000 milliseconds = 1 second
                  break;
                case 'fantail':
                  switchBtn = modal.querySelector('[form-switch="fantail"] > .w-checkbox-input');
                  setTimeout(() => {
                    switchBtn?.classList.add('w--redirected-checked');
                  }, 550); // 1000 milliseconds = 1 second
                  break;
                default:
                  // Do something if test is neither 'one' nor 'two'
                  console.log('Default case');
                  break;
              }

              tl_openModal.timeScale(1).play();
              bodyOverflowHidden();
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
            });
          });
          // Form Submit logic to close modal after submit
          // const contactForm = document.getElementById('Contact-Form') as HTMLFormElement;

          // if (contactForm) {
          //   const formSuccess = document.querySelector<HTMLElement>('[cs-el="formSuccess"]');
          //   contactForm.addEventListener('submit', function (event) {
          //     //event.preventDefault(); // Prevent the default form submission
          //     // Simulate form submission processing
          //     const tl_closeModalClone = tl_openModal;
          //     tl_closeModalClone.eventCallback('onComplete', handleFormReset);
          //     setTimeout(function () {
          //       tl_closeModalClone.timeScale(2).reverse();
          //     }, 2000);
          //     function handleFormReset() {
          //       resetForm(contactForm);
          //     }
          //   });
          //   function resetForm(form: HTMLFormElement) {
          //     bodyOverflowHidden();
          //     form.reset(); // Reset the form fields

          //     form
          //       .querySelectorAll<HTMLElement>('.is-checked, .w--redirected-checked')
          //       .forEach((element) => {
          //         //element.click();
          //         element.classList.remove('is-checked');
          //         element.classList.remove('w--redirected-checked');
          //       });
          //     console.log(formSuccess);
          //     if (formSuccess) {
          //       formSuccess.style.display = 'none';
          //     }
          //     form.style.display = 'block';
          //   }
          // }
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
          const splitType = new SplitType(el, { types: 'words, chars' });
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
          // const tl_scaleY = gsap.timeline({ paused: true });
          // tl_scaleY.from(loopWrapper, {
          //   ease: 'none',
          //   scaleY: 1.3,
          // });

          ScrollTrigger.observe({
            target: 'body',
            type: 'pointer,touch,wheel',
            wheelSpeed: 1,
            onChangeY: (self) => {
              tl_pLoop.timeScale(self.deltaY);
              //const easeType = 'expo.out';
              const scaleYfactor = self.deltaY / 750 + 1;
              // console.log(self.deltaY);
              // console.log((self.deltaY / 750 + 1).toFixed(2));
              // if (isDesktop) {
              //   gsap.to(loopWrapper, { ease: 'none', scaleY: scaleYfactor });
              // }
              // if (isTablet) {
              //   gsap.to(loopWrapper, { ease: 'none', scaleX: scaleYfactor });
              // }

              // const scaleProperties = isDesktop
              //   ? { scaleY: scaleYfactor }
              //   : { scaleX: scaleYfactor };

              //if (Object.keys(scaleProperties).length > 0) {
              gsap.to(loopWrapper, {
                ease: 'none',
                // duration: 0.2,
                // ...scaleProperties,
                scaleY: scaleYfactor,
              });
              //console.log(loopWrapper);
              //}
            },
            onStop: (self) => {
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
      //   let timeline;
      //   items = gsap.utils.toArray(items);
      //   config = config || {};
      //   gsap.context(() => {
      //     let { onChange } = config,
      //       lastIndex = 0,
      //       tl = gsap.timeline({
      //         repeat: config.repeat,
      //         onUpdate:
      //           onChange &&
      //           function () {
      //             const i = tl.closestIndex();
      //             if (lastIndex !== i) {
      //               lastIndex = i;
      //               onChange(items[i], i);
      //             }
      //           },
      //         paused: config.paused,
      //         defaults: { ease: 'none' },
      //         onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
      //       }),
      //       { length } = items,
      //       startY = items[0].offsetTop,
      //       times = [],
      //       heights = [],
      //       spaceBefore = [],
      //       yPercents = [],
      //       curIndex = 0,
      //       { center } = config,
      //       clone = (obj) => {
      //         let result = {},
      //           p;
      //         for (p in obj) {
      //           result[p] = obj[p];
      //         }
      //         return result;
      //       },
      //       pixelsPerSecond = (config.speed || 1) * 100,
      //       snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
      //       timeOffset = 0,
      //       container =
      //         center === true
      //           ? items[0].parentNode
      //           : gsap.utils.toArray(center)[0] || items[0].parentNode,
      //       totalHeight,
      //       getTotalHeight = () =>
      //         items[length - 1].offsetTop +
      //         (yPercents[length - 1] / 100) * heights[length - 1] -
      //         startY +
      //         spaceBefore[0] +
      //         items[length - 1].offsetHeight * gsap.getProperty(items[length - 1], 'scaleY') +
      //         (parseFloat(config.paddingBottom) || 0),
      //       populateHeights = () => {
      //         let b1 = container.getBoundingClientRect(),
      //           b2;
      //         startY = items[0].offsetTop;
      //         items.forEach((el, i) => {
      //           heights[i] = parseFloat(gsap.getProperty(el, 'height', 'px'));
      //           yPercents[i] = snap(
      //             (parseFloat(gsap.getProperty(el, 'y', 'px')) / heights[i]) * 100 +
      //               gsap.getProperty(el, 'yPercent')
      //           );
      //           b2 = el.getBoundingClientRect();
      //           spaceBefore[i] = b2.top - (i ? b1.bottom : b1.top);
      //           b1 = b2;
      //         });
      //         gsap.set(items, {
      //           // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      //           yPercent: (i) => yPercents[i],
      //         });
      //         totalHeight = getTotalHeight();
      //       },
      //       timeWrap,
      //       populateOffsets = () => {
      //         timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalHeight : 0;
      //         center &&
      //           times.forEach((t, i) => {
      //             times[i] = timeWrap(
      //               tl.labels['label' + i] +
      //                 (tl.duration() * heights[i]) / 2 / totalHeight -
      //                 timeOffset
      //             );
      //           });
      //       },
      //       getClosest = (values, value, wrap) => {
      //         let i = values.length,
      //           closest = 1e10,
      //           index = 0,
      //           d;
      //         while (i--) {
      //           d = Math.abs(values[i] - value);
      //           if (d > wrap / 2) {
      //             d = wrap - d;
      //           }
      //           if (d < closest) {
      //             closest = d;
      //             index = i;
      //           }
      //         }
      //         return index;
      //       },
      //       populateTimeline = () => {
      //         let i, item, curY, distanceToStart, distanceToLoop;
      //         tl.clear();
      //         for (i = 0; i < length; i++) {
      //           item = items[i];
      //           curY = (yPercents[i] / 100) * heights[i];
      //           distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
      //           distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, 'scaleY');
      //           tl.to(
      //             item,
      //             {
      //               yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100),
      //               duration: distanceToLoop / pixelsPerSecond,
      //             },
      //             0
      //           )
      //             .fromTo(
      //               item,
      //               { yPercent: snap(((curY - distanceToLoop + totalHeight) / heights[i]) * 100) },
      //               {
      //                 yPercent: yPercents[i],
      //                 duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond,
      //                 immediateRender: false,
      //               },
      //               distanceToLoop / pixelsPerSecond
      //             )
      //             .add('label' + i, distanceToStart / pixelsPerSecond);
      //           times[i] = distanceToStart / pixelsPerSecond;
      //         }
      //         timeWrap = gsap.utils.wrap(0, tl.duration());
      //       },
      //       customAnimations = () => {
      //         let { enterAnimation, leaveAnimation } = config,
      //           eachDuration = tl.duration() / items.length;
      //         items.forEach((item, i) => {
      //           let anim = enterAnimation && enterAnimation(item, eachDuration, i),
      //             isAtEnd =
      //               anim &&
      //               tl.duration() - timeWrap(times[i] - Math.min(eachDuration, anim.duration())) <
      //                 eachDuration - 0.05;
      //           anim && tl.add(anim, isAtEnd ? 0 : timeWrap(times[i] - anim.duration()));
      //           anim = leaveAnimation && leaveAnimation(item, eachDuration, i);
      //           isAtEnd = times[i] === tl.duration();
      //           anim && anim.duration() > eachDuration && anim.duration(eachDuration);
      //           anim && tl.add(anim, isAtEnd ? 0 : times[i]);
      //         });
      //       },
      //       refresh = (deep) => {
      //         const progress = tl.progress();
      //         tl.progress(0, true);
      //         populateHeights();
      //         deep && populateTimeline();
      //         populateOffsets();
      //         customAnimations();
      //         //deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
      //       },
      //       onResize = () => refresh(true),
      //       proxy;
      //     gsap.set(items, { y: 0 });
      //     populateHeights();
      //     populateTimeline();
      //     populateOffsets();
      //     customAnimations();
      //     window.addEventListener('resize', onResize);
      //     function toIndex(index, vars) {
      //       vars = clone(vars);
      //       Math.abs(index - curIndex) > length / 2 &&
      //         (index += index > curIndex ? -length : length); // always go in the shortest direction
      //       let newIndex = gsap.utils.wrap(0, length, index),
      //         time = times[newIndex];
      //       if (time > tl.time() !== index > curIndex) {
      //         // if we're wrapping the timeline's playhead, make the proper adjustments
      //         time += tl.duration() * (index > curIndex ? 1 : -1);
      //       }
      //       if (vars.revolutions) {
      //         time += tl.duration() * Math.round(vars.revolutions);
      //         delete vars.revolutions;
      //       }
      //       if (time < 0 || time > tl.duration()) {
      //         vars.modifiers = { time: timeWrap };
      //       }
      //       curIndex = newIndex;
      //       vars.overwrite = true;
      //       gsap.killTweensOf(proxy);
      //       return tl.tweenTo(time, vars);
      //     }
      //     tl.elements = items;
      //     tl.next = (vars) => toIndex(curIndex + 1, vars);
      //     tl.previous = (vars) => toIndex(curIndex - 1, vars);
      //     tl.current = () => curIndex;
      //     tl.toIndex = (index, vars) => toIndex(index, vars);
      //     tl.closestIndex = (setCurrent) => {
      //       const index = getClosest(times, tl.time(), tl.duration());
      //       setCurrent && (curIndex = index);
      //       return index;
      //     };
      //     tl.times = times;
      //     tl.progress(1, true).progress(0, true); // pre-render for performance
      //     if (config.reversed) {
      //       tl.vars.onReverseComplete();
      //       tl.reverse();
      //     }

      //     tl.closestIndex(true);
      //     onChange && onChange(items[curIndex], curIndex);
      //     timeline = tl;
      //     return () => window.removeEventListener('resize', onResize); // cleanup
      //   });
      //   return timeline;
      // }
      //_______________________________________________________________________________________________________ Page Loader
      // Function to initialize the page loader
      function initPageLoader() {
        // Select the page loader and loader bar elements
        const pageLoader = document.querySelector<HTMLElement>('[cs-el="pageLoader"]');
        const pageLoaderBar = pageLoader?.querySelector<HTMLElement>('[cs-el="pageLoaderBar"]');
        const pageLoaderNumber = pageLoader?.querySelector<HTMLElement>(
          '[cs-el="pageLoaderNumber"]'
        );
        if (pageLoader && pageLoaderBar) {
          let loaderDuration = 0.25;
          let counter = { value: 0 };

          // Check if it's not a first-time visit in this tab
          if (sessionStorage.getItem('visited') !== null) {
            loaderDuration = 0.25;
            counter = {
              value: 75,
            };
          }
          sessionStorage.setItem('visited', 'true');

          function updateLoaderText() {
            const progress = Math.round(counter.value);
            if (pageLoaderNumber) {
              pageLoaderNumber.textContent = progress.toString();
            }
          }

          function endLoaderAnimation() {
            pageLoader?.remove();
          }

          const tl = gsap.timeline({
            onComplete: endLoaderAnimation,
          });

          tl.to(counter, {
            value: 100,
            onUpdate: updateLoaderText,
            duration: loaderDuration,
            ease: 'none',
          });

          tl.to(
            pageLoaderBar,
            {
              width: '100%',
              duration: loaderDuration,
              ease: 'none',
            },
            0
          );
        }
      }
      //initPageLoader();

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
      return () => {}; // Return MM ??
    } // End: MM Context
  ); // End: MM
}); // End: Webflow Push
