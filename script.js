/* ============================================================
   NIIKODEV PORTFOLIO — script.js
   Кастомный курсор: точка + хвост из сегментов + параллакс фона
   ============================================================ */

(function () {
    'use strict';

    /* ------------------------------------------------------------
       ЭЛЕМЕНТЫ
       ------------------------------------------------------------ */
    const dot        = document.getElementById('cursorDot');
    const tailHolder = document.getElementById('cursorTail');
    const body       = document.body;

    /* ------------------------------------------------------------
       НАСТРОЙКИ ХВОСТА
       ------------------------------------------------------------ */
    const SEGMENTS    = 14;    // количество сегментов в хвосте
    const SEGMENT_LERP = 0.35; // плавность каждого сегмента (чем меньше — тем длиннее хвост)

    /* ------------------------------------------------------------
       СОЗДАЁМ СЕГМЕНТЫ ХВОСТА
       Каждый следующий — меньше и прозрачнее
       ------------------------------------------------------------ */
    const segments = [];

    for (let i = 0; i < SEGMENTS; i++) {
        const seg = document.createElement('div');
        seg.className = 'cursor-segment';

        // Размер: от 100% у первого до ~20% у последнего
        const sizeRatio = 1 - (i / SEGMENTS) * 0.8;
        const size      = 14 * sizeRatio;

        // Прозрачность: от 0.9 до 0.05
        const opacity   = 0.9 - (i / SEGMENTS) * 0.85;

        seg.style.width   = size + 'px';
        seg.style.height  = size + 'px';
        seg.style.opacity = opacity;

        tailHolder.appendChild(seg);
        segments.push({
            el: seg,
            x: window.innerWidth  / 2,
            y: window.innerHeight / 2
        });
    }

    /* ------------------------------------------------------------
       КООРДИНАТЫ
       ------------------------------------------------------------ */
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;

    const DOT_LERP = 0.45; // точка — почти мгновенно следует за мышью

    /* ------------------------------------------------------------
       ОБРАБОТЧИК ДВИЖЕНИЯ МЫШИ
       ------------------------------------------------------------ */
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    /* ------------------------------------------------------------
       АНИМАЦИОННЫЙ ЦИКЛ
       ------------------------------------------------------------ */
    function animate() {
        /* --- Точка --- */
        dotX += (mouseX - dotX) * DOT_LERP;
        dotY += (mouseY - dotY) * DOT_LERP;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        /* --- Хвост --- */
        let prevX = dotX;
        let prevY = dotY;

        for (let i = 0; i < segments.length; i++) {
            const s = segments[i];

            // Каждый сегмент догоняет предыдущий
            s.x += (prevX - s.x) * SEGMENT_LERP;
            s.y += (prevY - s.y) * SEGMENT_LERP;

            s.el.style.transform =
                `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;

            // Для следующего сегмента «предыдущий» — это текущий
            prevX = s.x;
            prevY = s.y;
        }

        /* --- Параллакс фона --- */
        const mx = (mouseX / window.innerWidth  - 0.5) * 2;
        const my = (mouseY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--mx', mx.toFixed(3));
        document.documentElement.style.setProperty('--my', my.toFixed(3));

        requestAnimationFrame(animate);
    }
    animate();

    /* ------------------------------------------------------------
       HOVER-ЭФФЕКТ НА ИНТЕРАКТИВНЫХ ЭЛЕМЕНТАХ
       ------------------------------------------------------------ */
    const hoverTargets = document.querySelectorAll(
        'a, button, .social-btn, .skill-tags li, [role="button"]'
    );

    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('is-hover');
            tailHolder.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('is-hover');
            tailHolder.classList.remove('is-hover');
        });
    });

    /* ------------------------------------------------------------
       КЛИК — «вспышка» курсора
       ------------------------------------------------------------ */
    document.addEventListener('mousedown', () => {
        dot.classList.add('is-click');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('is-click');
    });

    /* ------------------------------------------------------------
       СКРЫТИЕ КУРСОРА ЗА ПРЕДЕЛАМИ ОКНА
       ------------------------------------------------------------ */
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        tailHolder.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        tailHolder.style.opacity = '1';
    });

    /* ------------------------------------------------------------
       ОТКЛЮЧАЕМ НА ТАЧ-УСТРОЙСТВАХ
       ------------------------------------------------------------ */
    if (window.matchMedia('(hover: none)').matches) {
        if (dot)        dot.style.display        = 'none';
        if (tailHolder) tailHolder.style.display = 'none';
        body.style.cursor = 'auto';
    }
})();
