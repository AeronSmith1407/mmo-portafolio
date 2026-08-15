/* ============================================================
   SISTEMA v2.0 — notifications.js
   Ventanas flotantes tipo "¡NUEVA ZONA DESBLOQUEADA!".
   Se pueden desactivar desde el dock (botón de campana).
   ============================================================ */

const Notifications = {
  stack:null,
  enabled:true,
  queue:[],
  max:3,

  init(){
    this.stack = document.getElementById('notif-stack');
    if(sessionStorage.getItem('sys_notif') === '0') this.enabled = false;
  },

  toggle(){
    this.enabled = !this.enabled;
    sessionStorage.setItem('sys_notif', this.enabled ? '1' : '0');
    if(!this.enabled) this.clearAll();
    return this.enabled;
  },

  clearAll(){
    if(!this.stack) return;
    [...this.stack.children].forEach(n => this.dismiss(n));
  },

  /**
   * @param {{kicker:string,title:string,desc?:string,gold?:boolean,dur?:number,force?:boolean}} o
   */
  push(o){
    if(!this.stack) return;
    if(!this.enabled && !o.force) return;

    // límite de pila
    while(this.stack.children.length >= this.max) this.dismiss(this.stack.firstElementChild, true);

    const dur = o.dur || 4200;
    const el = document.createElement('div');
    el.className = 'notif' + (o.gold ? ' notif--gold' : '');
    el.setAttribute('role', 'status');
    el.style.setProperty('--dur', dur + 'ms');
    el.innerHTML =
      `<p class="notif__kicker">▸ ${o.kicker}</p>
       <p class="notif__title">${o.title}</p>
       ${o.desc ? `<p class="notif__desc">${o.desc}</p>` : ''}
       <span class="notif__bar"></span>`;
    this.stack.appendChild(el);

    if(window.AudioSystem) AudioSystem.play(o.gold ? 'levelup' : 'notify');

    setTimeout(() => this.dismiss(el), dur);
  },

  dismiss(el, now){
    if(!el || el.dataset.out) return;
    el.dataset.out = '1';
    if(now){ el.remove(); return; }
    el.classList.add('is-out');
    setTimeout(() => el.remove(), 380);
  }
};

window.Notifications = Notifications;
