// Explosão de papel picado colorido ao concluir 100% de uma jornada.
// Sem dependências externas — canvas simples, autolimpo.
(function () {
  const COLORS = ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#a663cc', '#f7b2bd'];

  function burst() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const originX = window.innerWidth / 2;
    const pieceCount = 160;
    const pieces = Array.from({ length: pieceCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: originX + (Math.random() - 0.5) * 60,
        y: window.innerHeight * 0.35 + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        gravity: 0.18 + Math.random() * 0.08,
        drag: 0.985
      };
    });

    const start = performance.now();
    const DURATION = 3200;
    let raf;

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fade = elapsed > DURATION - 600 ? Math.max(0, (DURATION - elapsed) / 600) : 1;
      pieces.forEach(p => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    }

    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(frame);
  }

  window.lectioConfetti = burst;
})();
