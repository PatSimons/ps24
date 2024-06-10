// Animate elements On Page Load
const onPageLoadElms = gsap.utils.toArray<HTMLElement>('[st*="pageload"]');
if (onPageLoadElms.length > 0) {
  gsap.to(onPageLoadElms, {
    autoAlpha: 1,
    duration: globalDuration,
    ease: globalEase,
    stagger: 0.25,
  });
}
// Scrolltrigger elements On Enter Viewport
const scrolltriggerOnEnterElms = gsap.utils.toArray<HTMLElement>('[st*="scroll-in"]');
if (scrolltriggerOnEnterElms.length > 0) {
  scrolltriggerOnEnterElms.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      yPercent: 10,
      ease: 'sin.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top 70%',
        scrub: 1,
      },
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
