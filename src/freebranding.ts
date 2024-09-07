import './global';

import { exp_isDestop } from './global';
import { gsap } from './global';

window.Webflow ||= [];
window.Webflow.push(() => {
  const isDesktop: boolean = exp_isDestop;

  if (isDesktop) {
    //_______________________________________________________________________________________________________ Mouse Trail
    const svgns = 'http://www.w3.org/2000/svg';
    const root = document.createElementNS(svgns, 'svg');
    root.setAttribute('width', window.innerWidth.toString());
    root.setAttribute('height', window.innerHeight.toString());
    const trailWrapper = document.querySelector('.mousetrail-wrap');
    const on = false;
    function startMouseFollower() {
      if (!trailWrapper) return;
      trailWrapper.appendChild(root);
      gsap.to(trailWrapper, { opacity: 1, delay: 0.75, duration: 1 });
      const ease = 0.75;
      const pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      window.addEventListener('mousemove', updatePointer);
      let leader = (prop) => (prop === 'x' ? pointer.x : pointer.y);
      const total = 30;
      for (let i = 0; i < total; i++) {
        leader = createLine(leader);
      }
      const primaryColor = '#fb5751';
      function createLine(leader) {
        const line = document.createElementNS(svgns, 'line');
        line.setAttribute('stroke', '#000000');
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');
        root.appendChild(line);
        const pos = gsap.getProperty(line);
        gsap.set(trailWrapper, { opacity: 0 });
        gsap.to(line, {
          duration: 10000,
          x: '+=150',
          y: '+=10',
          repeat: -1,
          ease: 'expo.out',
          opacity: 0,
          modifiers: {
            x: () => {
              const posX = pos('x');
              const leaderX = leader('x');
              const x = posX + (leaderX - posX) * ease;
              line.setAttribute('x2', leaderX - x);
              return x;
            },
            y: () => {
              const posY = pos('y');
              const leaderY = leader('y');
              const y = posY + (leaderY - posY) * ease;
              line.setAttribute('y2', leaderY - y);
              return y;
            },
          },
        });
        return pos;
      }
      function updatePointer(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
    }
    function stopMouseFollower() {
      gsap.to(trailWrapper, { opacity: 0, delay: 0, duration: 0.25 });
      // while (root.firstChild) {
      //   root.removeChild(root.firstChild);
      // }
      // window.removeEventListener('mousemove', updatePointer);
      // if (trailWrapper) {
      //   trailWrapper.removeChild(root);
      // }
    }
    if (on) {
      startMouseFollower();
    }
  }
}); // End: Webflow Push
