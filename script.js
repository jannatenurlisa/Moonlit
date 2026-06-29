// ── STAR FIELD ───────────────────────────────────────

function generateStars(count) {
    const container = document.getElementById('stars-container');
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 0.5;
        const duration = Math.random() * 2 + 3;
        const opacityLow = (Math.random() * 0.2 + 0.05).toFixed(2);
        const opacityHigh = (Math.random() * 0.5 + 0.5).toFixed(2);
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--opacity-low', opacityLow);
        star.style.setProperty('--opacity-high', opacityHigh);
        star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
        container.appendChild(star);
    }
}

// ── SHOOTING STARS ───────────────────────────────────

function triggerShootingStar() {
    const el = document.getElementById('shooting-star');
    const startX = Math.random() * 80;
    const startY = Math.random() * 80;
    const angle = Math.random() * 25 + 10;
    el.style.left = `${startX}%`;
    el.style.top = `${startY}%`;
    el.style.setProperty('--angle', `${angle}deg`);
    el.style.animation = 'none';
    setTimeout(() => {
        el.style.animation = 'shoot 0.7s ease-out forwards';
    }, 10);
    const nextTime = Math.random() * 5000 + 3000;
    setTimeout(triggerShootingStar, nextTime);
}

// ── MOON AGE ─────────────────────────────────────────

function getMoonAge(date) {
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const synodicMonth = 29.530588853;
    const diffMs = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    let age = diffDays % synodicMonth;
    if (age < 0) age += synodicMonth;
    return age;
}

// ── PHASE INFO ───────────────────────────────────────

function getPhaseInfo(moonAge) {
    const synodicMonth = 29.530588853;
    const illumination = (1 - Math.cos((2 * Math.PI * moonAge) / synodicMonth)) / 2;
    const illuminationPercent = Math.round(illumination * 100);
    let name, description;
    if (moonAge < 1.84566) { name = "New Moon"; description = "The moon is invisible, lost in the sun's glare."; }
    else if (moonAge < 5.53699) { name = "Waxing Crescent"; description = "A thin crescent grows on the right side."; }
    else if (moonAge < 9.22831) { name = "First Quarter"; description = "Half the moon is illuminated, growing fuller."; }
    else if (moonAge < 12.91963) { name = "Waxing Gibbous"; description = "Almost full, light continues to grow."; }
    else if (moonAge < 16.61096) { name = "Full Moon"; description = "The entire face of the moon is illuminated."; }
    else if (moonAge < 20.30228) { name = "Waning Gibbous"; description = "Light begins to shrink from the right side."; }
    else if (moonAge < 23.99361) { name = "Last Quarter"; description = "Half illuminated again, shrinking toward new."; }
    else if (moonAge < 27.68493) { name = "Waning Crescent"; description = "A thin crescent fades before the next new moon."; }
    else { name = "New Moon"; description = "The moon is invisible, lost in the sun's glare."; }
    const degrees = (moonAge / synodicMonth) * 360;
    return { name, description, illuminationPercent, degrees: degrees.toFixed(2) };
}

// ── RENDER MOON ──────────────────────────────────────

function renderMoon(svgElement, moonAge, size) {
    const ns = "http://www.w3.org/2000/svg";
    const c = size / 2;
    const r = size / 2 - 4;
    const uid = Math.random().toString(36).substr(2, 9);

    svgElement.innerHTML = "";

    const defs = document.createElementNS(ns, "defs");

    const gradId = `grad-${uid}`;
    const grad = document.createElementNS(ns, "radialGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("cx", "38%");
    grad.setAttribute("cy", "35%");
    grad.setAttribute("r", "70%");
    const s1 = document.createElementNS(ns, "stop");
    s1.setAttribute("offset", "0%");
    s1.setAttribute("stop-color", "#f0ede4");
    const s2 = document.createElementNS(ns, "stop");
    s2.setAttribute("offset", "100%");
    s2.setAttribute("stop-color", "#9aa4bc");
    grad.appendChild(s1);
    grad.appendChild(s2);
    defs.appendChild(grad);

    const synodicMonth = 29.530588853;
    const halfCycle = synodicMonth / 2;
    const shadowRatio = Math.abs(moonAge - halfCycle) / halfCycle;
    const isWaxing = moonAge < halfCycle;

    const maskId = `mask-${uid}`;
    const mask = document.createElementNS(ns, "mask");
    mask.setAttribute("id", maskId);

    const maskBg = document.createElementNS(ns, "circle");
    maskBg.setAttribute("cx", c);
    maskBg.setAttribute("cy", c);
    maskBg.setAttribute("r", r);
    maskBg.setAttribute("fill", "black");
    mask.appendChild(maskBg);

    const litRect = document.createElementNS(ns, "rect");
    litRect.setAttribute("y", 0);
    litRect.setAttribute("width", r);
    litRect.setAttribute("height", size);
    litRect.setAttribute("fill", "white");
    if (isWaxing) {
        litRect.setAttribute("x", c);
    } else {
        litRect.setAttribute("x", c - r);
    }
    mask.appendChild(litRect);

    const ellipseRx = r * Math.abs(1 - 2 * shadowRatio);
    const terminator = document.createElementNS(ns, "ellipse");
    terminator.setAttribute("cx", c);
    terminator.setAttribute("cy", c);
    terminator.setAttribute("rx", ellipseRx);
    terminator.setAttribute("ry", r);
    terminator.setAttribute("fill", shadowRatio > 0.5 ? "black" : "white");
    mask.appendChild(terminator);

    defs.appendChild(mask);
    svgElement.appendChild(defs);

    const darkCircle = document.createElementNS(ns, "circle");
    darkCircle.setAttribute("cx", c);
    darkCircle.setAttribute("cy", c);
    darkCircle.setAttribute("r", r);
    darkCircle.setAttribute("fill", "#111827");
    svgElement.appendChild(darkCircle);

    const litGroup = document.createElementNS(ns, "g");
    litGroup.setAttribute("mask", `url(#${maskId})`);

    const litCircle = document.createElementNS(ns, "circle");
    litCircle.setAttribute("cx", c);
    litCircle.setAttribute("cy", c);
    litCircle.setAttribute("r", r);
    litCircle.setAttribute("fill", `url(#${gradId})`);
    litGroup.appendChild(litCircle);

    const craters = [
        { cx: 0.35, cy: 0.30, r: 0.09 },
        { cx: 0.60, cy: 0.25, r: 0.05 },
        { cx: 0.50, cy: 0.55, r: 0.12 },
        { cx: 0.25, cy: 0.65, r: 0.06 },
        { cx: 0.70, cy: 0.60, r: 0.08 },
        { cx: 0.40, cy: 0.75, r: 0.04 },
    ];
    craters.forEach(cr => {
        const circle = document.createElementNS(ns, "circle");
        circle.setAttribute("cx", cr.cx * size);
        circle.setAttribute("cy", cr.cy * size);
        circle.setAttribute("r", cr.r * size);
        circle.setAttribute("fill", "rgba(80, 90, 120, 0.18)");
        litGroup.appendChild(circle);
    });
    svgElement.appendChild(litGroup);

    craters.forEach(cr => {
        const circle = document.createElementNS(ns, "circle");
        circle.setAttribute("cx", cr.cx * size);
        circle.setAttribute("cy", cr.cy * size);
        circle.setAttribute("r", cr.r * size);
        circle.setAttribute("fill", "rgba(60, 80, 130, 0.13)");
        svgElement.appendChild(circle);
    });

    if (shadowRatio > 0.02 && shadowRatio < 0.98) {
        const glowId = `glow-${uid}`;
        const glowFilter = document.createElementNS(ns, "filter");
        glowFilter.setAttribute("id", glowId);
        glowFilter.setAttribute("x", "-30%");
        glowFilter.setAttribute("y", "-5%");
        glowFilter.setAttribute("width", "160%");
        glowFilter.setAttribute("height", "110%");
        const blur = document.createElementNS(ns, "feGaussianBlur");
        blur.setAttribute("stdDeviation", "5");
        glowFilter.appendChild(blur);
        defs.appendChild(glowFilter);

        const glowEllipse = document.createElementNS(ns, "ellipse");
        glowEllipse.setAttribute("cx", c);
        glowEllipse.setAttribute("cy", c);
        glowEllipse.setAttribute("rx", Math.max(ellipseRx, 4));
        glowEllipse.setAttribute("ry", r * 0.95);
        glowEllipse.setAttribute("fill", "rgba(180, 200, 255, 0.06)");
        glowEllipse.setAttribute("filter", `url(#${glowId})`);
        svgElement.appendChild(glowEllipse);
    }
}

// ── CLOCK ────────────────────────────────────────────

function buildClockFace(svgElement) {
    const ns = "http://www.w3.org/2000/svg";
    const c = 60;
    const r = 56;
    svgElement.innerHTML = "";

    const face = document.createElementNS(ns, "circle");
    face.setAttribute("cx", c); face.setAttribute("cy", c); face.setAttribute("r", r);
    face.setAttribute("fill", "none");
    face.setAttribute("stroke", "rgba(180,200,255,0.3)");
    face.setAttribute("stroke-width", "1");
    svgElement.appendChild(face);

    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        const isMajor = i % 3 === 0;
        const tickLength = isMajor ? 8 : 5;
        const x1 = c + (r - tickLength) * Math.sin(angle);
        const y1 = c - (r - tickLength) * Math.cos(angle);
        const x2 = c + r * Math.sin(angle);
        const y2 = c - r * Math.cos(angle);
        const tick = document.createElementNS(ns, "line");
        tick.setAttribute("x1", x1); tick.setAttribute("y1", y1);
        tick.setAttribute("x2", x2); tick.setAttribute("y2", y2);
        tick.setAttribute("stroke", "rgba(232,238,255,0.6)");
        tick.setAttribute("stroke-width", isMajor ? 1.5 : 1);
        svgElement.appendChild(tick);
    }

    const hourHand = document.createElementNS(ns, "line");
    hourHand.setAttribute("id", "hour-hand");
    hourHand.setAttribute("x1", c); hourHand.setAttribute("y1", c);
    hourHand.setAttribute("stroke", "#e8eeff");
    hourHand.setAttribute("stroke-width", "3");
    hourHand.setAttribute("stroke-linecap", "round");
    svgElement.appendChild(hourHand);

    const minHand = document.createElementNS(ns, "line");
    minHand.setAttribute("id", "minute-hand");
    minHand.setAttribute("x1", c); minHand.setAttribute("y1", c);
    minHand.setAttribute("stroke", "#e8eeff");
    minHand.setAttribute("stroke-width", "2");
    minHand.setAttribute("stroke-linecap", "round");
    svgElement.appendChild(minHand);

    const secHand = document.createElementNS(ns, "line");
    secHand.setAttribute("id", "second-hand");
    secHand.setAttribute("x1", c); secHand.setAttribute("y1", c);
    secHand.setAttribute("stroke", "rgba(200,168,75,0.85)");
    secHand.setAttribute("stroke-width", "1");
    secHand.setAttribute("stroke-linecap", "round");
    svgElement.appendChild(secHand);

    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", c); dot.setAttribute("cy", c);
    dot.setAttribute("r", "2.5"); dot.setAttribute("fill", "#c8a84b");
    svgElement.appendChild(dot);
}

function updateClockHands(date) {
    const c = 60;
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const hourAngle = ((hours + minutes / 60) * 30) * (Math.PI / 180);
    const minAngle = ((minutes + seconds / 60) * 6) * (Math.PI / 180);
    const secAngle = (seconds * 6) * (Math.PI / 180);

    document.getElementById('hour-hand').setAttribute("x2", c + 28 * Math.sin(hourAngle));
    document.getElementById('hour-hand').setAttribute("y2", c - 28 * Math.cos(hourAngle));
    document.getElementById('minute-hand').setAttribute("x2", c + 40 * Math.sin(minAngle));
    document.getElementById('minute-hand').setAttribute("y2", c - 40 * Math.cos(minAngle));
    document.getElementById('second-hand').setAttribute("x2", c + 46 * Math.sin(secAngle));
    document.getElementById('second-hand').setAttribute("y2", c - 46 * Math.cos(secAngle));
}

function startClock() {
    buildClockFace(document.getElementById('clock'));
    function tick() {
        const now = new Date();
        updateClockHands(now);
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clock-time').textContent = `${hh}:${mm}:${ss}`;
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        document.getElementById('clock-date').textContent =
            `${now.getDate()}  ${months[now.getMonth()]} , ${now.getFullYear()}`;
    }
    setInterval(tick, 1000);
    tick();
}

// ── ZODIAC ───────────────────────────────────────────

function getMoonZodiacSign(date) {
    const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / (1000 * 60 * 60 * 24);
    let longitude = (218.316 + 13.176396 * daysSinceJ2000) % 360;
    if (longitude < 0) longitude += 360;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(longitude / 30)];
}

// ── HERO PHASE ───────────────────────────────────────

function updateHeroPhase(date) {
    const moonAge = getMoonAge(date);
    const phase = getPhaseInfo(moonAge);
    const zodiac = getMoonZodiacSign(date);
    const synodicMonth = 29.530588853;

    renderMoon(document.getElementById('hero-moon'), moonAge, 280);

    document.getElementById('phase-name').textContent = phase.name;
    document.getElementById('phase-description').textContent = phase.description;
    document.getElementById('illumination').textContent = `${phase.illuminationPercent}%`;
    document.getElementById('degrees').textContent = `${phase.degrees}°`;
    document.getElementById('zodiac-sign').textContent = zodiac;

    const cyclePercent = Math.round((moonAge / synodicMonth) * 100);
    document.getElementById('cycle-progress').textContent =
        `Day ${moonAge.toFixed(1)} of 29.53 · ${cyclePercent}% through cycle`;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    document.getElementById('today-date').textContent =
        `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    const heroMoonEl = document.getElementById('hero-moon');
    const fullMoonData = getFullMoonData(date.getMonth(), date.getDate(), date.getFullYear());
    if (phase.name === "Full Moon" && fullMoonData) {
        heroMoonEl.style.filter = `drop-shadow(0 0 25px ${fullMoonData.color})`;
    } else {
        heroMoonEl.style.filter = '';
    }
}

// ── PHASE TIMELINE ───────────────────────────────────

function buildPhaseTimeline(date) {
    const synodicMonth = 29.530588853;
    const currentMoonAge = getMoonAge(date);
    const phaseStarts = [
        { age: 0, renderAge: 0, name: "New Moon" },
        { age: 1.84566, renderAge: 3.69, name: "Waxing Crescent" },
        { age: 5.53699, renderAge: 7.38, name: "First Quarter" },
        { age: 9.22831, renderAge: 11.07, name: "Waxing Gibbous" },
        { age: 12.91963, renderAge: 14.765, name: "Full Moon" },
        { age: 16.61096, renderAge: 18.46, name: "Waning Gibbous" },
        { age: 20.30228, renderAge: 22.15, name: "Last Quarter" },
        { age: 23.99361, renderAge: 25.84, name: "Waning Crescent" },
    ];

    let currentIndex = 0;
    for (let i = phaseStarts.length - 1; i >= 0; i--) {
        if (currentMoonAge >= phaseStarts[i].age) { currentIndex = i; break; }
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function phaseAtOffset(offset) {
        let idx = currentIndex + offset;
        let cycleShift = 0;
        if (idx < 0) { idx += phaseStarts.length; cycleShift = -1; }
        if (idx >= phaseStarts.length) { idx -= phaseStarts.length; cycleShift = 1; }
        const ph = phaseStarts[idx];
        const daysDiff = (ph.age - currentMoonAge) + (cycleShift * synodicMonth);
        const targetDate = new Date(date.getTime() + daysDiff * 24 * 60 * 60 * 1000);
        const info = getPhaseInfo(ph.age);
        return {
            moonAge: ph.renderAge,
            name: info.name,
            illumination: info.illuminationPercent,
            degrees: info.degrees,
            dateLabel: `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`,
            isToday: false
        };
    }

    const todayInfo = getPhaseInfo(currentMoonAge);
    return [
        phaseAtOffset(-2),
        phaseAtOffset(-1),
        {
            moonAge: currentMoonAge,
            name: todayInfo.name,
            illumination: todayInfo.illuminationPercent,
            degrees: todayInfo.degrees,
            dateLabel: `${date.getDate()} ${monthNames[date.getMonth()]}`,
            isToday: true
        },
        phaseAtOffset(1),
        phaseAtOffset(2)
    ];
}

function renderTimelineSection(date) {
    const strip = document.getElementById('timeline-strip');
    strip.innerHTML = '';
    const cards = buildPhaseTimeline(date);
    cards.forEach(card => {
        const size = card.isToday ? 160 : 100;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        renderMoon(svg, card.moonAge, size);

        const div = document.createElement('div');
        div.classList.add('phase-card');
        if (card.isToday) div.classList.add('today-card');
        if (card.isToday) {
            const lbl = document.createElement('p');
            lbl.className = 'today-label';
            lbl.textContent = 'NOW';
            div.appendChild(lbl);
        }
        div.appendChild(svg);

        const nameEl = document.createElement('p');
        nameEl.className = 'card-phase-name';
        nameEl.textContent = card.name;
        div.appendChild(nameEl);

        const illumEl = document.createElement('p');
        illumEl.className = 'card-illumination';
        illumEl.textContent = `${card.illumination}% · ${card.degrees}°`;
        div.appendChild(illumEl);

        const dateEl = document.createElement('p');
        dateEl.className = 'card-date';
        dateEl.textContent = card.dateLabel;
        div.appendChild(dateEl);

        strip.appendChild(div);
    });
}

// ── SCROLL FADE-IN ───────────────────────────────────

function initScrollFade() {
    const sections = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.05 });
    sections.forEach(s => observer.observe(s));
}

// ── NAMED FULL MOONS ─────────────────────────────────

const NAMED_MOONS_BY_YEAR = {
    2025: [
        { month: 0, day: 13, name: "Wolf Moon", color: "rgba(180, 200, 255, 0.7)" },
        { month: 1, day: 12, name: "Snow Moon", color: "rgba(210, 225, 255, 0.7)" },
        { month: 2, day: 14, name: "Worm Moon", color: "rgba(180, 210, 180, 0.7)" },
        { month: 3, day: 13, name: "Pink Moon", color: "rgba(255, 150, 180, 0.7)" },
        { month: 4, day: 12, name: "Flower Moon", color: "rgba(180, 230, 160, 0.7)" },
        { month: 5, day: 11, name: "Strawberry Moon", color: "rgba(255, 120, 100, 0.7)" },
        { month: 6, day: 10, name: "Buck Moon", color: "rgba(255, 200, 100, 0.7)" },
        { month: 7, day: 9, name: "Sturgeon Moon", color: "rgba(200, 180, 140, 0.7)" },
        { month: 8, day: 7, name: "Harvest Moon", color: "rgba(255, 180,  80, 0.7)" },
        { month: 9, day: 7, name: "Hunter's Moon", color: "rgba(230, 140,  60, 0.7)" },
        { month: 10, day: 5, name: "Beaver Moon", color: "rgba(180, 150, 120, 0.7)" },
        { month: 11, day: 4, name: "Cold Moon", color: "rgba(160, 190, 230, 0.7)" },
    ],
    2026: [
        { month: 0, day: 3, name: "Wolf Moon", color: "rgba(180, 200, 255, 0.7)" },
        { month: 1, day: 1, name: "Snow Moon", color: "rgba(210, 225, 255, 0.7)" },
        { month: 2, day: 3, name: "Worm Moon", color: "rgba(180, 210, 180, 0.7)" },
        { month: 3, day: 1, name: "Pink Moon", color: "rgba(255, 150, 180, 0.7)" },
        { month: 4, day: 1, name: "Flower Moon", color: "rgba(180, 230, 160, 0.7)" },
        { month: 4, day: 31, name: "Blue Moon", color: "rgba(120, 160, 255, 0.7)" },
        { month: 5, day: 29, name: "Strawberry Moon", color: "rgba(255, 120, 100, 0.7)" },
        { month: 6, day: 29, name: "Buck Moon", color: "rgba(255, 200, 100, 0.7)" },
        { month: 7, day: 27, name: "Sturgeon Moon", color: "rgba(200, 180, 140, 0.7)" },
        { month: 8, day: 26, name: "Harvest Moon", color: "rgba(255, 180,  80, 0.7)" },
        { month: 9, day: 25, name: "Hunter's Moon", color: "rgba(230, 140,  60, 0.7)" },
        { month: 10, day: 24, name: "Beaver Moon", color: "rgba(180, 150, 120, 0.7)" },
        { month: 11, day: 23, name: "Cold Moon", color: "rgba(160, 190, 230, 0.7)" },
    ],
    2027: [
        { month: 0, day: 22, name: "Wolf Moon", color: "rgba(180, 200, 255, 0.7)" },
        { month: 1, day: 20, name: "Snow Moon", color: "rgba(210, 225, 255, 0.7)" },
        { month: 2, day: 22, name: "Worm Moon", color: "rgba(180, 210, 180, 0.7)" },
        { month: 3, day: 20, name: "Pink Moon", color: "rgba(255, 150, 180, 0.7)" },
        { month: 4, day: 20, name: "Flower Moon", color: "rgba(180, 230, 160, 0.7)" },
        { month: 5, day: 18, name: "Strawberry Moon", color: "rgba(255, 120, 100, 0.7)" },
        { month: 6, day: 18, name: "Buck Moon", color: "rgba(255, 200, 100, 0.7)" },
        { month: 7, day: 16, name: "Sturgeon Moon", color: "rgba(200, 180, 140, 0.7)" },
        { month: 8, day: 15, name: "Harvest Moon", color: "rgba(255, 180,  80, 0.7)" },
        { month: 9, day: 14, name: "Hunter's Moon", color: "rgba(230, 140,  60, 0.7)" },
        { month: 10, day: 13, name: "Beaver Moon", color: "rgba(180, 150, 120, 0.7)" },
        { month: 11, day: 13, name: "Cold Moon", color: "rgba(160, 190, 230, 0.7)" },
    ],
};

const GENERIC_MOON_NAMES = {
    0: { name: "Wolf Moon", color: "rgba(180, 200, 255, 0.7)" },
    1: { name: "Snow Moon", color: "rgba(210, 225, 255, 0.7)" },
    2: { name: "Worm Moon", color: "rgba(180, 210, 180, 0.7)" },
    3: { name: "Pink Moon", color: "rgba(255, 150, 180, 0.7)" },
    4: { name: "Flower Moon", color: "rgba(180, 230, 160, 0.7)" },
    5: { name: "Strawberry Moon", color: "rgba(255, 120, 100, 0.7)" },
    6: { name: "Buck Moon", color: "rgba(255, 200, 100, 0.7)" },
    7: { name: "Sturgeon Moon", color: "rgba(200, 180, 140, 0.7)" },
    8: { name: "Harvest Moon", color: "rgba(255, 180,  80, 0.7)" },
    9: { name: "Hunter's Moon", color: "rgba(230, 140,  60, 0.7)" },
    10: { name: "Beaver Moon", color: "rgba(180, 150, 120, 0.7)" },
    11: { name: "Cold Moon", color: "rgba(160, 190, 230, 0.7)" },
};

function getFullMoonData(month, day, year) {
    if (NAMED_MOONS_BY_YEAR[year]) {
        const entry = NAMED_MOONS_BY_YEAR[year].find(fm =>
            fm.month === month && Math.abs(fm.day - day) <= 1
        );
        return entry || null;
    }
    const PEAK = 14.765;
    const SYNODIC = 29.530588853;
    const moonAge = getMoonAge(new Date(year, month, day, 12, 0, 0));
    const nextMoonAge = getMoonAge(new Date(year, month, day + 1, 12, 0, 0));
    const distToday = Math.min(Math.abs(moonAge - PEAK), SYNODIC - Math.abs(moonAge - PEAK));
    const distTomorrow = Math.min(Math.abs(nextMoonAge - PEAK), SYNODIC - Math.abs(nextMoonAge - PEAK));
    if (distToday <= distTomorrow && distToday < 2) {
        return GENERIC_MOON_NAMES[month];
    }
    return null;
}

// ── CALENDAR ─────────────────────────────────────────

function buildCalendar(month, year) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const SYNODIC = 29.530588853;
    const PHASE_PEAKS = {
        "New Moon": 0,
        "First Quarter": SYNODIC * 0.25,
        "Full Moon": SYNODIC * 0.5,
        "Last Quarter": SYNODIC * 0.75,
    };

    let startDay = new Date(year, month, 1).getDay();
    startDay = (startDay === 0) ? 6 : startDay - 1;

    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('cal-day', 'empty');
        grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const moonAge = getMoonAge(new Date(year, month, day, 12, 0, 0));
        const nextMoonAge = getMoonAge(new Date(year, month, day + 1, 12, 0, 0));
        const phase = getPhaseInfo(moonAge);

        const isToday = (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );

        let peakLabel = null;
        let isFullMoon = false;

        for (const [phaseName, peakAge] of Object.entries(PHASE_PEAKS)) {
            const distToday = Math.min(Math.abs(moonAge - peakAge), SYNODIC - Math.abs(moonAge - peakAge));
            const distTomorrow = Math.min(Math.abs(nextMoonAge - peakAge), SYNODIC - Math.abs(nextMoonAge - peakAge));
            if (distToday <= distTomorrow && distToday < 2) {
                peakLabel = phaseName;
                if (phaseName === "Full Moon") isFullMoon = true;
                break;
            }
        }

        const fullMoonData = isFullMoon ? getFullMoonData(month, day, year) : null;

        const cell = document.createElement('div');
        cell.classList.add('cal-day');
        if (isToday) cell.classList.add('today');
        if (isFullMoon && fullMoonData) {
            cell.style.boxShadow = `0 0 14px ${fullMoonData.color}`;
            cell.style.borderColor = fullMoonData.color;
        }

        const dateNum = document.createElement('span');
        dateNum.className = 'cal-date-num';
        dateNum.textContent = day;
        cell.appendChild(dateNum);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.setAttribute("width", 32);
        svg.setAttribute("height", 32);
        renderMoon(svg, moonAge, 32);
        cell.appendChild(svg);

        if (peakLabel) {
            const label = document.createElement('span');
            label.className = 'cal-phase-label';
            if (isFullMoon && fullMoonData) {
                label.textContent = fullMoonData.name;
                label.style.color = fullMoonData.color;
            } else {
                label.textContent = peakLabel;
            }
            cell.appendChild(label);
        }

        const tip = document.createElement('div');
        tip.className = 'cal-tooltip';
        tip.textContent = isFullMoon && fullMoonData
            ? `${fullMoonData.name} · ${phase.illuminationPercent}% lit`
            : `${phase.name} · ${phase.illuminationPercent}% lit`;
        cell.appendChild(tip);

        grid.appendChild(cell);
    }
}

function initCalendar() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthSelect = document.getElementById('cal-month');
    const yearSelect = document.getElementById('cal-year');

    for (let y = 1900; y <= 2100; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    monthSelect.value = now.getMonth();
    yearSelect.value = currentYear;
    buildCalendar(now.getMonth(), currentYear);

    document.getElementById('cal-go').addEventListener('click', () => {
        buildCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });
}

// ── PHASE GUIDE ──────────────────────────────────────

function buildPhaseGuide() {
    const guideAges = [0, 3.69, 7.38, 11.07, 14.765, 18.46, 22.15, 25.84];
    const phaseNames = [
        "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
        "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
    ];
    const anglesDeg = [0, 315, 270, 225, 180, 135, 90, 45];

    const todayAge = getMoonAge(new Date());
    const todayPhase = getPhaseInfo(todayAge).name;

    drawEarth(document.getElementById('earth-svg'));

    const containerSize = 420;
    const center = containerSize / 2;
    const radius = 155;

    document.querySelectorAll('.phase-node').forEach((node, i) => {
        const rad = (anglesDeg[i] * Math.PI) / 180;
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);

        node.style.left = (x - 32) + 'px';
        node.style.top = (y - 32) + 'px';

        const svg = node.querySelector('.guide-moon');
        renderMoon(svg, guideAges[i], 64);

        if (phaseNames[i] === todayPhase) {
            node.classList.add('current-phase');
        }
    });
}

function drawEarth(svgElement) {
    const ns = "http://www.w3.org/2000/svg";
    const c = 30;
    const r = 26;
    svgElement.innerHTML = "";

    const ocean = document.createElementNS(ns, "circle");
    ocean.setAttribute("cx", c);
    ocean.setAttribute("cy", c);
    ocean.setAttribute("r", r);
    ocean.setAttribute("fill", "#1a3a6b");
    svgElement.appendChild(ocean);

    const lands = [
        [26, 20, 8, 10, -20],
        [16, 32, 6, 7, 30],
        [36, 36, 5, 6, 10],
    ];
    lands.forEach(([x, y, rx, ry, rot]) => {
        const ellipse = document.createElementNS(ns, "ellipse");
        ellipse.setAttribute("cx", x);
        ellipse.setAttribute("cy", y);
        ellipse.setAttribute("rx", rx);
        ellipse.setAttribute("ry", ry);
        ellipse.setAttribute("fill", "#2d7a3a");
        ellipse.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
        ellipse.setAttribute("opacity", "0.85");
        svgElement.appendChild(ellipse);
    });

    const border = document.createElementNS(ns, "circle");
    border.setAttribute("cx", c);
    border.setAttribute("cy", c);
    border.setAttribute("r", r);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "rgba(100,160,255,0.4)");
    border.setAttribute("stroke-width", "1.5");
    svgElement.appendChild(border);
}

// ── INIT ─────────────────────────────────────────────

generateStars(500);
triggerShootingStar();
startClock();
updateHeroPhase(new Date());
renderTimelineSection(new Date());
initScrollFade();
initCalendar();
buildPhaseGuide();