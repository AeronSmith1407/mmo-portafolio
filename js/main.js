/* ============================================================
   SISTEMA v2.0 — main.js
   Orquestador: boot, render de datos, GSAP/ScrollTrigger,
   barra EXP, HUD, dock de audio, formulario y notificaciones.
   ============================================================ */

(() => {
'use strict';

const D        = window.SISTEMA_DATA;
const $        = (s, c = document) => c.querySelector(s);
const $$       = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = () => !!(window.gsap && window.ScrollTrigger);
const sfx      = k => window.AudioSystem && AudioSystem.play(k);

/* ============================================================
   1 · RENDER DE CONTENIDO
   ============================================================ */
function renderStats(){
  const box = $('#stats-list');
  box.innerHTML = D.stats.map(s => `
    <div class="stat reveal">
      <div class="stat__top">
        <span class="stat__name">${s.name}</span>
        <span class="stat__val" data-target="${s.value}">0</span>
      </div>
      <div class="stat__track">
        <div class="stat__fill" data-w="${s.value}"></div>
        <span class="stat__ticks"></span>
      </div>
      <p class="stat__desc">${s.desc}</p>
    </div>`).join('');
}

function renderSkills(){
  const box = $('#skill-tree');
  let total = 0;
  box.innerHTML = D.skills.map(b => {
    total += b.nodes.length;
    return `
    <div class="branch reveal">
      <div class="branch__head">
        <span class="branch__icon"><i>${b.icon}</i></span>
        <span class="branch__name">${b.branch}</span>
        <span class="branch__line"></span>
        <span class="branch__count">${String(b.nodes.length).padStart(2,'0')} NODOS</span>
      </div>
      <div class="nodes">
        ${b.nodes.map(n => `
          <div class="node" style="--nc:${n.color}" data-sfx-hover="1" tabindex="0">
            <span class="node__hex">${n.mark}</span>
            <div class="node__body">
              <p class="node__name">${n.name}</p>
              <p class="node__lvl">
                LV.${n.level}
                <span class="node__pips">${
                  Array.from({length:5}, (_, i) => `<i class="${i < n.level ? 'on' : ''}"></i>`).join('')
                }</span>
              </p>
            </div>
            <span class="node__flash"></span>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
  $('#skill-count').textContent = total;
}

function renderProjects(){
  const box = $('#dungeons');
  box.innerHTML = D.projects.map((p, i) => {
    const media = p.img
      ? `<img src="${p.img}" alt="Captura de ${p.name}" loading="lazy" decoding="async"
              onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
         <div class="dungeon__ph" style="display:none">${phSvg()}<span>PUERTA SIN ESCANEAR</span></div>`
      : `<div class="dungeon__ph">${phSvg()}<span>CAPTURA PENDIENTE</span></div>`;

    const btn = (href, label, ico) => href
      ? `<a class="btn btn--ghost" href="${href}" target="_blank" rel="noopener" data-sfx="click"><span class="btn__txt">${label}</span><span class="btn__ico">${ico}</span></a>`
      : `<span class="btn btn--ghost is-locked"><span class="btn__txt">${label} · SELLADO</span></span>`;

    return `
    <!-- sin clase .reveal: la mazmorra tiene su propia animación en initAnimations() -->
    <article class="dungeon" data-sfx-hover="1" style="--i:${i}">
      <div class="dungeon__media">
        ${media}
        <span class="dungeon__gate"></span>
        <span class="dungeon__status ${p.done ? '' : 'wip'}"><i></i>${p.status}</span>
        <span class="dungeon__rank rank-${p.rank}">${p.rank}<small>RANGO</small></span>
      </div>
      <div class="dungeon__body">
        <p class="dungeon__meta">${p.type}</p>
        <h3 class="dungeon__name">${p.name}</h3>
        <p class="dungeon__desc">${p.desc}</p>
        <div class="loot">
          <p class="loot__title">▸ RECOMPENSAS OBTENIDAS</p>
          <ul class="loot__list">${p.loot.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>
        <div class="dungeon__actions">
          ${btn(p.demo, 'VER LOGRO', '▸')}
          ${btn(p.repo, 'VER CRÓNICA', '❖')}
        </div>
      </div>
    </article>`;
  }).join('');
}

function phSvg(){
  return `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 4 L58 20 L58 44 L32 60 L6 44 L6 20 Z"/>
    <path d="M32 18 L45 26 L45 40 L32 48 L19 40 L19 26 Z"/>
    <circle cx="32" cy="33" r="4"/></svg>`;
}

function renderTimeline(){
  const box = $('#road-items');
  box.innerHTML = D.timeline.map(t => `
    <div class="lvl">
      <span class="lvl__node"></span>
      <div class="panel lvl__card">
        <div class="panel__corner tl"></div><div class="panel__corner tr"></div>
        <div class="panel__corner bl"></div><div class="panel__corner br"></div>
        <span class="lvl__up">LEVEL UP!</span>
        <div class="lvl__top">
          <span class="lvl__badge">${t.level}</span>
          <span class="lvl__date">${t.date}</span>
        </div>
        <h3 class="lvl__title">${t.title}</h3>
        <p class="lvl__place">${t.place}</p>
        <p class="lvl__desc">${t.desc}</p>
        <div class="lvl__tags">${t.tags.map(x => `<span>${x}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

/* ============================================================
   2 · LOADING SCREEN
   ============================================================ */
function boot(){
  const loader  = $('#loader');
  const fill    = $('.loader__fill');
  const pct     = $('.loader__pct');
  const log     = $('.loader__log');
  const consola = $('#loader-console');

  /* Secuencia de arranque: [texto, % objetivo, ms de duración] */
  const STEPS = [
    ['ESTABLECIENDO ENLACE CON EL NÚCLEO',  14, 520],
    ['VERIFICANDO LICENCIA DE CAZADOR',     28, 420],
    ['CARGANDO HOJA DE PERSONAJE',          44, 480],
    ['SINCRONIZANDO ÁRBOL DE HABILIDADES',  62, 560],
    ['ESCANEANDO PUERTAS DE MAZMORRA',      80, 620],
    ['ABRIENDO CANAL CON EL GREMIO',        93, 440],
    ['CALIBRANDO INTERFAZ',                100, 380]
  ];

  const finish = () => {
    if(loader.dataset.done) return;
    loader.dataset.done = '1';
    sessionStorage.setItem('sys_boot', '1');
    loader.classList.add('is-out');
    document.body.classList.remove('is-loading');
    setTimeout(() => { loader.classList.add('is-gone'); loader.remove(); }, REDUCED ? 0 : 950);
    setTimeout(() => {
      startApp();
      Notifications.push({ ...D.zones.hero, force:true, dur:3800 });
    }, REDUCED ? 20 : 500);
  };

  const skip = () => {
    if(loader.dataset.done) return;
    loader.dataset.skipped = '1';       // corta la secuencia en curso
    finish();
  };

  /* ¿Saltar la pantalla?
     · ya se mostró en esta sesión           → sí
     · el usuario pidió menos movimiento     → sí
     · URL con ?boot (o ?boot=1)             → NO, la fuerza siempre  */
  const forced = /[?&]boot\b/.test(location.search);
  if(!forced && (sessionStorage.getItem('sys_boot') === '1' || REDUCED)){
    loader.dataset.done = '1';
    loader.remove();
    document.body.classList.remove('is-loading');
    startApp();
    return;
  }

  loader.addEventListener('click', skip);
  addEventListener('keydown', e => {
    if(e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
  });

  /* --- ejecución paso a paso --- */
  let idx = 0;

  const addLine = txt => {
    const li = document.createElement('li');
    li.className = 'pending';
    li.innerHTML = `<span>▸ ${txt}</span><b>...</b>`;
    consola.appendChild(li);
    while(consola.children.length > 5) consola.firstElementChild.remove();
    return li;
  };

  const runStep = () => {
    if(loader.dataset.skipped || loader.dataset.done) return;

    if(idx >= STEPS.length){
      log.textContent = 'SISTEMA LISTO';
      loader.classList.add('is-granted');
      sfx('levelup');                       // suena solo si ya hubo interacción previa
      setTimeout(finish, 900);
      return;
    }

    const [txt, target, dur] = STEPS[idx++];
    log.textContent = txt;
    const li = addLine(txt);

    // avance del porcentaje hacia el objetivo del paso
    const from = parseFloat(fill.style.width) || 0;
    const t0 = performance.now();
    const step = now => {
      if(loader.dataset.skipped || loader.dataset.done) return;
      const k = Math.min(1, (now - t0) / dur);
      const v = from + (target - from) * (1 - Math.pow(1 - k, 3));   // easeOutCubic
      fill.style.width = v + '%';
      pct.textContent  = Math.round(v) + '%';
      if(k < 1) requestAnimationFrame(step);
      else{
        li.classList.remove('pending');
        li.querySelector('b').textContent = '[OK]';
        setTimeout(runStep, 90 + Math.random() * 140);
      }
    };
    requestAnimationFrame(step);
  };

  setTimeout(runStep, 500);
}

/* ============================================================
   3 · ANIMACIONES (GSAP + ScrollTrigger)
   ============================================================ */
function initAnimations(){
  if(REDUCED || !HAS_GSAP()){
    // Fallback sin animación: mostrar todo y llenar barras
    $$('.stat__fill').forEach(f => f.style.width = f.dataset.w + '%');
    $$('.stat__val').forEach(v => v.textContent = v.dataset.target);
    $$('.lvl').forEach(l => l.classList.add('is-on'));
    $$('.node').forEach(n => n.classList.add('unlocked'));
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* --- reveals genéricos --- */
  $$('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity:0, y:34, filter:'blur(6px)' },
      {
        opacity:1, y:0, filter:'blur(0px)', duration:.9, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 88%', once:true },
        onStart(){
          el.classList.add('is-in');
          if(el.classList.contains('panel')) el.classList.add('glowed');
        }
      });
  });

  /* --- entrada del hero ---
     fromTo + clearProps: el estado final queda explícito y sin inline styles,
     para que el parallax con scrub no capture un opacity intermedio. --- */
  const heroTl = gsap.timeline({
    delay:.15,
    // red de seguridad: el hero nunca debe quedarse invisible
    onComplete(){ gsap.set('.hero__panel', { opacity:1, clearProps:'opacity' }); }
  });
  heroTl.fromTo('.hero__panel',
          { opacity:0, scale:.94 },
          { opacity:1, scale:1, duration:1, ease:'power3.out', clearProps:'opacity,scale' })
        .fromTo('.hero__label', { opacity:0, y:20 }, { opacity:1, y:0, duration:.6, clearProps:'all' }, '-=.5')
        .fromTo('.hero__name',  { opacity:0, y:30 }, { opacity:1, y:0, duration:.8, ease:'power3.out', clearProps:'all' }, '-=.35')
        .fromTo('.ministat',    { opacity:0, y:16 }, { opacity:1, y:0, stagger:.09, duration:.5, clearProps:'all' }, '-=.4')
        .fromTo('.hero__actions .btn', { opacity:0, y:16 }, { opacity:1, y:0, stagger:.1, duration:.5, clearProps:'all' }, '-=.3');

  /* --- contadores --- */
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count;
    gsap.fromTo(el, { innerText:0 }, {
      innerText:to, duration:1.6, ease:'power2.out', snap:{ innerText:1 },
      scrollTrigger:{ trigger:el, start:'top 92%', once:true }
    });
  });

  /* --- barras de atributos --- */
  $$('.stat').forEach(st => {
    const fill = $('.stat__fill', st), val = $('.stat__val', st);
    const target = +fill.dataset.w;
    ScrollTrigger.create({
      trigger:st, start:'top 86%', once:true,
      onEnter(){
        gsap.to(fill, { width:target + '%', duration:1.5, ease:'power3.out' });
        gsap.fromTo(val, { innerText:0 }, {
          innerText:target, duration:1.5, ease:'power3.out', snap:{ innerText:1 }
        });
      }
    });
  });

  /* --- desbloqueo de skills (secuencial por rama) --- */
  $$('.branch').forEach(br => {
    const nodes = $$('.node', br);
    ScrollTrigger.create({
      trigger:br, start:'top 82%', once:true,
      onEnter(){
        nodes.forEach((n, i) => setTimeout(() => {
          n.classList.add('unlocked');
          sfx('unlock');
        }, i * 110));
      }
    });
  });

  /* --- mazmorras --- */
  $$('.dungeon').forEach(d => {
    gsap.fromTo(d,
      { opacity:0, y:50, rotateX:8 },
      {
        opacity:1, y:0, rotateX:0, duration:.9, ease:'power3.out', clearProps:'all',
        scrollTrigger:{ trigger:d, start:'top 88%', once:true }
      });
  });

  /* --- timeline: cadena de niveles + barra de progreso --- */
  const lvls = $$('.lvl');
  lvls.forEach((l, i) => {
    ScrollTrigger.create({
      trigger:l, start:'top 78%', once:true,
      onEnter(){
        setTimeout(() => {
          l.classList.add('is-on');
          sfx(i === 0 ? 'levelup' : 'unlock');
        }, i * 90);
      }
    });
    gsap.fromTo(l,
      { opacity:0, x:-40 },
      {
        opacity:1, x:0, duration:.8, ease:'power3.out', clearProps:'all',
        scrollTrigger:{ trigger:l, start:'top 86%', once:true }
      });
  });

  const roadFill = $('#road-fill');
  if(roadFill){
    ScrollTrigger.create({
      trigger:'.road', start:'top 70%', end:'bottom 75%', scrub:.6,
      onUpdate(self){ roadFill.style.height = (self.progress * 100).toFixed(1) + '%'; }
    });
  }

  /* --- parallax sutil ---
     Solo desplazamiento (nunca opacity: un scrub sobre opacity puede congelar
     el elemento invisible si captura un valor intermedio de la intro). --- */
  $$('[data-parallax]').forEach(el => {
    gsap.fromTo(el,
      { y:0 },
      {
        y:() => -window.innerHeight * parseFloat(el.dataset.parallax),
        ease:'none', immediateRender:false,
        scrollTrigger:{
          trigger:el, start:'top top', end:'bottom top',
          scrub:.8, invalidateOnRefresh:true
        }
      });
  });

  /* --- fondo: leve deriva del grid --- */
  gsap.to('.bg-grid', {
    backgroundPositionY:'260px', ease:'none',
    scrollTrigger:{ start:0, end:'max', scrub:1 }
  });

  ScrollTrigger.refresh();
}

/* ============================================================
   4 · BARRA EXP (scrollbar personalizado)
   ============================================================ */
function initExpBar(){
  const fill  = $('#expbar-fill');
  const thumb = $('#expbar-thumb');
  const track = $('#expbar-track');
  const pctEl = $('#expbar-pct');
  let dragging = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p   = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    fill.style.height = (p * 100) + '%';
    thumb.style.top   = (p * 100) + '%';
    pctEl.textContent = Math.round(p * 100) + '%';
  };

  const seek = clientY => {
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top:p * max, behavior:dragging ? 'auto' : 'smooth' });
  };

  addEventListener('scroll', update, { passive:true });
  addEventListener('resize', update, { passive:true });

  track.addEventListener('pointerdown', e => {
    dragging = true;
    track.setPointerCapture(e.pointerId);
    seek(e.clientY);
    sfx('hover');
  });
  track.addEventListener('pointermove', e => { if(dragging) seek(e.clientY); });
  const stop = () => { dragging = false; };
  track.addEventListener('pointerup', stop);
  track.addEventListener('pointercancel', stop);

  update();
}

/* ============================================================
   5 · HUD, NAVEGACIÓN Y ZONAS
   ============================================================ */
function initHud(){
  const hud   = $('#hud');
  const nav   = $('.hud__nav');
  const toggle= $('#menu-toggle');
  const links = $$('.hud__nav a');

  addEventListener('scroll', () => {
    hud.classList.toggle('is-stuck', scrollY > 40);
  }, { passive:true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
    sfx('click');
  });

  links.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  // Scroll suave manual (compensa el HUD fijo)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id.length < 2) return;
      const t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + scrollY - (innerWidth > 860 ? 60 : 50);
      scrollTo({ top, behavior:REDUCED ? 'auto' : 'smooth' });
    });
  });

  // Sección activa + notificación de zona (IntersectionObserver: funciona sin GSAP)
  const seen = new Set(['hero']);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(!en.isIntersecting) return;
      const id = en.target.id;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
      if(!seen.has(id)){
        seen.add(id);
        const z = D.zones[id];
        if(z) Notifications.push({ ...z, dur:3800 });
      }
    });
  // Banda central: funciona igual con secciones cortas o muy largas
  }, { threshold:0, rootMargin:'-45% 0px -45% 0px' });

  $$('main .section').forEach(s => io.observe(s));
}

/* ============================================================
   6 · DOCK DE AUDIO / NOTIFICACIONES / FX
   ============================================================ */
function initDock(){
  const bAudio = $('#btn-audio');
  const bNotif = $('#btn-notif');
  const bFx    = $('#btn-fx');
  const tip    = $('#dock-tip');

  const showTip = txt => {
    tip.textContent = txt;
    tip.classList.add('is-on');
    clearTimeout(tip._t);
    tip._t = setTimeout(() => tip.classList.remove('is-on'), 1800);
  };

  AudioSystem.onChange = state => {
    bAudio.classList.toggle('is-loading', state === 'loading');
    bAudio.classList.toggle('is-playing', state === 'playing');
    bAudio.classList.toggle('is-muted',   state === 'muted');
  };

  bAudio.addEventListener('click', () => {
    AudioSystem.toggleMusic();
    showTip(AudioSystem.musicState === 'playing' ? 'MÚSICA ACTIVA · SOMAFM' : 'MÚSICA SILENCIADA');
  });

  bNotif.addEventListener('click', () => {
    const on = Notifications.toggle();
    bNotif.classList.toggle('is-off', !on);
    showTip(on ? 'NOTIFICACIONES ON' : 'NOTIFICACIONES OFF');
  });
  if(!Notifications.enabled) bNotif.classList.add('is-off');

  bFx.addEventListener('click', () => {
    const on = AudioSystem.toggleFx();
    bFx.classList.toggle('is-off', !on);
    showTip(on ? 'EFECTOS ON' : 'EFECTOS OFF');
  });
  if(!AudioSystem.fxOn) bFx.classList.add('is-off');

  // Primera interacción → arranca la radio (política de autoplay)
  const firstTouch = e => {
    AudioSystem.ac();                                  // desbloquea Web Audio
    // Si la interacción fue el propio botón de audio, deja que él la gestione
    const onBtn = e && e.target && e.target.closest && e.target.closest('#btn-audio');
    if(!onBtn && AudioSystem.musicState === 'idle'){
      AudioSystem.startMusic().then(() => {
        if(AudioSystem.musicState === 'playing'){
          Notifications.push({
            kicker:'CANAL DE AUDIO', title:'MÚSICA DEL SISTEMA ACTIVA',
            desc:'SomaFM · Groove Salad. Silénciala desde el icono ◤ inferior izquierdo.', dur:5000
          });
        }
      });
    }
    removeEventListener('pointerdown', firstTouch);
    removeEventListener('keydown', firstTouch);
  };
  addEventListener('pointerdown', firstTouch);
  addEventListener('keydown', firstTouch);
}

/* ============================================================
   7 · SONIDOS DE INTERFAZ
   ============================================================ */
function initSfxBindings(){
  document.addEventListener('click', e => {
    if(e.target.closest('[data-sfx="click"]')) sfx('click');
  });
  document.addEventListener('pointerover', e => {
    if(e.target.closest('[data-sfx-hover], .btn, .chan')) sfx('hover');
  });

  const arise = $('#btn-arise');
  arise.addEventListener('click', () => {
    sfx('arise');
    if(!REDUCED && HAS_GSAP()){
      gsap.fromTo('.hero__aura', { scale:1, opacity:.9 },
        { scale:1.5, opacity:0, duration:1, ease:'power2.out', onComplete(){ gsap.set('.hero__aura',{ clearProps:'all' }); } });
      gsap.fromTo('.gate-ring', { scale:1 }, { scale:1.25, duration:.9, ease:'power3.out', stagger:.06, yoyo:true, repeat:1 });
    }
    Notifications.push({ kicker:'SISTEMA', title:'¡HAS DESPERTADO!', desc:'Acceso concedido a la hoja de personaje.', gold:true, dur:3600 });
    const t = $('#about');
    setTimeout(() => {
      scrollTo({ top:t.getBoundingClientRect().top + scrollY - 60, behavior:REDUCED ? 'auto' : 'smooth' });
    }, 220);
  });
}

/* ============================================================
   8 · FORMULARIO DEL GREMIO
   ============================================================ */
function initForm(){
  const form = $('#contact-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    $$('.field', form).forEach(f => {
      const input = $('input, textarea', f);
      const v = input.value.trim();
      let bad = !v;
      if(input.type === 'email' && v) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      f.classList.toggle('is-bad', bad);
      if(bad) ok = false;
    });

    if(!ok){
      sfx('notify');
      Notifications.push({ kicker:'ERROR DEL SISTEMA', title:'PERGAMINO INCOMPLETO', desc:'Revisa los campos marcados en rojo.', force:true, dur:3600 });
      return;
    }

    /* ⚑ AQUÍ SE CONECTA EL ENVÍO REAL (pendiente de configurar).
       Ejemplo con Formspree:
         fetch('https://formspree.io/f/TU_ID', {
           method:'POST', headers:{ Accept:'application/json' }, body:new FormData(form)
         }).then(...)
       Ejemplo con EmailJS:
         emailjs.sendForm('SERVICE_ID','TEMPLATE_ID', form, 'PUBLIC_KEY').then(...)   */

    const btn = $('button[type="submit"]', form);
    const txt = $('.btn__txt', btn);
    const old = txt.textContent;
    txt.textContent = 'INVOCANDO...';
    btn.disabled = true;

    setTimeout(() => {
      sfx('levelup');
      Notifications.push({
        kicker:'TRANSMISIÓN COMPLETA', title:'MENSAJE ENVIADO AL GREMIO',
        desc:'Tu convocatoria fue registrada. (Modo simulación: aún sin backend.)',
        gold:true, force:true, dur:5000
      });
      form.reset();
      txt.textContent = old;
      btn.disabled = false;
    }, 900);
  });

  $$('.field input, .field textarea', form).forEach(i => {
    i.addEventListener('input', () => i.closest('.field').classList.remove('is-bad'));
  });
}

/* ============================================================
   9 · ARRANQUE
   ============================================================ */
let started = false;
function startApp(){
  if(started) return;
  started = true;

  Particles.init();
  Cursor.init();
  initAnimations();
  initExpBar();
  initHud();
  initDock();
  initSfxBindings();
  initForm();

  // refresco de ScrollTrigger tras cargar imágenes/fuentes
  if(HAS_GSAP()){
    addEventListener('load', () => ScrollTrigger.refresh());
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

let inited = false;
function init(){
  if(inited) return;               // idempotente: nunca arrancar dos secuencias de boot
  inited = true;

  // Marca temprana: evita el parpadeo de los .reveal al iniciar GSAP
  if(HAS_GSAP() && !REDUCED) document.documentElement.classList.add('gsap-ready');

  $('#year').textContent = new Date().getFullYear();
  renderStats();
  renderSkills();
  renderProjects();
  renderTimeline();
  Notifications.init();
  AudioSystem.init();
  boot();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
