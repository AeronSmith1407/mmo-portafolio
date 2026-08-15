/* ============================================================
   SISTEMA v2.0 — data.js
   ⚑ ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR PARA
     CAMBIAR TU CONTENIDO (stats, skills, proyectos, timeline).
   ============================================================ */

const SISTEMA_DATA = {

  /* ---------- 01 · ATRIBUTOS (Hoja de personaje) ---------- */
  stats: [
    { name:'LÓGICA DE PROGRAMACIÓN', value:85, desc:'Diseño de algoritmos, estructuras de datos y arquitectura de soluciones limpias.' },
    { name:'RESOLUCIÓN DE PROBLEMAS', value:90, desc:'Rastreo y eliminación de bugs; convertir requisitos confusos en sistemas funcionales.' },
    { name:'TRABAJO EN EQUIPO',       value:80, desc:'Comunicación clara, control de versiones y coordinación en proyectos compartidos.' },
    { name:'APRENDIZAJE CONTINUO',    value:95, desc:'Absorción constante de nuevas tecnologías, frameworks y buenas prácticas.' },
    { name:'CREATIVIDAD',             value:75, desc:'Interfaces con personalidad y experiencias que se recuerdan, no solo pantallas.' }
  ],

  /* ---------- 02 · ÁRBOL DE HABILIDADES ----------
     level: 1-5 (pips de dominio) · color: acento del nodo
     mark : texto corto mostrado dentro del hexágono            */
  skills: [
    {
      branch:'FRONTEND', icon:'◈',
      nodes:[
        { name:'HTML5',      mark:'H5', level:5, color:'#e34f26' },
        { name:'CSS3',       mark:'C3', level:5, color:'#22d3ee' },
        { name:'JAVASCRIPT', mark:'JS', level:4, color:'#f7df1e' },
        { name:'REACT',      mark:'RE', level:4, color:'#61dafb' }
      ]
    },
    {
      branch:'BACKEND', icon:'◆',
      nodes:[
        { name:'NODE.JS', mark:'ND', level:4, color:'#68a063' },
        { name:'PHP',     mark:'PH', level:3, color:'#8892bf' },
        { name:'PYTHON',  mark:'PY', level:3, color:'#4b8bbe' }
      ]
    },
    {
      branch:'BASES DE DATOS', icon:'▣',
      nodes:[
        { name:'MYSQL',   mark:'SQ', level:4, color:'#00758f' },
        { name:'MONGODB', mark:'MG', level:3, color:'#4db33d' }
      ]
    },
    {
      branch:'HERRAMIENTAS', icon:'⚒',
      nodes:[
        { name:'GIT / GITHUB', mark:'GI', level:4, color:'#f05033' },
        { name:'FIGMA',        mark:'FG', level:3, color:'#a259ff' },
        { name:'VS CODE',      mark:'VS', level:5, color:'#0098ff' },
        { name:'POSTMAN',      mark:'PM', level:4, color:'#ff6c37' }
      ]
    }
  ],

  /* ---------- 03 · MAZMORRAS (Proyectos) ----------
     rank : 'S' | 'A' | 'B' | 'C'
     demo / repo : null  → el botón aparece bloqueado ("SELLADO")
     img  : ruta a screenshot (assets/img/...) o null            */
  projects: [
    {
      name:'INVSYSTEM UNIVERSAL',
      type:'MAZMORRA COMERCIAL · MULTI-PISO',
      rank:'S',
      status:'EN DESARROLLO',
      done:false,
      desc:'Sistema de gestión de inventario universal, pensado como solución vendible para tiendas locales de la región: control de stock, ventas y reportes en tiempo real.',
      loot:['React / Vue','Node.js','Express','MySQL','PostgreSQL'],
      demo:null,   // ← REEMPLAZAR con el link de la demo en vivo
      repo:null,   // ← REEMPLAZAR con el link del repositorio
      img:null     // ← REEMPLAZAR: 'assets/img/invsystem.jpg'
    },
    {
      name:'HOMESYNC',
      type:'MAZMORRA MÓVIL · COOPERATIVA',
      rank:'A',
      status:'EN DESARROLLO',
      done:false,
      desc:'App móvil donde una pareja organiza y reparte sus gastos económicos y quehaceres del hogar del día a día, con seguimiento compartido en tiempo real.',
      loot:['React Native','Flutter','Firebase','Node.js'],
      demo:null,   // ← REEMPLAZAR con el link de la demo en vivo
      repo:null,   // ← REEMPLAZAR con el link del repositorio
      img:null     // ← REEMPLAZAR: 'assets/img/homesync.jpg'
    }
  ],

  /* ---------- 04 · LÍNEA DE PROGRESIÓN ----------
     Orden: del más reciente al más antiguo.               */
  timeline: [
    {
      level:'NIVEL 27',
      title:'DESARROLLADOR INDEPENDIENTE',
      place:'PROYECTO PROPIO / FREELANCE',
      date:'2025 — ACTUALIDAD',   // ← AJUSTAR fechas reales
      desc:'Diseño y desarrollo de aplicaciones y sistemas a medida, desde el modelado de datos hasta la interfaz final. Incluye HomeSync e InvSystem Universal.',
      tags:['FULL STACK','UI/UX','APIs REST','BASES DE DATOS']
    },
    {
      level:'NIVEL 20',
      title:'T.S.U EN INFORMÁTICA',
      place:'[INSTITUCIÓN]',       // ← REEMPLAZAR con tu instituto/universidad
      date:'[AÑO] — [AÑO]',        // ← AJUSTAR fechas reales
      desc:'Formación en desarrollo de software, bases de datos y redes. Fundamentos de programación, análisis de sistemas y arquitectura de aplicaciones.',
      tags:['PROGRAMACIÓN','BASES DE DATOS','REDES','ANÁLISIS DE SISTEMAS']
    },
    {
      level:'NIVEL 1',
      title:'DESPERTAR DEL CAZADOR',
      place:'PRIMERA LÍNEA DE CÓDIGO',
      date:'INICIO',
      desc:'El primer "Hola mundo". La puerta que abrió todas las demás mazmorras.',
      tags:['CURIOSIDAD','AUTODIDACTA']
    }
  ],

  /* ---------- NOTIFICACIONES POR ZONA ---------- */
  zones: {
    hero:     { kicker:'SISTEMA',                title:'¡BIENVENIDO, CAZADOR!',        desc:'Interfaz sincronizada correctamente.' },
    about:    { kicker:'NUEVA ZONA DESBLOQUEADA', title:'HOJA DE PERSONAJE',            desc:'Atributos del cazador revelados.' },
    skills:   { kicker:'NUEVA ZONA DESBLOQUEADA', title:'ÁRBOL DE HABILIDADES',         desc:'13 nodos de habilidad activos.' },
    projects: { kicker:'NUEVA ZONA DESBLOQUEADA', title:'PUERTA DE MAZMORRA DETECTADA', desc:'Misiones registradas en el archivo.', gold:true },
    timeline: { kicker:'NUEVA ZONA DESBLOQUEADA', title:'LÍNEA DE PROGRESIÓN',          desc:'Historial de ascenso disponible.' },
    contact:  { kicker:'NUEVA ZONA DESBLOQUEADA', title:'SALA DEL GREMIO',              desc:'Canales de comunicación abiertos.', gold:true }
  }
};

window.SISTEMA_DATA = SISTEMA_DATA;
