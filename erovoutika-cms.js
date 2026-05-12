// erovoutika-cms.js
// Live-site hydration script — reads ALL sections from Firestore and injects
// them into index4(1).html so admin changes appear immediately on the live site.

import { initializeApp }    from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, doc, getDoc }
                            from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// ── Firebase config (same project as admin.html) ─────────────────────────────
const firebaseConfig = {
    apiKey:            "AIzaSyD5GwkaU3qKf-jdG2R7QQyGADuYIPedlkY",
    authDomain:        "erovoutika-cms-b2f23.firebaseapp.com",
    projectId:         "erovoutika-cms-b2f23",
    storageBucket:     "erovoutika-cms-b2f23.firebasestorage.app",
    messagingSenderId: "1049312061270",
    appId:             "1:1049312061270:web:33458a4547f344160458f7",
    measurementId:     "G-KKEP1LKF0Z"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        hydrateAbout(),
        hydrateServices(),
        hydratePortfolio(),
        hydrateAwards(),
        hydratePartners(),
        hydrateNews()
    ]);
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. ABOUT  →  sections/about
//    Fields saved by admin: headline, description, imageUrl
//    DOM targets in index4(1).html:
//      h2 inside #about .about-text
//      first <p> inside #about .about-text
//      img inside #aboutImg
// ─────────────────────────────────────────────────────────────────────────────
async function hydrateAbout() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'about'));
        if (!snap.exists()) return;
        const data = snap.data();

        const h2  = document.querySelector('#about .about-text h2');
        const p   = document.querySelector('#about .about-text p');
        const img = document.querySelector('#aboutImg img');

        if (h2  && data.headline)     h2.innerHTML = data.headline.replace(/\n/g, '<br>');
        if (p   && data.description)  p.textContent = data.description;
        if (img && data.imageUrl)     img.src = data.imageUrl;

        // Optional image sizing saved by admin
        if (img && data.imgWidth)    img.style.width    = data.imgWidth + '%';
        if (img && data.imgMaxWidth) img.style.maxWidth = data.imgMaxWidth + 'px';
        if (img && data.imgFit)      img.style.objectFit = data.imgFit;

    } catch (err) {
        console.warn('[CMS] About hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SERVICES  →  sections/services
//    Fields: subtitle, description, cards[]{icon, number, title, body}
//    DOM targets:
//      .stack-left .section-tag   ← subtitle
//      .stack-left .stack-sub     ← description
//      #stackRight                ← rebuilt with card data
// ─────────────────────────────────────────────────────────────────────────────
async function hydrateServices() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'services'));
        if (!snap.exists()) return;
        const data = snap.data();

        // Section label + description in the left column
        const tag = document.querySelector('.stack-left .section-tag');
        const sub = document.querySelector('.stack-left .stack-sub');
        if (tag && data.subtitle)    tag.textContent = data.subtitle;
        if (sub && data.description) sub.textContent = data.description;

        // Rebuild stacked cards
        const stackRight = document.getElementById('stackRight');
        if (!stackRight || !Array.isArray(data.cards) || data.cards.length === 0) return;

        stackRight.innerHTML = data.cards.map(card => `
            <div class="scard">
                <div class="scard-icon">${esc(card.icon || '')}</div>
                <div>
                    <div class="scard-sub">${esc(card.number || '')}</div>
                    <div class="scard-title">${esc(card.title || '').replace(/\n/g, '<br>')}</div>
                </div>
                <div class="scard-body">${esc(card.body || '')}</div>
            </div>
        `).join('');

        // FIX: was incorrectly calling window.__rotateCards — the page exposes
        // window.__reinitCards, which re-queries .scard, re-runs rotateCards(),
        // AND reattaches all mousemove / mouseenter / mouseleave listeners.
        if (typeof window.__reinitCards === 'function') {
            window.__reinitCards();
        }

    } catch (err) {
        console.warn('[CMS] Services hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PORTFOLIO  →  sections/portfolio
//    Fields: items[]{imageUrl, alt}
//    DOM target: .gallery-grid  (rebuild the g-item divs)
// ─────────────────────────────────────────────────────────────────────────────
async function hydratePortfolio() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'portfolio'));
        if (!snap.exists()) return;
        const data = snap.data();

        const grid = document.querySelector('.gallery-grid');
        if (!grid || !Array.isArray(data.items) || data.items.length === 0) return;

        // Preserve reveal animation classes; first item gets span if it existed
        const delayClasses = ['reveal', 'reveal delay-1', 'reveal delay-2', 'reveal delay-3', 'reveal delay-4'];
        grid.innerHTML = data.items.map((item, i) => `
            <div class="g-item ${delayClasses[i] || 'reveal'}">
                <img src="${esc(item.imageUrl || '')}" alt="${esc(item.alt || '')}">
            </div>
        `).join('');

        // Re-observe new elements for scroll-reveal
        reObserveReveal();

        // Reattach cursor-hover listeners to freshly injected .g-item elements
        reattachCursorHover('.g-item');

    } catch (err) {
        console.warn('[CMS] Portfolio hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. AWARDS  →  sections/awards
//    Fields: items[]{imageUrl, alt, caption}
//    DOM target: .awards-grid  (rebuild award-item divs)
// ─────────────────────────────────────────────────────────────────────────────
async function hydrateAwards() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'awards'));
        if (!snap.exists()) return;
        const data = snap.data();

        const grid = document.querySelector('.awards-grid');
        if (!grid || !Array.isArray(data.items) || data.items.length === 0) return;

        const delays = ['reveal', 'reveal delay-1', 'reveal delay-2', 'reveal delay-3', 'reveal delay-4'];
        grid.innerHTML = data.items.map((item, i) => `
            <div class="award-item ${delays[i] || 'reveal'}">
                <div class="award-img-wrap">
                    <img src="${esc(item.imageUrl || '')}" alt="${esc(item.alt || '')}">
                </div>
                <p>${esc(item.caption || '')}</p>
            </div>
        `).join('');

        reObserveReveal();

        // Reattach cursor-hover listeners to freshly injected .award-item elements
        reattachCursorHover('.award-item');

    } catch (err) {
        console.warn('[CMS] Awards hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PARTNERS  →  sections/partners
//    Fields: items[]{imageUrl, alt}
//    DOM target: .marquee-track  (rebuild img tags, then duplicate for seamless loop)
// ─────────────────────────────────────────────────────────────────────────────
async function hydratePartners() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'partners'));
        if (!snap.exists()) return;
        const data = snap.data();

        const track = document.querySelector('.marquee-track');
        if (!track || !Array.isArray(data.items) || data.items.length === 0) return;

        // Build the original set + a duplicate for the seamless CSS marquee
        const imgs = data.items.map(item =>
            `<img src="${esc(item.imageUrl || '')}" alt="${esc(item.alt || '')}">`
        ).join('');

        track.innerHTML = imgs + imgs;   // duplicate = seamless loop

    } catch (err) {
        console.warn('[CMS] Partners hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. NEWS  →  sections/news
//    Fields: items[]{imageUrl, alt, date, title, link}
//    DOM target: .news-grid  (rebuild news-card divs)
// ─────────────────────────────────────────────────────────────────────────────
async function hydrateNews() {
    try {
        const snap = await getDoc(doc(db, 'sections', 'news'));
        if (!snap.exists()) return;
        const data = snap.data();

        const grid = document.querySelector('.news-grid');
        if (!grid || !Array.isArray(data.items) || data.items.length === 0) return;

        const delays = ['reveal', 'reveal delay-1', 'reveal delay-2'];
        const arrowSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

        grid.innerHTML = data.items.map((item, i) => `
            <div class="news-card ${delays[i] || 'reveal'}">
                <div class="news-card-img">
                    <img src="${esc(item.imageUrl || '')}" alt="${esc(item.alt || '')}">
                </div>
                <div class="news-body">
                    <p class="news-date">${esc(item.date || '')}</p>
                    <h3>${esc(item.title || '')}</h3>
                    <a href="${esc(item.link || '#')}" target="_blank" class="read-more-link">
                        Read More ${arrowSVG}
                    </a>
                </div>
            </div>
        `).join('');

        reObserveReveal();

        // Reattach cursor-hover listeners to freshly injected .news-card elements
        reattachCursorHover('.news-card');

    } catch (err) {
        console.warn('[CMS] News hydration failed:', err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal XSS escape for injecting untrusted strings into HTML attributes
 * and text nodes.  (innerHTML is used only where we control the template.)
 */
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * After DOM is rebuilt, re-run the IntersectionObserver so newly injected
 * elements also get the scroll-reveal animation.
 */
function reObserveReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.13 });

    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .section-tag:not(.visible)')
        .forEach(el => obs.observe(el));
}

/**
 * Reattach the cursor-hover class toggle to freshly injected interactive
 * elements.  The main page script binds these only at page-load time;
 * after CMS injects new nodes we must rebind so the custom cursor enlarges
 * correctly on hover.
 *
 * NOTE: Services cards are handled by window.__reinitCards (called above in
 * hydrateServices), which reattaches mouseenter/mouseleave on each .scard
 * directly.  This helper covers every other section.
 */
function reattachCursorHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}
