/**
 * particles.js — Visual celebration effects.
 */
const Particles = (() => {
  const COLORS = ['#60a5fa','#f472b6','#fbbf24','#34d399','#a78bfa','#fb923c'];

  function launchConfetti() {
    for (let i = 0; i < 70; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti';
        const size = 4 + Math.random() * 9;
        const dur  = 0.9 + Math.random() * 1.5;
        const del  = Math.random() * 0.4;
        el.style.cssText = `
          left:${Math.random()*100}vw; top:-12px;
          background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
          border-radius:${Math.random()>0.5?'50%':'2px'};
          width:${size}px; height:${size}px;
          animation-duration:${dur}s; animation-delay:${del}s;
        `;
        document.body.appendChild(el);
        setTimeout(()=>el.remove(),(dur+del)*1000+100);
      }, i * 18);
    }
  }

  return { launchConfetti };
})();
