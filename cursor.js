/* =========================================================
   CUSTOM CURSOR
   Dot + trailing ring, comet trail, click ripple, magnetic
   buttons and a spotlight that follows the pointer on cards.
   Only runs on devices with a real (fine) pointer and when the
   visitor has not asked for reduced motion.
   ========================================================= */
(function () {
    'use strict';

    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    var HOVER_SELECTOR = 'a, button, .link-card, .interactive-hover, .social-icon, ' +
        '.intro-vid-card, .intro-dot, .control-btn, select, input[type="range"], [role="button"]';
    var TEXT_SELECTOR = 'input:not([type="range"]):not([type="submit"]):not([type="button"]), textarea';
    var MAGNET_SELECTOR = '.social-icon, .control-btn, .submit-btn, .settings-close-btn, .login-btn, .preview-close';
    var SPOTLIGHT_SELECTOR = '.link-card, .profile-sidebar, .intro-vid-card';
    var TRAIL_COUNT = 8;

    // ---------- elements ----------
    var root = document.createElement('div');
    root.className = 'cursor-root';
    root.setAttribute('aria-hidden', 'true');

    var trailWrap = document.createElement('div');
    trailWrap.className = 'cursor-trail';
    for (var i = 0; i < TRAIL_COUNT; i++) trailWrap.appendChild(document.createElement('i'));

    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';

    root.appendChild(trailWrap);
    root.appendChild(ring);
    root.appendChild(dot);
    document.body.appendChild(root);
    document.documentElement.classList.add('has-cursor');

    // ---------- state ----------
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX, ringY = mouseY;
    var scale = 1, targetScale = 1;
    var pressed = false, hovering = false;
    var magnetEl = null, spotlightEl = null;
    var started = false;

    var trail = [];
    var trailNodes = trailWrap.children;
    for (var t = 0; t < trailNodes.length; t++) {
        trail.push({ el: trailNodes[t], x: mouseX, y: mouseY });
    }

    function computeTargetScale() {
        if (pressed) return hovering ? 1.35 : 0.7;
        return hovering ? 1.75 : 1;
    }

    // ---------- pointer tracking ----------
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!started) {
            started = true;
            ringX = mouseX; ringY = mouseY;
            for (var k = 0; k < trail.length; k++) { trail[k].x = mouseX; trail[k].y = mouseY; }
            document.documentElement.classList.add('has-cursor');
        }
        root.classList.remove('is-out');

        var target = e.target;
        var isText = target.closest ? !!target.closest(TEXT_SELECTOR) : false;
        var isHover = !isText && target.closest ? !!target.closest(HOVER_SELECTOR) : false;

        hovering = isHover;
        root.classList.toggle('is-hover', isHover);
        root.classList.toggle('is-text', isText);
        targetScale = computeTargetScale();

        var nextMagnet = target.closest ? target.closest(MAGNET_SELECTOR) : null;
        if (nextMagnet !== magnetEl) {
            if (magnetEl) {
                magnetEl.classList.remove('is-pulled');
                magnetEl.style.transform = '';
            }
            magnetEl = nextMagnet;
            if (magnetEl) magnetEl.classList.add('magnetic', 'is-pulled');
        }

        var nextSpot = target.closest ? target.closest(SPOTLIGHT_SELECTOR) : null;
        if (nextSpot !== spotlightEl) {
            if (spotlightEl) {
                spotlightEl.style.removeProperty('--mx');
                spotlightEl.style.removeProperty('--my');
            }
            spotlightEl = nextSpot;
        }
    }, { passive: true });

    document.addEventListener('mousedown', function (e) {
        pressed = true;
        targetScale = computeTargetScale();

        var ripple = document.createElement('span');
        ripple.className = 'cursor-ripple';
        ripple.style.setProperty('--x', e.clientX + 'px');
        ripple.style.setProperty('--y', e.clientY + 'px');
        root.appendChild(ripple);
        ripple.addEventListener('animationend', function () {
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        });
    });

    document.addEventListener('mouseup', function () {
        pressed = false;
        targetScale = computeTargetScale();
    });

    document.addEventListener('mouseleave', function () { root.classList.add('is-out'); });
    document.addEventListener('mouseenter', function () { root.classList.remove('is-out'); });
    window.addEventListener('blur', function () { root.classList.add('is-out'); });

    // A hybrid device that gets touched: hand the native behaviour back
    window.addEventListener('touchstart', function () {
        document.documentElement.classList.remove('has-cursor');
        if (magnetEl) { magnetEl.classList.remove('is-pulled'); magnetEl.style.transform = ''; magnetEl = null; }
    }, { passive: true });

    // ---------- render loop ----------
    function frame() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        scale += (targetScale - scale) * 0.18;

        dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0)';
        ring.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) scale(' + scale.toFixed(3) + ')';

        var px = mouseX, py = mouseY;
        for (var i = 0; i < trail.length; i++) {
            var node = trail[i];
            node.x += (px - node.x) * 0.34;
            node.y += (py - node.y) * 0.34;
            node.el.style.transform = 'translate3d(' + node.x.toFixed(2) + 'px, ' + node.y.toFixed(2) + 'px, 0)';
            px = node.x; py = node.y;
        }

        if (magnetEl) {
            var r = magnetEl.getBoundingClientRect();
            var dx = (mouseX - (r.left + r.width / 2)) * 0.3;
            var dy = (mouseY - (r.top + r.height / 2)) * 0.3;
            var limit = 12;
            dx = Math.max(-limit, Math.min(limit, dx));
            dy = Math.max(-limit, Math.min(limit, dy));
            magnetEl.style.transform = 'translate3d(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px, 0) scale(1.06)';
        }

        if (spotlightEl) {
            var sr = spotlightEl.getBoundingClientRect();
            spotlightEl.style.setProperty('--mx', (mouseX - sr.left).toFixed(1) + 'px');
            spotlightEl.style.setProperty('--my', (mouseY - sr.top).toFixed(1) + 'px');
        }

        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();
