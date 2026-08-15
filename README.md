# SISTEMA v2.0 — Portafolio MMORPG · Henrry Solorzano

Portafolio personal con temática MMORPG estilo *Solo Leveling*: interfaz de "Sistema",
rangos, mazmorras, árbol de habilidades y subida de nivel.

HTML5 + CSS3 + JavaScript vanilla · GSAP + ScrollTrigger · Howler.js · partículas en canvas.

---

## 1. Cómo correr el proyecto

El sitio es 100% estático, pero **debe abrirse con un servidor local** (no con doble clic en
`index.html`), porque los navegadores bloquean parte del audio y de los recursos bajo `file://`.

**Opción A — VS Code + Live Server (recomendada)**
1. Abre la carpeta `mmo-portafolio` en VS Code.
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Se abre en `http://127.0.0.1:5500`.

**Opción B — Python**
```bash
cd mmo-portafolio
python -m http.server 5500
```
→ abre `http://localhost:5500`

**Opción C — Node**
```bash
npx serve mmo-portafolio
```

Requiere conexión a internet: GSAP, Howler.js, Google Fonts y la radio de SomaFM se cargan por CDN/stream.

**Atajos de la interfaz**
- La pantalla de carga solo aparece **una vez por sesión** (`sessionStorage`).
- Para **volver a verla sin cerrar la pestaña**: añade `?boot` a la URL
  → `http://localhost:5500/?boot` (fuerza la secuencia siempre).
- Clic en cualquier parte de la pantalla de carga, o `Esc` / `Enter` / `Espacio` → omitirla.
- Dock inferior izquierdo: 🎵 música · 🔔 notificaciones de zona · 🎚 efectos de sonido.
- La música arranca sola tras tu **primera interacción** (política de autoplay de los navegadores).

---

## 2. Dónde reemplazar tus datos reales

### 📄 `js/data.js` — es el archivo principal de contenido
| Qué | Dónde |
|---|---|
| Atributos y descripciones | `stats` |
| Tecnologías, nivel (1-5) y color de cada nodo | `skills` |
| Proyectos: nombre, rango, descripción, stack, **links de demo y repo**, imagen | `projects` |
| Experiencia y educación: **institución, fechas**, descripción | `timeline` |
| Textos de las notificaciones de zona | `zones` |

> En `projects`, si `demo` o `repo` valen `null`, el botón aparece como **SELLADO** (bloqueado).
> Pon la URL y se activa solo. Igual con `img: 'assets/img/mi-captura.jpg'`.

### 🖼 `assets/img/`
- `perfil.jpg` → **tu foto real** (recomendado cuadrado, mín. 600×600 px).
- Capturas de proyectos, p. ej. `homesync.jpg`, `invsystem.jpg` (16:9, ~1200×675 px).
  Se cargan con `loading="lazy"`; solo hay que apuntarlas desde `data.js`.

### 📎 `assets/cv/`
- `CV-Henrry-Solorzano.pdf` → coloca aquí tu CV real **con ese nombre exacto**
  (lo usan el botón del hero y el canal "PERGAMINO" en contacto).
  Si prefieres otro nombre, cámbialo en `index.html` (2 apariciones de `assets/cv/`).

### 🔊 `assets/audio/` — efectos de sonido (opcional)
El sitio **ya suena** aunque la carpeta esté vacía: los efectos se sintetizan en tiempo real
con Web Audio. Si quieres sonidos propios, descarga clips cortos libres de derechos
(p. ej. [Pixabay Sound Effects](https://pixabay.com/sound-effects/) → *ui click*, *hover blip*,
*level up*, *notification*) y guárdalos con **estos nombres exactos**:

```
assets/audio/click.mp3
assets/audio/hover.mp3
assets/audio/arise.mp3
assets/audio/notify.mp3
assets/audio/unlock.mp3
assets/audio/levelup.mp3
```
Se detectan automáticamente al recargar (ver `js/audio.js` → `SFX_FILES`).

### 🎧 Música de fondo
Stream en vivo de **SomaFM · Groove Salad** (lofi/chillout 24/7), en `index.html`:
```html
<audio id="bgm" ...>
  <source src="https://ice2.somafm.com/groovesalad-128-mp3" ...>
```
Cámbialo ahí si quieres otro canal de SomaFM.

### ✉️ Formulario de contacto
Está **visualmente listo pero sin backend** (modo simulación: valida, anima y notifica).
Para conectarlo, ve a `js/main.js` → `initForm()`; hay un comentario con el snippet listo
para **Formspree** y para **EmailJS**. Luego borra el `<p class="form__note">` de `index.html`.

### 🧬 Otros textos
- Nombre, rango, nivel, clase y gremio del hero → `index.html`, sección `#hero`.
- Bio del cazador → `index.html`, bloque `.bio__text`.
- Email y GitHub → `index.html`, sección `#contact` (bloque `.chan`).

---

## 3. Estructura

```
mmo-portafolio/
├─ index.html
├─ css/
│  ├─ style.css        · tokens, layout, componentes HUD
│  ├─ animations.css   · keyframes + prefers-reduced-motion
│  └─ responsive.css   · breakpoints, touch, impresión
├─ js/
│  ├─ data.js          · ⚑ TU CONTENIDO
│  ├─ audio.js         · stream SomaFM + SFX (Howler / Web Audio)
│  ├─ particles.js     · partículas de maná con parallax
│  ├─ cursor.js        · cursor temático + trail
│  ├─ notifications.js · avisos "¡NUEVA ZONA DESBLOQUEADA!"
│  └─ main.js          · render, GSAP/ScrollTrigger, barra EXP, HUD, formulario
└─ assets/
   ├─ img/  · perfil.jpg + capturas
   ├─ audio/· efectos .mp3 (opcionales)
   ├─ cv/   · CV-Henrry-Solorzano.pdf
   └─ fonts/· (vacío: las fuentes vienen de Google Fonts)
```

## 4. Accesibilidad y rendimiento
- `prefers-reduced-motion`: desactiva partículas, cursor custom, parallax y todas las transiciones.
- Touch / móvil: cursor nativo, menos partículas, cursor-trail desactivado.
- Imágenes con `loading="lazy"`; sin dependencias pesadas ni build step.
