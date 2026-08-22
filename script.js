/* ============================================================================
   xyz.taimo — link page
   Vanilla port of the Claude Design component "Linkpage.dc.html".

   Content comes from data.json (committed to the repo = live for everyone),
   overlaid with anything edited locally through the Edit panel (localStorage).
   Export data.json from the panel and commit it to publish changes.
   ========================================================================= */
(function () {
  'use strict';

  var STORE = 'xyztaimo_linkpage_v1';

  var DEFAULTS = {
    avatar: 'avatar.webp',
    handle: 'xyz.taimo',
    tagline: 'TikTok sound promotion and international collaborations for labels, artists and brands.',
    availability: 'Open for bookings',
    stat1Num: '815K', stat1Label: 'Followers',
    stat2Num: '50.9M', stat2Label: 'Likes',
    heroKicker: 'Sound promotion · Worldwide',
    heroTitle: 'Put your sound in front of 815,000 people.',
    heroBody: 'Paid placements, organic pushes and creator collaborations on TikTok. Send the track, the target market and the timing — you get a plan and a price the same week.',
    ctaPrimary: 'Business inquiry',
    ctaSecondary: 'See results',
    closeTitle: 'Ready when your release is.',
    closeBody: 'Campaign slots are booked two to three weeks ahead. Tell me the release date and I will hold one.',
    footerLeft: '© 2026 xyz.taimo',
    footerRight: 'Response within 24h',
    socialTiktok: 'https://tiktok.com/@xyz.taimo',
    socialInstagram: 'https://www.instagram.com/xyz.taimo',
    socialYoutube: 'https://www.youtube.com/@xyz_taimo',
    socialFacebook: 'https://www.facebook.com/profile.php?id=61590058673601',
    bgImage: '',
    musicUrl: '', musicTitle: 'Chill Lofi Beat', musicArtist: 'Background', musicVolume: 0.12,
    formspree: 'https://formspree.io/f/xljrzbqw',
    formTitle: 'Business inquiry',
    formDesc: 'Sound promotion and collaboration requests. Straight to my inbox.',
    password: 'taimo',
    accent: '#ec3013',
    links: [
      { label: 'Book a sound promo', sub: 'Packages from one creator to a full wave', url: '#inquiry', tag: 'Start here' },
      { label: 'TikTok — @xyz.taimo', sub: '815K followers · 50.9M likes', url: 'https://tiktok.com/@xyz.taimo', tag: '' },
      { label: 'Instagram', sub: 'Behind the campaigns', url: 'https://www.instagram.com/xyz.taimo', tag: '' },
      { label: 'YouTube', sub: 'Long-form cuts and edits', url: 'https://www.youtube.com/@xyz_taimo', tag: '' }
    ],
    videos: [
      { poster: 'intro1-poster.webp', title: 'Sound promo', views: '1.2M', url: 'https://www.tiktok.com/@xyz.taimo/video/7657680462814465312' },
      { poster: 'intro2-poster.webp', title: 'Sound promo', views: '2.5M', url: 'https://www.tiktok.com/@xyz.taimo/video/7264718135163407649' },
      { poster: 'intro3-poster.webp', title: 'Sound promo', views: '5.1M', url: 'https://www.tiktok.com/@xyz.taimo/video/7262513875189304609' }
    ],
    order: { links: 2, work: 3, cta: 4 },
    fx: { cursor: true, magnet: true, spotlight: true, tilt: true, reveal: true, scramble: true, grain: true, marquee: true, click: true }
  };

  var FX_LABELS = {
    cursor: 'Cursor ring', magnet: 'Magnetic buttons', spotlight: 'Mouse spotlight',
    tilt: '3D tilt', reveal: 'Scroll reveal', scramble: 'Text scramble',
    grain: 'Film grain', marquee: 'Marquee', click: 'Click sound'
  };

  var ICON = {
    sun: 'M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3L4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    moon: 'M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z',
    play: 'M8 5l12 7-12 7z',
    pause: 'M7 5h4v14H7zM13 5h4v14h-4z',
    up: 'M12 19V5M5 12l7-7 7 7',
    down: 'M12 5v14M19 12l-7 7-7-7',
    close: 'M18 6L6 18M6 6l12 12',
    arrow: 'M7 17L17 7M17 7H9M17 7v8',
    right: 'M5 12h14M13 5l7 7-7 7'
  };

  /* ── small DOM helpers ─────────────────────────────────────────────── */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'on') Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
        else if (k === 'style') node.setAttribute('style', v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      });
    }
    (kids || []).forEach(function (kid) {
      if (kid === null || kid === undefined || kid === false) return;
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return node;
  }

  function svgIcon(path, size, opts) {
    opts = opts || {};
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', opts.fill || 'none');
    if (!opts.fill) {
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', opts.width || '1.8');
    }
    if (opts.style) svg.setAttribute('style', opts.style);
    if (opts.data) svg.setAttribute(opts.data, '');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path);
    svg.appendChild(p);
    return svg;
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge() {
    var out = {};
    Array.prototype.forEach.call(arguments, function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (k) { out[k] = src[k]; });
    });
    out.fx = Object.assign({}, DEFAULTS.fx, out.fx || {});
    out.order = Object.assign({}, DEFAULTS.order, out.order || {});
    return out;
  }

  /* ── state ─────────────────────────────────────────────────────────── */
  var state = {
    data: merge(DEFAULTS, readStore()),
    theme: readTheme(),
    fxOn: readFx(),
    modal: null,
    unlocked: false,
    playing: false,
    sending: false
  };

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function readTheme() {
    try {
      return localStorage.getItem(STORE + '_theme')
        || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (e) { return 'dark'; }
  }
  function readFx() {
    try { return localStorage.getItem(STORE + '_fx') !== '0'; } catch (e) { return true; }
  }
  function persist(data) {
    state.data = data;
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) {}
    applyData();
  }
  function set(key, value) {
    var d = Object.assign({}, state.data);
    d[key] = value;
    persist(d);
  }
  function fxLive(name) {
    return state.fxOn && state.data.fx[name] !== false;
  }

  /* ── refs ──────────────────────────────────────────────────────────── */
  var root, ring, dot, spot, grain, intro, handleEl, fillEl, timeEl, modalRoot;
  var pointer, moved = false, magnetEl = null, tiltEl = null, raf = 0;
  // Pointer effects are desktop-only; on touch there is no cursor to replace.
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var io = null, audio = null, ac = null, introTimer = 0;

  /* ── data.json ─────────────────────────────────────────────────────── */
  function loadRemote() {
    return fetch('data.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (json) {
        if (!json) return;
        // Locally edited values win over the committed file, exactly as the
        // Edit panel promises; a fresh browser sees what is in the repo.
        state.data = merge(DEFAULTS, json, readStore());
        applyData();
      })
      .catch(function () { /* keep DEFAULTS — the page still works offline */ });
  }

  /* ── render ────────────────────────────────────────────────────────── */
  function applyRoot() {
    var accent = state.data.accent || DEFAULTS.accent;
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-accent-600', accent);
    root.style.setProperty('--color-accent-700', accent);
    document.documentElement.style.setProperty('--color-accent', accent);
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('data-fx', state.fxOn ? 'on' : 'off');
    root.setAttribute('data-fx', state.fxOn ? 'on' : 'off');
    document.body.style.background = state.theme === 'light' ? '#f4f2ee' : '#08080a';

    var bg = state.data.bgImage;
    root.style.backgroundImage = bg
      ? 'linear-gradient(color-mix(in srgb,var(--color-bg) 88%,transparent),color-mix(in srgb,var(--color-bg) 96%,transparent)),url(' + bg + ')'
      : 'none';

    $('#theme-icon').setAttribute('d', state.theme === 'dark' ? ICON.sun : ICON.moon);

    var hide = fine && fxLive('cursor');
    root.toggleAttribute('data-hidecursor', !!hide);
    ring.style.display = hide ? 'block' : 'none';
    dot.style.display = hide ? 'block' : 'none';
    ring.style.opacity = hide && moved ? '1' : '0';
    dot.style.opacity = hide && moved ? '1' : '0';
    spot.style.opacity = fxLive('spotlight') && moved ? '1' : '0';
    grain.style.opacity = fxLive('grain') ? '.05' : '0';
    if (!fxLive('magnet')) releaseMagnet();
    if (!fxLive('tilt')) releaseTilt();
  }

  function applyData() {
    var d = state.data;

    // simple text bindings
    $$('[data-bind]').forEach(function (node) {
      node.textContent = d[node.getAttribute('data-bind')] || '';
    });

    var avatar = $('#avatar');
    avatar.src = d.avatar || DEFAULTS.avatar;
    avatar.alt = d.handle || '';
    if (!scrambling) handleEl.textContent = d.handle || '';

    // socials
    var socials = [
      { name: 'TikTok', mark: 'TT', short: 'TikTok', url: d.socialTiktok || '#' },
      { name: 'Instagram', mark: 'IG', short: 'Insta', url: d.socialInstagram || '#' },
      { name: 'YouTube', mark: 'YT', short: 'YouTube', url: d.socialYoutube || '#' },
      { name: 'Facebook', mark: 'FB', short: 'Facebook', url: d.socialFacebook || '#' }
    ];
    var sWrap = $('#socials');
    sWrap.textContent = '';
    socials.forEach(function (s) {
      sWrap.appendChild(el('a', {
        href: s.url, target: '_blank', rel: 'noopener noreferrer',
        'data-magnet': true, title: s.name, class: 's-tile',
        style: 'display:flex;flex-direction:column;justify-content:space-between;height:64px;padding:9px;border:1px solid var(--color-divider);font-size:11px;letter-spacing:.06em'
      }, [
        el('span', { style: 'font-weight:800;font-size:13px', text: s.mark }),
        el('span', { style: 'font-size:9px;letter-spacing:.1em;text-transform:uppercase;opacity:.7', text: s.short })
      ]));
    });

    // marquee (doubled so the -50% keyframe loops seamlessly)
    var items = [d.heroKicker, d.stat1Num + ' ' + d.stat1Label, d.stat2Num + ' ' + d.stat2Label, 'Labels · Artists · Brands'];
    var mq = $('#marquee');
    mq.textContent = '';
    items.concat(items).forEach(function (t) {
      mq.appendChild(el('span', { style: 'display:flex;align-items:center;gap:44px' }, [
        t, el('span', { style: 'width:5px;height:5px;background:var(--color-accent)' })
      ]));
    });
    mq.style.animationPlayState = fxLive('marquee') ? 'running' : 'paused';

    // link cards
    var links = d.links || [];
    $('#link-count').textContent = links.length + ' destination' + (links.length === 1 ? '' : 's');
    var grid = $('#links-grid');
    grid.textContent = '';
    links.forEach(function (l, i) {
      var inquiry = l.url === '#inquiry';
      var a = el('a', {
        href: inquiry ? '#' : (l.url || '#'),
        target: inquiry ? null : '_blank',
        rel: inquiry ? null : 'noopener noreferrer',
        'data-rv': true, 'data-row': true, 'data-tilt': true, 'data-magnet': true, class: 'link-row',
        style: 'display:flex;align-items:center;gap:18px;padding:22px 20px;min-width:0;border:1px solid var(--color-divider);background:transparent',
        on: inquiry ? { click: function (e) { e.preventDefault(); openModal('inquiry'); } } : null
      }, [
        el('span', {
          'data-idx': true, text: (i + 1 < 10 ? '0' : '') + (i + 1),
          style: 'font-size:10px;letter-spacing:.1em;color:var(--ink-2);font-variant-numeric:tabular-nums;transition:color .2s ease'
        }),
        el('span', { style: 'flex:1;min-width:0' }, [
          el('span', { style: 'display:block;font-size:17px;font-weight:800;letter-spacing:-.015em;line-height:1.15', text: l.label || '' }),
          el('span', { style: 'display:block;font-size:12px;color:var(--ink-2);margin-top:3px', text: l.sub || '' })
        ]),
        l.tag ? el('span', {
          class: 'tag tag-outline', text: l.tag,
          style: 'font-size:9px;letter-spacing:.14em;text-transform:uppercase;flex:none'
        }) : null,
        svgIcon(ICON.arrow, 16, { data: 'data-arrow', style: 'flex:none;transition:transform .3s cubic-bezier(.16,.8,.28,1)' })
      ]);
      grid.appendChild(a);
    });

    // video strip
    var videos = d.videos || [];
    var strip = $('#vidstrip');
    strip.textContent = '';
    videos.forEach(function (v) {
      strip.appendChild(el('a', {
        href: v.url || '#', target: '_blank', rel: 'noopener noreferrer',
        'data-rv': true, 'data-vid': true, 'data-magnet': true, class: 'vid-card',
        style: 'display:block;border:1px solid var(--color-divider)'
      }, [
        el('span', { style: 'display:block;aspect-ratio:9/13;overflow:hidden;background:var(--color-surface)' }, [
          el('img', {
            'data-vidimg': true, src: v.poster || '', alt: v.title || '', loading: 'lazy', class: 'grayscale',
            style: 'width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,.8,.28,1)'
          })
        ]),
        el('span', { style: 'display:flex;justify-content:space-between;gap:8px;padding:12px 12px 13px;font-size:11px;letter-spacing:.08em;text-transform:uppercase' }, [
          el('span', { style: 'color:var(--ink-2)', text: v.title || '' }),
          el('span', { style: 'font-weight:800', text: v.views || '' })
        ])
      ]));
    });

    // intro posters
    var introRow = $('#intro-row');
    introRow.textContent = '';
    videos.forEach(function (v, i) {
      introRow.appendChild(el('div', { style: 'animation:rise .55s cubic-bezier(.16,.8,.28,1) both;animation-delay:' + (i * 0.09).toFixed(2) + 's' }, [
        el('div', { 'data-box': true, style: 'aspect-ratio:9/14;background:var(--color-surface)' }, [
          el('img', { src: v.poster || '', alt: '', loading: 'eager', class: 'grayscale', style: 'width:100%;height:100%;object-fit:cover' })
        ]),
        el('div', { style: 'display:flex;justify-content:space-between;gap:8px;padding:8px 2px 0;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)' }, [
          el('span', { text: v.title || '' }),
          el('span', { style: 'color:var(--color-accent)', text: v.views || '' })
        ])
      ]));
    });

    // section order
    $('#sec-links').style.order = d.order.links;
    $('#sec-work').style.order = d.order.work;
    $('#sec-cta').style.order = d.order.cta;

    // music
    $('#volume').value = d.musicVolume != null ? d.musicVolume : DEFAULTS.musicVolume;
    if (audio && audio.src && d.musicUrl && audio.getAttribute && audio.getAttribute('src') !== d.musicUrl) {
      audio.src = d.musicUrl;
    }

    applyRoot();
    observeReveal();
  }

  /* ── pointer effects ───────────────────────────────────────────────── */
  function onMove(e) {
    var p = pointer;
    p.x = e.clientX; p.y = e.clientY;
    if (!moved) {
      moved = true;
      p.rx = p.x; p.ry = p.y; p.sx = p.x; p.sy = p.y;
      if (fxLive('cursor')) { ring.style.opacity = '1'; dot.style.opacity = '1'; }
      if (fxLive('spotlight')) spot.style.opacity = '1';
    }
    if (magnetEl) {
      var r = magnetEl.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
      var dy = (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1);
      magnetEl.style.transform = 'translate3d(' + (dx * 8).toFixed(2) + 'px,' + (dy * 8).toFixed(2) + 'px,0)';
    }
    if (tiltEl) {
      var rt = tiltEl.getBoundingClientRect();
      var tx = (e.clientX - (rt.left + rt.width / 2)) / Math.max(rt.width, 1);
      var ty = (e.clientY - (rt.top + rt.height / 2)) / Math.max(rt.height, 1);
      tiltEl.style.transform = 'perspective(900px) rotateY(' + (tx * 5).toFixed(2) + 'deg) rotateX(' + (-ty * 5).toFixed(2) + 'deg)';
    }
  }
  function onOver(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var m = fxLive('magnet') ? t.closest('[data-magnet]') : null;
    if (m && m !== magnetEl) { releaseMagnet(); magnetEl = m; }
    var ti = fxLive('tilt') ? t.closest('[data-tilt]') : null;
    if (ti && ti !== tiltEl) { releaseTilt(); tiltEl = ti; }
    if (t.closest('a,button,label,input,[data-tilt]')) pointer.want = 1.7;
  }
  function onOut(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (magnetEl && t.closest('[data-magnet]') === magnetEl) releaseMagnet();
    if (tiltEl && t.closest('[data-tilt]') === tiltEl) releaseTilt();
    if (t.closest('a,button,label,input,[data-tilt]')) pointer.want = 1;
  }
  function releaseMagnet() { if (magnetEl) { magnetEl.style.transform = ''; magnetEl = null; } }
  function releaseTilt() { if (tiltEl) { tiltEl.style.transform = ''; tiltEl = null; } }

  function tick() {
    var p = pointer;
    p.rx += (p.x - p.rx) * 0.18; p.ry += (p.y - p.ry) * 0.18;
    p.sx += (p.x - p.sx) * 0.06; p.sy += (p.y - p.sy) * 0.06;
    p.scale += (p.want - p.scale) * 0.15;
    dot.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0)';
    ring.style.transform = 'translate3d(' + p.rx.toFixed(1) + 'px,' + p.ry.toFixed(1) + 'px,0) scale(' + p.scale.toFixed(3) + ')';
    spot.style.transform = 'translate3d(' + p.sx.toFixed(1) + 'px,' + p.sy.toFixed(1) + 'px,0)';
    raf = requestAnimationFrame(tick);
  }

  function observeReveal() {
    if (!fxLive('reveal')) {
      $$('[data-rv]').forEach(function (n) { n.classList.add('rv-in'); });
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('rv-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    requestAnimationFrame(function () {
      $$('[data-rv]:not(.rv-in)').forEach(function (n) { io.observe(n); });
    });
  }

  var scrambling = false;
  function scramble() {
    var final = state.data.handle || '';
    if (!final) return;
    var chars = '#@$%&*+=/_·0123456789abcdefghijklmnopqrstuvwxyz';
    var frame = 0, total = 22;
    scrambling = true;
    (function run() {
      var p = frame / total;
      handleEl.textContent = final.split('').map(function (c, i) {
        if (c === ' ' || c === '.') return c;
        return i / final.length < p ? c : chars[(Math.random() * chars.length) | 0];
      }).join('');
      frame++;
      if (frame <= total) setTimeout(run, 34);
      else { handleEl.textContent = final; scrambling = false; }
    })();
  }

  function clickSound() {
    if (!fxLive('click')) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.035, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.07);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.08);
    } catch (e) {}
  }

  /* ── intro ─────────────────────────────────────────────────────────── */
  function introWanted() {
    try { return !sessionStorage.getItem(STORE + '_intro'); } catch (e) { return true; }
  }
  function endIntro() {
    clearTimeout(introTimer);
    try { sessionStorage.setItem(STORE + '_intro', '1'); } catch (e) {}
    document.documentElement.classList.add('intro-done');
    intro.style.display = 'none';
    observeReveal();
  }

  /* ── music ─────────────────────────────────────────────────────────── */
  function ensureAudio() {
    if (audio) return audio;
    var a = new Audio();
    a.loop = true;
    a.preload = 'metadata';
    a.volume = state.data.musicVolume != null ? state.data.musicVolume : DEFAULTS.musicVolume;
    if (state.data.musicUrl) a.src = state.data.musicUrl;
    a.addEventListener('timeupdate', function () {
      if (a.duration) fillEl.style.width = (a.currentTime / a.duration * 100) + '%';
      timeEl.textContent = fmt(a.currentTime);
    });
    audio = a;
    return a;
  }
  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function musicMsg(text) {
    var p = $('#music-msg');
    p.textContent = text || '';
    p.style.display = text ? 'block' : 'none';
  }
  function togglePlay() {
    var a = ensureAudio();
    if (!state.data.musicUrl) {
      musicMsg('No track yet — add an MP3 URL under Edit → Music.');
      return;
    }
    if (!a.getAttribute('src')) a.src = state.data.musicUrl;
    if (a.paused) {
      a.play().then(function () {
        state.playing = true;
        $('#play-icon').setAttribute('d', ICON.pause);
        musicMsg('');
      }).catch(function () {
        musicMsg('Browser blocked playback — tap play again.');
      });
    } else {
      a.pause();
      state.playing = false;
      $('#play-icon').setAttribute('d', ICON.play);
    }
  }

  /* ── overlays ──────────────────────────────────────────────────────── */
  function openModal(kind) {
    state.modal = kind;
    renderModal();
  }
  function closeModal() {
    state.modal = null;
    modalRoot.textContent = '';
  }

  function renderModal() {
    modalRoot.textContent = '';
    var kind = state.modal;
    if (!kind) return;

    var titles = { inquiry: state.data.formTitle, work: 'Selected results', login: 'Editor access', admin: 'Edit page' };
    var kickers = { inquiry: 'Straight to my inbox', work: 'TikTok campaigns', login: 'Protected', admin: 'Content, links, effects' };

    var panel = el('div', {
      'data-admin': true, 'data-scroll': true,
      style: 'width:min(560px,100%);height:100%;overflow-y:auto;background:var(--color-bg);border-left:2px solid var(--color-divider);padding:0 0 40px',
      on: { click: function (e) { e.stopPropagation(); } }
    }, [
      el('div', { style: 'position:sticky;top:0;z-index:2;background:var(--color-bg);border-bottom:2px solid var(--color-divider);padding:22px 30px;display:flex;align-items:center;justify-content:space-between;gap:16px' }, [
        el('div', {}, [
          el('div', { style: 'font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: kickers[kind] || '' }),
          el('h3', { style: 'margin:5px 0 0;font-size:24px;font-weight:800;letter-spacing:-.02em', text: titles[kind] || '' })
        ]),
        el('button', {
          type: 'button', 'aria-label': 'Close', class: 'btn btn-secondary btn-icon', 'data-magnet': true,
          style: 'border-color:var(--color-divider);flex:none', on: { click: closeModal }
        }, [svgIcon(ICON.close, 15)])
      ])
    ]);

    if (kind === 'inquiry') panel.appendChild(inquiryForm());
    if (kind === 'work') panel.appendChild(workList());
    if (kind === 'login') panel.appendChild(loginForm());
    if (kind === 'admin') panel.appendChild(adminPanel());

    var backdrop = el('div', {
      style: 'position:fixed;inset:0;z-index:80;background:color-mix(in srgb,#000 62%,transparent);backdrop-filter:blur(3px);display:flex;justify-content:flex-end;animation:fadein .22s ease',
      on: { click: closeModal }
    }, [panel]);

    modalRoot.appendChild(backdrop);
  }

  function inquiryForm() {
    var fields = [
      { name: 'name', label: 'Name / agency', type: 'text', ph: 'Who is writing?' },
      { name: 'email', label: 'Email', type: 'email', ph: 'you@label.com' },
      { name: 'artist', label: 'Artist / brand', type: 'text', ph: 'Whose sound is it?' },
      { name: 'link', label: 'Track link', type: 'url', ph: 'https://' }
    ];
    var budgets = [
      { value: '<500', label: '< $500' }, { value: '500-1000', label: '$500 – $1,000' },
      { value: '1000-5000', label: '$1,000 – $5,000' }, { value: '5000+', label: '$5,000+' }
    ];

    var status = el('p', { style: 'margin:0;font-size:13px;padding:12px 14px;border:1px solid var(--color-divider);background:var(--color-surface);display:none' });
    var submit = el('button', {
      type: 'submit', 'data-magnet': true, class: 'btn btn-primary', text: 'Send inquiry',
      style: 'font-size:13px;letter-spacing:.14em;text-transform:uppercase;padding:16px 22px;justify-content:flex-start'
    });

    function say(text) {
      status.textContent = text;
      status.style.display = text ? 'block' : 'none';
    }

    var form = el('form', { style: 'padding:26px 30px;display:flex;flex-direction:column;gap:16px' }, [
      el('p', { style: 'margin:0;font-size:14px;color:var(--ink-2)', text: state.data.formDesc || '' })
    ]);

    fields.forEach(function (f) {
      form.appendChild(el('label', { style: 'display:block' }, [
        el('span', { style: 'display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);margin-bottom:6px', text: f.label }),
        el('input', { class: 'input', name: f.name, type: f.type, required: true, placeholder: f.ph, style: 'min-height:44px;padding:10px 12px;font-size:14px' })
      ]));
    });

    var budgetWrap = el('div', { style: 'display:flex;flex-wrap:wrap;gap:2px' });
    budgets.forEach(function (b) {
      budgetWrap.appendChild(el('label', {
        class: 'seg-opt', style: 'border:1px solid var(--color-divider);padding:10px 14px;font-size:12px;letter-spacing:.06em'
      }, [
        el('input', { type: 'radio', name: 'budget', value: b.value, required: true }),
        b.label
      ]));
    });
    form.appendChild(el('div', {}, [
      el('span', { style: 'display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);margin-bottom:8px', text: 'Budget' }),
      budgetWrap
    ]));

    form.appendChild(el('label', { style: 'display:block' }, [
      el('span', { style: 'display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);margin-bottom:6px', text: 'Campaign details' }),
      el('textarea', { class: 'input', name: 'message', rows: '5', required: true, placeholder: 'Track, target markets, timing, budget split…', style: 'padding:12px;font-size:14px' })
    ]));

    form.appendChild(submit);
    form.appendChild(status);
    form.appendChild(el('p', { style: 'margin:0;font-size:11px;color:var(--ink-2)', text: 'No attachments — send files as a link.' }));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = state.data.formspree;
      if (!endpoint) { say('No form endpoint configured yet.'); return; }
      submit.disabled = true;
      submit.textContent = 'Sending…';
      say('');
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          submit.disabled = false;
          submit.textContent = 'Send inquiry';
          if (r.ok) { form.reset(); say('Sent. You will hear back within 24 hours.'); }
          else say('Something went wrong. Mail me directly instead.');
        })
        .catch(function () {
          submit.disabled = false;
          submit.textContent = 'Send inquiry';
          say('Network error. Mail me directly instead.');
        });
    });

    return form;
  }

  function workList() {
    var wrap = el('div', { style: 'padding:26px 30px;display:flex;flex-direction:column;gap:2px' });
    (state.data.videos || []).forEach(function (v) {
      wrap.appendChild(el('a', {
        href: v.url || '#', target: '_blank', rel: 'noopener noreferrer', 'data-row': true, class: 'work-row',
        style: 'display:flex;gap:18px;align-items:center;padding:14px;border:1px solid var(--color-divider)'
      }, [
        el('span', { style: 'display:block;width:78px;flex:none;aspect-ratio:9/13;overflow:hidden;background:var(--color-surface)' }, [
          el('img', { src: v.poster || '', alt: '', loading: 'lazy', class: 'grayscale', style: 'width:100%;height:100%;object-fit:cover' })
        ]),
        el('span', { style: 'flex:1;min-width:0' }, [
          el('span', { style: 'display:block;font-size:18px;font-weight:800;letter-spacing:-.015em', text: v.title || '' }),
          el('span', { style: 'display:block;font-size:12px;color:var(--ink-2);margin-top:4px', text: (v.views || '') + ' · TikTok' })
        ]),
        svgIcon(ICON.arrow, 16, { data: 'data-arrow', style: 'flex:none;transition:transform .3s ease' })
      ]));
    });
    return wrap;
  }

  function loginForm() {
    var pw = el('input', { class: 'input', type: 'password', placeholder: 'Password', autocomplete: 'off', style: 'min-height:44px;padding:10px 12px' });
    var err = el('p', { style: 'margin:0;font-size:12px;color:var(--color-accent);display:none' });
    var form = el('form', { style: 'padding:26px 30px;display:flex;flex-direction:column;gap:14px' }, [
      el('p', { style: 'margin:0;font-size:14px;color:var(--ink-2)', text: 'Enter the editor password to change content, links, music and effects.' }),
      pw, err,
      el('button', {
        type: 'submit', 'data-magnet': true, class: 'btn btn-primary', text: 'Unlock',
        style: 'font-size:13px;letter-spacing:.14em;text-transform:uppercase;padding:14px 22px;justify-content:flex-start'
      }),
      el('p', { style: 'margin:0;font-size:11px;color:var(--ink-2)', text: 'Client-side gate only: it keeps the panel tidy, it does not secure the file.' })
    ]);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (pw.value && pw.value === (state.data.password || DEFAULTS.password)) {
        state.unlocked = true;
        openModal('admin');
      } else {
        err.textContent = 'Wrong password.';
        err.style.display = 'block';
      }
    });
    return form;
  }

  /* ── admin panel ───────────────────────────────────────────────────── */
  function textField(label, value, ph, onInput) {
    return el('label', { style: 'display:block' }, [
      el('span', { style: 'display:block;font-size:11px;color:var(--ink-2);margin-bottom:5px', text: label }),
      el('input', { class: 'input', type: 'text', value: value || '', placeholder: ph || '', on: { input: onInput } })
    ]);
  }

  function adminPanel() {
    var d = state.data;
    var wrap = el('div', { style: 'padding:8px 30px 30px' });

    var groups = [
      { title: 'Profile', cols: '1fr 1fr', keys: [['handle', 'Handle'], ['avatar', 'Avatar URL'], ['tagline', 'Tagline'], ['availability', 'Availability line'], ['stat1Num', 'Stat 1'], ['stat1Label', 'Stat 1 label'], ['stat2Num', 'Stat 2'], ['stat2Label', 'Stat 2 label']] },
      { title: 'Hero', cols: '1fr', keys: [['heroKicker', 'Kicker'], ['heroTitle', 'Headline'], ['heroBody', 'Paragraph'], ['ctaPrimary', 'Primary button'], ['ctaSecondary', 'Secondary button']] },
      { title: 'Socials', cols: '1fr 1fr', keys: [['socialTiktok', 'TikTok'], ['socialInstagram', 'Instagram'], ['socialYoutube', 'YouTube'], ['socialFacebook', 'Facebook']] },
      { title: 'Music', cols: '1fr 1fr', keys: [['musicUrl', 'MP3 URL'], ['musicTitle', 'Track title'], ['musicArtist', 'Artist label'], ['bgImage', 'Background image URL']] },
      { title: 'Closing block', cols: '1fr', keys: [['closeTitle', 'Headline'], ['closeBody', 'Paragraph'], ['footerLeft', 'Footer left'], ['footerRight', 'Footer right']] },
      { title: 'Form', cols: '1fr', keys: [['formspree', 'Formspree endpoint'], ['formTitle', 'Form title'], ['formDesc', 'Form subtitle']] }
    ];

    groups.forEach(function (g) {
      var body = el('div', { style: 'display:grid;grid-template-columns:' + g.cols + ';gap:12px' });
      g.keys.forEach(function (pair) {
        var key = pair[0];
        body.appendChild(textField(pair[1], d[key], '', function (e) { set(key, e.target.value); }));
      });
      wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
        el('h4', { style: 'margin:0 0 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: g.title }),
        body
      ]));
    });

    // Videos
    var vidBody = el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:12px' });
    (d.videos || []).forEach(function (v, i) {
      [['title', 'Video ' + (i + 1) + ' title'], ['views', 'Views'], ['poster', 'Poster image'], ['url', 'TikTok link']].forEach(function (pair) {
        vidBody.appendChild(textField(pair[1], v[pair[0]], '', function (e) {
          var vids = clone(state.data.videos || []);
          vids[i][pair[0]] = e.target.value;
          set('videos', vids);
        }));
      });
    });
    wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
      el('h4', { style: 'margin:0 0 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Videos' }),
      vidBody
    ]));

    // Link cards
    var linkList = el('div', { style: 'display:flex;flex-direction:column;gap:10px' });
    function iconBtn(path, label, onClick, accent) {
      return el('button', {
        type: 'button', 'aria-label': label, class: 'btn btn-secondary btn-icon',
        style: 'width:28px;height:28px;border-color:var(--color-divider)' + (accent ? ';color:var(--color-accent)' : ''),
        on: { click: onClick }
      }, [svgIcon(path, 13, { width: '2' })]);
    }
    function linkOp(fn) {
      var links = clone(state.data.links || []);
      fn(links);
      set('links', links);
      buildLinkRows();
    }
    function buildLinkRows() {
      linkList.textContent = '';
      (state.data.links || []).forEach(function (l, i) {
        var mk = function (key, ph) {
          return el('input', {
            class: 'input', type: 'text', value: l[key] || '', placeholder: ph,
            on: { input: function (e) { var ls = clone(state.data.links); ls[i][key] = e.target.value; set('links', ls); } }
          });
        };
        linkList.appendChild(el('div', { style: 'border:1px solid var(--color-divider);padding:12px;display:flex;flex-direction:column;gap:8px' }, [
          el('div', { style: 'display:flex;gap:8px;align-items:center' }, [
            el('span', { style: 'font-size:11px;color:var(--ink-2);flex:1', text: 'Link ' + (i + 1) }),
            iconBtn(ICON.up, 'Move up', function () { if (i > 0) linkOp(function (ls) { var t = ls[i - 1]; ls[i - 1] = ls[i]; ls[i] = t; }); }),
            iconBtn(ICON.down, 'Move down', function () { linkOp(function (ls) { if (i < ls.length - 1) { var t = ls[i + 1]; ls[i + 1] = ls[i]; ls[i] = t; } }); }),
            iconBtn(ICON.close, 'Remove', function () { linkOp(function (ls) { ls.splice(i, 1); }); }, true)
          ]),
          mk('label', 'Label'),
          mk('sub', 'Subtitle'),
          el('div', { style: 'display:grid;grid-template-columns:2fr 1fr;gap:8px' }, [mk('url', 'https://…'), mk('tag', 'Tag')])
        ]));
      });
    }
    buildLinkRows();

    wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
      el('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px' }, [
        el('h4', { style: 'margin:0;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Link cards' }),
        el('button', {
          type: 'button', class: 'btn btn-secondary', text: 'Add link',
          style: 'font-size:11px;letter-spacing:.1em;text-transform:uppercase;border-color:var(--color-divider)',
          on: { click: function () { linkOp(function (ls) { ls.push({ label: 'New link', sub: '', url: 'https://', tag: '' }); }); } }
        })
      ]),
      linkList
    ]));

    // Section order
    var orderList = el('div', { style: 'display:flex;flex-direction:column;gap:2px' });
    function moveSection(key, otherKey) {
      if (!otherKey) return;
      var o = Object.assign({}, state.data.order);
      var t = o[key]; o[key] = o[otherKey]; o[otherKey] = t;
      set('order', o);
      buildOrderRows();
    }
    function buildOrderRows() {
      orderList.textContent = '';
      var rows = [{ k: 'links', label: 'Links' }, { k: 'work', label: 'Selected results' }, { k: 'cta', label: 'Closing block' }]
        .sort(function (a, b) { return (state.data.order[a.k] || 0) - (state.data.order[b.k] || 0); });
      rows.forEach(function (row, i) {
        orderList.appendChild(el('div', { style: 'display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--color-divider)' }, [
          el('span', { style: 'flex:1;font-size:13px', text: row.label }),
          iconBtn(ICON.up, 'Move up', function () { moveSection(row.k, rows[i - 1] && rows[i - 1].k); }),
          iconBtn(ICON.down, 'Move down', function () { moveSection(row.k, rows[i + 1] && rows[i + 1].k); })
        ]));
      });
    }
    buildOrderRows();
    wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
      el('h4', { style: 'margin:0 0 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Section order' }),
      orderList
    ]));

    // Effects
    var fxBody = el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px' });
    Object.keys(FX_LABELS).forEach(function (k) {
      var box = el('input', { type: 'checkbox', style: 'width:14px;height:14px;accent-color:var(--color-accent)' });
      box.checked = state.data.fx[k] !== false;
      box.addEventListener('change', function () {
        var next = Object.assign({}, state.data.fx);
        next[k] = box.checked;
        set('fx', next);
        if (k === 'magnet') releaseMagnet();
        if (k === 'tilt') releaseTilt();
      });
      fxBody.appendChild(el('label', {
        style: 'display:flex;align-items:center;gap:9px;padding:9px 11px;border:1px solid var(--color-divider);font-size:12px;cursor:pointer'
      }, [box, FX_LABELS[k]]));
    });
    wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
      el('h4', { style: 'margin:0 0 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Effects' }),
      fxBody
    ]));

    // Security
    wrap.appendChild(el('div', { style: 'padding:22px 0;border-bottom:1px solid var(--hair)' }, [
      el('h4', { style: 'margin:0 0 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Security' }),
      el('div', { style: 'display:grid;grid-template-columns:1fr;gap:12px' }, [
        textField('Editor password', d.password, '', function (e) { set('password', e.target.value); })
      ])
    ]));

    // Save
    var note = el('p', { style: 'margin:0;font-size:12px;color:var(--color-accent);display:none' });
    function say(t) { note.textContent = t; note.style.display = t ? 'block' : 'none'; }

    var fileInput = el('input', {
      type: 'file', accept: 'application/json', style: 'display:none',
      on: {
        change: function (e) {
          var f = e.target.files && e.target.files[0];
          if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            try {
              persist(merge(DEFAULTS, JSON.parse(r.result)));
              say('Imported.');
              openModal('admin');
            } catch (err) { say('That file is not valid JSON.'); }
          };
          r.readAsText(f);
        }
      }
    });

    wrap.appendChild(el('div', { style: 'padding:22px 0;display:flex;flex-direction:column;gap:10px' }, [
      el('h4', { style: 'margin:0 0 4px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--color-accent)', text: 'Save' }),
      el('p', { style: 'margin:0;font-size:12px;color:var(--ink-2)', html: 'Every change is stored in this browser immediately. Export <code>data.json</code> and commit it to the repo to publish it for everyone.' }),
      el('div', { style: 'display:flex;flex-wrap:wrap;gap:2px' }, [
        el('button', {
          type: 'button', 'data-magnet': true, class: 'btn btn-primary', text: 'Export data.json',
          style: 'font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:13px 18px',
          on: {
            click: function () {
              var blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
              var a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'data.json';
              a.click();
              setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
              say('data.json downloaded — commit it to the repo to publish.');
            }
          }
        }),
        el('label', {
          class: 'btn btn-secondary',
          style: 'font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:13px 18px;border-color:var(--color-divider);cursor:pointer'
        }, ['Import', fileInput]),
        el('button', {
          type: 'button', class: 'btn btn-secondary', text: 'Reset',
          style: 'font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:13px 18px;border-color:var(--color-divider);color:var(--color-accent)',
          on: {
            click: function () {
              if (!confirm('Reset all content to defaults?')) return;
              try { localStorage.removeItem(STORE); } catch (e) {}
              state.data = merge(DEFAULTS);
              applyData();
              loadRemote().then(function () { openModal('admin'); });
              say('Reset.');
            }
          }
        })
      ]),
      note
    ]));

    return wrap;
  }

  /* ── boot ──────────────────────────────────────────────────────────── */
  function init() {
    root = $('#root');
    ring = $('#ring'); dot = $('#dot'); spot = $('#spot'); grain = $('#grain');
    intro = $('#intro'); handleEl = $('#handle');
    fillEl = $('#fill'); timeEl = $('#time'); modalRoot = $('#modal-root');

    if (!introWanted()) intro.style.display = 'none';

    applyData();
    loadRemote();

    if (fxLive('scramble')) scramble();

    pointer = {
      x: innerWidth / 2, y: innerHeight / 2,
      rx: innerWidth / 2, ry: innerHeight / 2,
      sx: innerWidth / 2, sy: innerHeight / 2,
      scale: 1, want: 1
    };
    if (fine) {
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerover', onOver, { passive: true });
      addEventListener('pointerout', onOut, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (intro.style.display !== 'none') endIntro();
      else if (state.modal) closeModal();
    });
    addEventListener('click', clickSound, true);

    $$('.js-skip').forEach(function (b) { b.addEventListener('click', endIntro); });
    if (introWanted()) introTimer = setTimeout(endIntro, 3200);

    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.js-inquiry')) openModal('inquiry');
      else if (e.target.closest && e.target.closest('.js-work')) openModal('work');
    });

    $('#theme-btn').addEventListener('click', function () {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORE + '_theme', state.theme); } catch (e) {}
      applyRoot();
    });

    $('#fx-btn').addEventListener('click', function () {
      state.fxOn = !state.fxOn;
      try { localStorage.setItem(STORE + '_fx', state.fxOn ? '1' : '0'); } catch (e) {}
      if (!state.fxOn) { releaseMagnet(); releaseTilt(); }
      applyRoot();
      $('#marquee').style.animationPlayState = fxLive('marquee') ? 'running' : 'paused';
      observeReveal();
    });

    $('#edit-btn').addEventListener('click', function () {
      openModal(state.unlocked ? 'admin' : 'login');
    });

    $('#play-btn').addEventListener('click', togglePlay);

    $('#track').addEventListener('click', function (e) {
      var a = ensureAudio();
      if (!a.duration) return;
      var r = e.currentTarget.getBoundingClientRect();
      a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    });

    $('#volume').addEventListener('input', function (e) {
      var v = parseFloat(e.target.value);
      ensureAudio().volume = v;
      var d = Object.assign({}, state.data);
      d.musicVolume = v;
      state.data = d;
      try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (err) {}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
