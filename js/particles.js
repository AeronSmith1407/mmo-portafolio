/* ============================================================
   SISTEMA v2.0 — particles.js
   Partículas de "maná / sombra": motas flotantes moradas y cian,
   con parallax sutil al hacer scroll. Densidad reducida en móvil.
   ============================================================ */

const Particles = {
  cv:null, ctx:null, list:[], w:0, h:0, dpr:1,
  scrollY:0, targetY:0, raf:null, running:false,
  reduced:false,

  init(){
    this.cv = document.getElementById('particles');
    if(!this.cv) return;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(this.reduced){ this.cv.style.display = 'none'; return; }

    this.ctx = this.cv.getContext('2d', { alpha:true });
    this.resize();
    this.build();
    this.running = true;
    this.loop();

    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { this.resize(); this.build(); }, 180);
    }, { passive:true });

    addEventListener('scroll', () => { this.targetY = scrollY; }, { passive:true });

    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if(this.running) this.loop();
    });
  },

  count(){
    const area = innerWidth * innerHeight;
    if(innerWidth < 700) return Math.min(34, Math.round(area / 26000));   // móvil: pocas
    if(innerWidth < 1200) return Math.min(70, Math.round(area / 20000));
    return Math.min(110, Math.round(area / 16000));
  },

  resize(){
    this.dpr = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.5 : 2);
    this.w = innerWidth; this.h = innerHeight;
    this.cv.width  = this.w * this.dpr;
    this.cv.height = this.h * this.dpr;
    this.cv.style.width  = this.w + 'px';
    this.cv.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  build(){
    const n = this.count();
    const palette = ['139,92,246', '167,139,250', '34,211,238', '103,232,249'];
    this.list = Array.from({ length:n }, () => {
      const depth = Math.random();                 // 0 = lejos, 1 = cerca
      return {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: .6 + depth * 2.1,
        vx: (Math.random() - .5) * (.12 + depth * .22),
        vy: -(.08 + Math.random() * .34) * (.4 + depth),
        a: .12 + Math.random() * .5,
        pulse: Math.random() * Math.PI * 2,
        speed: .008 + Math.random() * .02,
        depth,
        c: palette[(Math.random() * palette.length) | 0],
        rune: Math.random() < .045                  // algunas son "runas" (rombos)
      };
    });
  },

  loop(){
    if(!this.running) return;
    this.raf = requestAnimationFrame(() => this.loop());

    // parallax suavizado
    this.scrollY += (this.targetY - this.scrollY) * .06;

    const c = this.ctx;
    c.clearRect(0, 0, this.w, this.h);
    c.globalCompositeOperation = 'lighter';

    for(const p of this.list){
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.speed;

      // wrap
      if(p.y < -20) { p.y = this.h + 20; p.x = Math.random() * this.w; }
      if(p.x < -20) p.x = this.w + 20;
      if(p.x > this.w + 20) p.x = -20;

      const par = -this.scrollY * (.04 + p.depth * .16);
      let y = p.y + par;
      // repetición vertical del parallax para que nunca quede vacío
      const span = this.h + 60;
      y = ((y + 30) % span + span) % span - 30;

      const alpha = p.a * (.55 + .45 * Math.sin(p.pulse));
      const r = p.r;

      if(p.rune){
        c.save();
        c.translate(p.x, y);
        c.rotate(p.pulse * .5);
        c.strokeStyle = `rgba(${p.c},${alpha * .9})`;
        c.lineWidth = 1;
        c.shadowBlur = 10; c.shadowColor = `rgba(${p.c},${alpha})`;
        c.beginPath();
        c.moveTo(0, -r * 2.6); c.lineTo(r * 2.6, 0);
        c.lineTo(0, r * 2.6);  c.lineTo(-r * 2.6, 0);
        c.closePath(); c.stroke();
        c.restore();
      }else{
        const g = c.createRadialGradient(p.x, y, 0, p.x, y, r * 4.5);
        g.addColorStop(0,   `rgba(${p.c},${alpha})`);
        g.addColorStop(.35, `rgba(${p.c},${alpha * .32})`);
        g.addColorStop(1,   `rgba(${p.c},0)`);
        c.fillStyle = g;
        c.beginPath(); c.arc(p.x, y, r * 4.5, 0, Math.PI * 2); c.fill();

        c.fillStyle = `rgba(255,255,255,${alpha * .5})`;
        c.beginPath(); c.arc(p.x, y, r * .5, 0, Math.PI * 2); c.fill();
      }
    }
    c.globalCompositeOperation = 'source-over';
  }
};

window.Particles = Particles;
