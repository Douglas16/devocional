// Finalização de jornada — animação de celebração ao concluir 100% de um livro.
// Sem dependências externas. window.lectioFinale(kind) escolhe a animação;
// kind: 'veil' (véu do templo), 'scroll' (pergaminho), 'swords' (espadas), padrão = confete.
(function () {
  const COLORS = ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#a663cc', '#f7b2bd'];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInCubic = t => t * t * t;
  const easeOutBack = t => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  // hash determinístico — mesma "aleatoriedade" a cada quadro, sem tremular
  const hash = n => {
    const s = Math.sin(n * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  };

  function makeCanvas() {
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
    window.addEventListener('resize', resize);
    return {
      canvas, ctx,
      cleanup() {
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    };
  }

  function runLoop(ctx, canvas, duration, draw, onDone) {
    const start = performance.now();
    let raf;
    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(elapsed, ctx);
      if (elapsed < duration) {
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        onDone();
      }
    }
    raf = requestAnimationFrame(frame);
  }

  // ============ 1. CONFETE (padrão) ============
  function burst() {
    const { canvas, ctx, cleanup } = makeCanvas();
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

    const DURATION = 3200;
    runLoop(ctx, canvas, DURATION, (elapsed) => {
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
    }, cleanup);
  }

  // ============ 2. VÉU DO TEMPLO — rasga de cima para baixo (João · Sinóticos) ============
  function veilTear() {
    const { canvas, ctx, cleanup } = makeCanvas();
    const W = window.innerWidth, H = window.innerHeight;

    const curtainW = Math.min(W * 0.62, 560);
    const curtainH = H * 0.84;
    const cx = W / 2;
    const top = H * 0.06;
    const rowStep = 4;

    const T_TEAR = 1400;   // tempo do rasgo descer do topo até a base
    const T_OPEN = 900;    // as duas metades continuam se afastando/balançando
    const T_HOLD = 900;
    const T_FADE = 650;
    const DURATION = T_TEAR + T_OPEN + T_HOLD + T_FADE;

    const maxGap = curtainW * 0.5;
    const stripeW = 16;

    function fabricColor(x, dark) {
      const stripe = Math.floor(x / stripeW) % 2 === 0;
      if (dark) return stripe ? '#3d0c16' : '#4a0f1b';
      return stripe ? '#6b1220' : '#7a1a2c';
    }

    runLoop(ctx, canvas, DURATION, (elapsed) => {
      const shake = elapsed < T_TEAR ? (1 - elapsed / T_TEAR) * 4 : 0;
      const shakeX = shake ? (hash(elapsed) - 0.5) * shake : 0;
      const shakeY = shake ? (hash(elapsed + 99) - 0.5) * shake : 0;

      const globalOpen = elapsed > T_TEAR
        ? easeOutBack(clamp((elapsed - T_TEAR) / T_OPEN, 0, 1))
        : 0;

      let alpha = 1;
      if (elapsed > T_TEAR + T_OPEN + T_HOLD) {
        alpha = 1 - easeInCubic(clamp((elapsed - T_TEAR - T_OPEN - T_HOLD) / T_FADE, 0, 1));
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(shakeX, shakeY);

      // luz dourada surgindo por trás do rasgo
      const glowR = curtainW * (0.15 + globalOpen * 0.55);
      const grad = ctx.createRadialGradient(cx, top + curtainH * 0.4, 4, cx, top + curtainH * 0.4, glowR);
      grad.addColorStop(0, 'rgba(255,238,196,0.85)');
      grad.addColorStop(1, 'rgba(255,238,196,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - glowR, top - glowR * 0.3, glowR * 2, curtainH + glowR * 0.6);

      const tearY = curtainH * easeOutCubic(clamp(elapsed / T_TEAR, 0, 1));

      for (let y = 0; y < curtainH; y += rowStep) {
        const rowY = top + y;
        const ripFrac = clamp((elapsed - (y / curtainH) * T_TEAR) / 220, 0, 1);
        const jag = (hash(y) - 0.5) * 7;
        const shift = y <= tearY
          ? maxGap * (easeOutCubic(ripFrac) * 0.42 + globalOpen * 0.58) + jag * (1 - globalOpen * 0.5)
          : 0;

        // metade esquerda
        for (let sx = 0; sx < curtainW / 2; sx += 3) {
          const px = cx - curtainW / 2 + sx - shift;
          ctx.fillStyle = fabricColor(sx, sx < 6);
          ctx.fillRect(px, rowY, 3.2, rowStep + 0.6);
        }
        // metade direita
        for (let sx = 0; sx < curtainW / 2; sx += 3) {
          const px = cx + sx + shift;
          ctx.fillStyle = fabricColor(sx, sx < 6);
          ctx.fillRect(px, rowY, 3.2, rowStep + 0.6);
        }
      }

      ctx.restore();
    }, cleanup);
  }

  // ============ 3. PERGAMINHO — abre e escreve "Parabéns!!!" (Pentateuco) ============
  function scrollOpen() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      display:flex;align-items:center;justify-content:center;
      background:rgba(20,14,6,0);transition:background 500ms ease;
    `;
    document.body.appendChild(overlay);

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:stretch;filter:drop-shadow(0 12px 28px rgba(0,0,0,0.35));';
    overlay.appendChild(wrap);

    const rollerStyle = `
      width:20px;border-radius:10px;flex:0 0 auto;
      background:linear-gradient(90deg,#5a3a1e,#8a5a2e 30%,#6b4322 60%,#41290f);
      box-shadow:inset 0 0 4px rgba(0,0,0,0.5);
    `;
    const rollerL = document.createElement('div');
    rollerL.style.cssText = rollerStyle;
    const rollerR = document.createElement('div');
    rollerR.style.cssText = rollerStyle;

    const scrollHeight = Math.min(window.innerHeight * 0.32, 240);
    rollerL.style.height = scrollHeight + 'px';
    rollerR.style.height = scrollHeight + 'px';

    const parchment = document.createElement('div');
    parchment.style.cssText = `
      height:${scrollHeight}px;width:2px;flex:0 0 auto;overflow:hidden;
      background:
        repeating-linear-gradient(0deg, rgba(120,90,40,0.06) 0px, rgba(120,90,40,0.06) 1px, transparent 1px, transparent 26px),
        linear-gradient(180deg,#f4e8c8,#ecd9a8 55%,#e3caa0);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      transition:width 1500ms cubic-bezier(.2,.8,.2,1);
    `;
    wrap.appendChild(rollerL);
    wrap.appendChild(parchment);
    wrap.appendChild(rollerR);

    const text = document.createElement('div');
    text.textContent = 'Parabéns!!!';
    text.style.cssText = `
      font-family: Georgia, 'Times New Roman', serif;
      font-weight:700; font-style:italic;
      font-size:clamp(22px,5vw,40px); color:#5b3a1e;
      white-space:nowrap; opacity:0; text-align:center;
      transform:translateY(6px); transition:opacity 500ms ease, transform 500ms ease;
      text-shadow:0 1px 0 rgba(255,255,255,0.4);
    `;
    const sub = document.createElement('div');
    sub.textContent = 'Jornada concluída';
    sub.style.cssText = `
      font-family: Georgia, 'Times New Roman', serif; font-style:italic;
      font-size:13px; letter-spacing:0.08em; color:#8a6a3e; margin-top:6px;
      opacity:0; transition:opacity 500ms ease 120ms;
    `;
    const holder = document.createElement('div');
    holder.style.cssText = 'display:flex;flex-direction:column;align-items:center;';
    holder.appendChild(text);
    holder.appendChild(sub);
    parchment.appendChild(holder);

    requestAnimationFrame(() => {
      overlay.style.background = 'rgba(20,14,6,0.28)';
      parchment.style.width = Math.min(window.innerWidth * 0.72, 460) + 'px';
    });

    setTimeout(() => {
      text.style.opacity = '1';
      text.style.transform = 'translateY(0)';
      sub.style.opacity = '1';
    }, 900);

    setTimeout(() => {
      text.style.opacity = '0';
      sub.style.opacity = '0';
    }, 3200);

    setTimeout(() => {
      parchment.style.transition = 'width 800ms cubic-bezier(.4,0,.6,1)';
      parchment.style.width = '2px';
      overlay.style.background = 'rgba(20,14,6,0)';
    }, 3500);

    setTimeout(() => overlay.remove(), 4400);
  }

  // ============ 4. ESPADAS CRUZADAS (Josué) ============
  function swordsCross() {
    const { canvas, ctx, cleanup } = makeCanvas();
    const W = window.innerWidth, H = window.innerHeight;
    const cx = W / 2, cy = H * 0.42;
    const armLen = Math.min(W, H) * 0.34;

    const T_APPROACH = 650;
    const T_HOLD = 1200;
    const T_FADE = 650;
    const DURATION = T_APPROACH + T_HOLD + T_FADE;

    const angleA = -55 * Math.PI / 180;
    const angleB = Math.PI - angleA;

    let sparked = false;
    let sparks = [];
    let flashAt = null;

    function drawSword(angle, offset, alpha) {
      const ox = cx - Math.cos(angle) * offset;
      const oy = cy - Math.sin(angle) * offset;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(ox, oy);
      ctx.rotate(angle);

      const tipLen = armLen * 1.15;
      const hiltLen = armLen * 0.72;

      // lâmina
      const bladeGrad = ctx.createLinearGradient(0, -7, 0, 7);
      bladeGrad.addColorStop(0, '#eef2f5');
      bladeGrad.addColorStop(0.5, '#b9c4cc');
      bladeGrad.addColorStop(1, '#8b98a3');
      ctx.beginPath();
      ctx.moveTo(4, -7);
      ctx.lineTo(tipLen, -1.5);
      ctx.lineTo(tipLen + 14, 0);
      ctx.lineTo(tipLen, 1.5);
      ctx.lineTo(4, 7);
      ctx.closePath();
      ctx.fillStyle = bladeGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(60,66,72,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // friso central
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(tipLen + 6, 0);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.stroke();

      // guarda
      ctx.fillStyle = '#c9a227';
      ctx.fillRect(-10, -14, 12, 28);
      ctx.strokeStyle = 'rgba(90,66,10,0.6)';
      ctx.strokeRect(-10, -14, 12, 28);

      // punho
      ctx.fillStyle = '#3b2414';
      ctx.fillRect(-hiltLen, -5, hiltLen - 10, 10);
      // pomo
      ctx.beginPath();
      ctx.arc(-hiltLen, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a227';
      ctx.fill();

      ctx.restore();
    }

    runLoop(ctx, canvas, DURATION, (elapsed) => {
      const approachT = clamp(elapsed / T_APPROACH, 0, 1);
      const offset = (1 - easeOutCubic(approachT)) * Math.max(W, H) * 0.75;

      let alpha = 1;
      if (elapsed > T_APPROACH + T_HOLD) {
        alpha = 1 - easeInCubic(clamp((elapsed - T_APPROACH - T_HOLD) / T_FADE, 0, 1));
      }

      drawSword(angleA, offset, alpha);
      drawSword(angleB, offset, alpha);

      if (!sparked && elapsed >= T_APPROACH) {
        sparked = true;
        flashAt = elapsed;
        sparks = Array.from({ length: 26 }, () => {
          const a = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 7;
          return {
            x: cx, y: cy,
            vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
            len: 6 + Math.random() * 10,
            color: Math.random() < 0.5 ? '#fff6d8' : '#d9c15a'
          };
        });
      }

      if (flashAt !== null) {
        const ft = elapsed - flashAt;
        if (ft < 260) {
          const flashAlpha = (1 - ft / 260) * alpha;
          ctx.save();
          ctx.globalAlpha = flashAlpha;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 46);
          g.addColorStop(0, 'rgba(255,255,255,0.95)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(cx - 46, cy - 46, 92, 92);
          ctx.restore();
        }
        if (ft < 450) {
          const sparkFade = 1 - ft / 450;
          sparks.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.92;
            s.vy *= 0.92;
            ctx.save();
            ctx.globalAlpha = sparkFade * alpha;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.vx * 1.6, s.y - s.vy * 1.6);
            ctx.stroke();
            ctx.restore();
          });
        }
      }
    }, cleanup);
  }

  window.lectioConfetti = burst;
  window.lectioVeilTear = veilTear;
  window.lectioScrollOpen = scrollOpen;
  window.lectioSwordsCross = swordsCross;

  window.lectioFinale = function (kind) {
    if (kind === 'veil') return veilTear();
    if (kind === 'scroll') return scrollOpen();
    if (kind === 'swords') return swordsCross();
    return burst();
  };
})();
