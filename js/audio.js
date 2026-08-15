/* ============================================================
   SISTEMA v2.0 — audio.js
   · Música de fondo: stream en vivo SomaFM "Groove Salad" (lofi/chillout)
     → definido en index.html como <audio id="bgm">
   · Efectos de sonido: Howler.js con archivos locales.
     Si los archivos NO existen, se sintetizan en tiempo real con
     Web Audio (así el sitio suena bien "out of the box").

   ⚑ PARA USAR TUS PROPIOS SONIDOS:
     Descarga clips cortos libres de derechos (ej. Pixabay Sound Effects
     → "ui click", "hover blip", "level up", "notification") y guárdalos en
     assets/audio/ con estos nombres exactos:
        click.mp3 · hover.mp3 · arise.mp3 · notify.mp3 · unlock.mp3 · levelup.mp3
     Se detectan y usan automáticamente al recargar.
   ============================================================ */

const SFX_FILES = {
  click:   'assets/audio/click.mp3',
  hover:   'assets/audio/hover.mp3',
  arise:   'assets/audio/arise.mp3',
  notify:  'assets/audio/notify.mp3',
  unlock:  'assets/audio/unlock.mp3',
  levelup: 'assets/audio/levelup.mp3'
};

/* Perfiles del sintetizador de respaldo (cuando no hay archivo) */
const SFX_SYNTH = {
  click:   { type:'square',   f:[520, 880],  dur:.07, vol:.16, sweep:'up'   },
  hover:   { type:'sine',     f:[880, 1180], dur:.05, vol:.07, sweep:'up'   },
  arise:   { type:'sawtooth', f:[110, 660],  dur:.85, vol:.16, sweep:'up', chord:[1,1.5,2] },
  notify:  { type:'triangle', f:[1320, 990], dur:.20, vol:.11, sweep:'down' },
  unlock:  { type:'triangle', f:[660, 1320], dur:.13, vol:.08, sweep:'up'   },
  levelup: { type:'sine',     f:[523, 1046], dur:.42, vol:.13, sweep:'up', chord:[1,1.25,1.5] }
};

const AudioSystem = {
  ready:false,
  fxOn:true,
  musicState:'idle',      // idle | playing | muted
  volume:0.32,
  howls:{},
  hasFile:{},
  ctx:null,
  bgm:null,
  lastHover:0,
  onChange:null,

  init(){
    this.bgm = document.getElementById('bgm');
    this.bgm.volume = 0;

    // Preferencias guardadas (por sesión)
    const fx = sessionStorage.getItem('sys_fx');
    if(fx === '0') this.fxOn = false;

    // Howler: intenta cargar los archivos reales
    if(window.Howl){
      Object.entries(SFX_FILES).forEach(([key, src]) => {
        try{
          this.howls[key] = new Howl({
            src:[src], volume:key === 'hover' ? .25 : .5, preload:true,
            onload:  () => { this.hasFile[key] = true; },
            onloaderror: () => { this.hasFile[key] = false; }
          });
        }catch(e){ this.hasFile[key] = false; }
      });
    }

    // Errores del stream → mensaje discreto en consola
    this.bgm.addEventListener('error', () => {
      console.warn('[SISTEMA] Stream de música no disponible. Revisa la URL de SomaFM en index.html.');
      this.musicState = 'idle';
      this.emit();
    });

    this.ready = true;
  },

  /* Contexto Web Audio para el sintetizador de respaldo */
  ac(){
    if(!this.ctx){
      const C = window.AudioContext || window.webkitAudioContext;
      if(!C) return null;
      this.ctx = new C();
    }
    if(this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  play(key){
    if(!this.fxOn || !this.ready) return;
    if(key === 'hover'){                     // throttle de hover
      const now = performance.now();
      if(now - this.lastHover < 70) return;
      this.lastHover = now;
    }
    if(this.hasFile[key] && this.howls[key]){
      try{ this.howls[key].play(); return; }catch(e){}
    }
    this.synth(key);
  },

  synth(key){
    const p = SFX_SYNTH[key];
    const ctx = this.ac();
    if(!p || !ctx) return;
    const t0 = ctx.currentTime;
    const notes = p.chord || [1];

    notes.forEach((mult, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t0 + i * (p.chord ? .09 : 0);
      const [a, b] = p.f;
      osc.type = p.type;
      osc.frequency.setValueAtTime(a * mult, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, b * mult), start + p.dur);

      const v = p.vol / notes.length + (p.chord ? .02 : 0);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(v, start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + p.dur);

      // filtro suave para que no suene estridente
      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = 4200;

      osc.connect(flt); flt.connect(gain); gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + p.dur + .05);
    });
  },

  /* ---------- MÚSICA ---------- */
  startMusic(){
    if(this.musicState === 'playing') return Promise.resolve();
    this.emit('loading');
    const p = this.bgm.play();
    const ok = () => {
      this.musicState = 'playing';
      this.fade(0, this.volume, 1400);
      this.emit();
    };
    if(p && p.then){
      return p.then(ok).catch(() => { this.musicState = 'idle'; this.emit(); });
    }
    ok();
    return Promise.resolve();
  },

  toggleMusic(){
    if(this.musicState === 'idle')      return this.startMusic();
    if(this.musicState === 'playing'){
      this.musicState = 'muted';
      this.fade(this.bgm.volume, 0, 400, () => this.bgm.pause());
    }else{
      this.bgm.play().catch(()=>{});
      this.musicState = 'playing';
      this.fade(0, this.volume, 700);
    }
    this.emit();
  },

  fade(from, to, ms, cb){
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / ms);
      try{ this.bgm.volume = Math.max(0, Math.min(1, from + (to - from) * k)); }catch(e){}
      if(k < 1) requestAnimationFrame(step); else if(cb) cb();
    };
    requestAnimationFrame(step);
  },

  toggleFx(){
    this.fxOn = !this.fxOn;
    sessionStorage.setItem('sys_fx', this.fxOn ? '1' : '0');
    if(this.fxOn) this.play('click');
    return this.fxOn;
  },

  emit(state){ if(this.onChange) this.onChange(state || this.musicState); }
};

window.AudioSystem = AudioSystem;
