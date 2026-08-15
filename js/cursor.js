/* ============================================================
   SISTEMA v2.0 — cursor.js
   Cursor temático (núcleo de maná + rombo orbital) con trail de
   partículas en canvas. Desactivado en touch y en reduced-motion.
   ============================================================ */

const Cursor = {
  el:null, cv:null, ctx:null,
  x:0, y:0, rx:0, ry:0,
  parts:[], active:false, dpr:1,

  init(){
    const touch   = matchMedia('(hover:none), (pointer:coarse)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(touch || reduced) return;                 // móvil/touch → cursor nativo

    this.el = document.getElementById('cursor');
    this.cv = document.getElementById('cursor-trail');
    if(!this.el || !this.cv) return;

    this.ctx = this.cv.getContext('2d');
    document.body.classList.add('has-cursor');
    this.resize();
    this.active = true;

    this.x = this.rx = innerWidth / 2;
    this.y = this.ry = innerHeight / 2;

    addEventListener('resize', () => this.resize(), { passive:true });

    addEventListener('mousemove', e => {
      this.x = e.clientX; this.y = e.clientY;
      // trail: pocas partículas, vida corta
      if(Math.random() < .8){
        this.parts.push({
          x:this.x + (Math.random() - .5) * 6,
          y:this.y + (Math.random() - .5) * 6,
          vx:(Math.random() - .5) * .7,
          vy:(Math.random() - .5) * .7 + .25,
          life:1,
          r:.8 + Math.random() * 2,
          cyan:Math.random() < .55
        });
      }
      if(this.parts.length > 90) this.parts.splice(0, this.parts.length - 90);
    }, { passive:true });

    addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
    addEventListener('mouseup',   () => document.body.classList.remove('cursor-down'));
    addEventListener('mouseleave',() => this.el.style.opacity = '0');
    addEventListener('mouseenter',() => this.el.style.opacity = '1');

    // Estado "hot" sobre elementos interactivos
    const hot = 'a, button, input, textarea, .dungeon, .node, .chan';
    document.addEventListener('mouseover', e => {
      if(e.target.closest(hot)) document.body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout', e => {
      if(e.target.closest(hot) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hot)))
        document.body.classList.remove('cursor-hot');
    });

    this.loop();
  },

  resize(){
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.cv.width  = innerWidth  * this.dpr;
    this.cv.height = innerHeight * this.dpr;
    this.cv.style.width  = innerWidth + 'px';
    this.cv.style.height = innerHeight + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  loop(){
    if(!this.active) return;
    requestAnimationFrame(() => this.loop());

    // seguimiento suave del anillo
    this.rx += (this.x - this.rx) * .18;
    this.ry += (this.y - this.ry) * .18;
    this.el.style.transform = `translate3d(${this.rx}px,${this.ry}px,0)`;
    const dot = this.el.firstElementChild;
    if(dot) dot.style.transform = `translate3d(${this.x - this.rx}px,${this.y - this.ry}px,0)`;

    const c = this.ctx;
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.globalCompositeOperation = 'lighter';

    for(let i = this.parts.length - 1; i >= 0; i--){
      const p = this.parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += .012; p.life -= .035;
      if(p.life <= 0){ this.parts.splice(i, 1); continue; }
      const col = p.cyan ? '34,211,238' : '167,139,250';
      const a = p.life * .75;
      const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g;
      c.beginPath(); c.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); c.fill();
    }
    c.globalCompositeOperation = 'source-over';
  }
};

window.Cursor = Cursor;
