import './global';

//import { Draggable } from 'gsap/Draggable';
//import { Observer } from 'gsap/Observer';
//gsap.registerPlugin(Observer);
// gsap.registerPlugin(ScrollTrigger);
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { exp_isDestop } from './global';
import { gsap } from './global';

window.Webflow ||= [];
window.Webflow.push(() => {
  const isDesktop: boolean = exp_isDestop;
  //console.log('isDT >' + exp_isDestop);

  //_______________________________________________________________________________________________________ Add current class to nav link
  const navLink = document.getElementById('nav_projects');
  navLink?.classList.add('is-active');

  //_______________________________________________________________________________________________________ Collection List Navigation
  const projectNavLinksBlock = document.querySelector<HTMLElement>('[cs-el="projectNavLinks"]');
  const projectNavBlock = document.querySelector<HTMLElement>('[cs-el="projectNavBlock"]');
  const projectInfo = document.querySelector<HTMLElement>('[cs-el="projectInfo"]');
  if (projectNavLinksBlock && projectInfo) {
    const projectNavLinks = projectNavLinksBlock.querySelectorAll<HTMLElement>(
      '[cs-el="projectNavLink"]'
    );
    const currentItem = projectNavLinksBlock.querySelector<HTMLElement>(
      '[cs-el="projectNavLink"].w--current'
    );

    const btn_openProjectNav = document.querySelector<HTMLElement>('[cs-el="openProjectNav"]');
    const projectNavText = document.querySelector<HTMLElement>('[cs-el="projectNavText"]');
    const btn_projectNext = document.querySelector('[cs-el="projectNavNext"] > a');
    const btn_projectPrevious = document.querySelector('[cs-el="projectNavPrevious"] > a');

    if (!btn_projectNext || !btn_projectPrevious || !btn_openProjectNav || !projectNavText) return;

    // GSAP Set init values
    gsap.set(projectNavText, { autoAlpha: 0 });
    const tl_hideNavText = gsap.timeline({ paused: true });
    function showProjectTargetTxt(element: HTMLElement, text: string) {
      tl_hideNavText.progress(1);
      element.textContent = text;
      gsap.to(projectNavText, { autoAlpha: 1, duration: 0.75 });
    }
    function hideProjectTargetTxt(element: HTMLElement) {
      tl_hideNavText
        .to(projectNavText, {
          autoAlpha: 0,
          duration: 0.25,
          onComplete: () => {
            element.textContent = '';
          },
        })
        .play();
    }

    // Mouse Over for Open Project Nav btn
    btn_openProjectNav?.addEventListener('mouseenter', () => {
      showProjectTargetTxt(projectNavText, 'All Projects');
    });
    btn_openProjectNav?.addEventListener('mouseleave', () => {
      hideProjectTargetTxt(projectNavText);
    });

    // Open Project Nav timeline
    const tl_openProjectNav = gsap.timeline({ paused: true });
    tl_openProjectNav.to(projectNavLinksBlock, { autoAlpha: 1, duration: 0 });
    tl_openProjectNav.to([projectInfo, projectNavBlock], {
      autoAlpha: 0,
      ease: 'power.out',
      duration: 0.5,
    });
    tl_openProjectNav.from(
      projectNavLinks,
      {
        opacity: 0,
        x: '-20vw',
        stagger: -0.04,
        duration: 0.5,
        ease: 'back.out',
      },
      '<.25'
    );
    // Add the onComplete callback to tl_openNav to play tl_hoverNavLink
    tl_openProjectNav.eventCallback('onComplete', () => {
      // Setup hover for Nav links
      projectNavLinks.forEach((item) => {
        const tl_hoverNavLink = gsap.timeline({ paused: true });
        tl_hoverNavLink.to(item, { x: '0.5rem', ease: 'back.out' });
        item.addEventListener('mouseenter', () => {
          tl_hoverNavLink.timeScale(1).play();
        });
        item.addEventListener('mouseleave', () => {
          tl_hoverNavLink.timeScale(1.5).reverse();
        });
      });
    });
    // Add event listeners to Open Project Nav
    btn_openProjectNav?.addEventListener('click', () => {
      tl_openProjectNav.timeScale(1).play();
    });
    projectNavLinksBlock?.addEventListener('mouseleave', () => {
      tl_openProjectNav.timeScale(2).reverse();
    });

    if (currentItem) {
      const nextItem = currentItem.closest('[cs-el="projectNavItem"]')?.nextElementSibling;

      if (nextItem) {
        const nextItemLink = nextItem.querySelector('[cs-el="projectNavLink"]');
        const nextItemUrl = nextItemLink?.getAttribute('href');
        console.log('nxtlink: ' + nextItemLink);
        console.log('nxtUrl: ' + nextItemUrl);

        if (nextItemUrl) {
          btn_projectNext.setAttribute('href', nextItemUrl);
        } else {
          gsap.to(btn_projectNext, { autoAlpha: 0, duration: 1 });
        }
      } else {
        gsap.to(btn_projectNext, { autoAlpha: 0, duration: 1 });
      }

      const previousItem = currentItem.closest('[cs-el="projectNavItem"]')?.previousElementSibling;
      console.log(previousItem);
      console.log(btn_projectPrevious);
      console.log(document.querySelectorAll('[cs-el="projectNavPrevious"]').length);

      if (previousItem) {
        const previousItemLink = previousItem.querySelector('[cs-el="projectNavLink"]');
        const previousItemUrl = previousItemLink?.getAttribute('href');
        console.log('prevlink: ' + previousItemLink);
        console.log('prevurl: ' + previousItemUrl);
        if (previousItemUrl) {
          console.log('href set');
          btn_projectPrevious.classList.add('lolly');
          btn_projectPrevious.setAttribute('href', previousItemUrl);
        } else {
          gsap.to(btn_projectPrevious, { autoAlpha: 0, duration: 1 });
        }
      } else {
        gsap.to(btn_projectPrevious, { autoAlpha: 0, duration: 1 });
      }

      btn_projectNext?.addEventListener('mouseenter', () => {
        //console.log(btn_projectNext);
        //if (btn_projectNext.textContent) {
        showProjectTargetTxt(projectNavText, 'Next Project');
        //}
      });
      btn_projectNext?.addEventListener('mouseleave', () => {
        hideProjectTargetTxt(projectNavText);
      });
      btn_projectPrevious?.addEventListener('mouseenter', () => {
        //if (btn_projectPrevious.textContent) {
        showProjectTargetTxt(projectNavText, 'Previous Project');
        //}
      });
      btn_projectPrevious?.addEventListener('mouseleave', () => {
        hideProjectTargetTxt(projectNavText);
      });
    }
  }
  //_______________________________________________________________________________________________________ Mouse follower Scroll Indicator

  // Select the elements
  // const scrollFollower = document.querySelector('[cs-el="scrollFollower"]');
  // const pElement = document.querySelector('.project_collection');

  // if (scrollFollower && pElement) {
  //   // Add mousemove event listener to the pElement
  //   pElement.addEventListener('mousemove', (event) => {
  //     // Get the mouse position relative to the viewport
  //     const mouseX = event.clientX;
  //     const mouseY = event.clientY;

  //     // Use GSAP to animate the position of the scrollFollower
  //     gsap.to(scrollFollower, {
  //       x: mouseX,
  //       y: mouseY,
  //       delay: 0.05,
  //       ease: 'back.out',
  //     });
  //   });
  // }

  //_______________________________________________________________________________________________________ Scrolltrigger Pin Elements
  const pinElement = document.querySelector('[cs-el="pin"]');
  const pinParent = document.querySelector('[cs-el="pinParent"]');
  const st = ScrollTrigger.create({
    trigger: pinParent,
    pin: pinElement,
    start: 'top top',
    end: 'bottom 2rem',
  });
}); // End: Webflow Push
