const fs = require('fs');

let txt = fs.readFileSync('public/index.html', 'utf8');

const injection = `
<style>
/* ===== TÜM METİNLERİ KESİN GİZLE (SADECE TASARIM KALACAK) ===== */
.xp-text, .xp-text *, .xp-fulltext, .xp-fulltext *, .banner-text, .banner-w .link, .banner .link span,
.a-title, .a-subtitle, .a-item .title, .a-item .desc, .a-item .text, .a-footer-title, .a-footer-subtitle,
.section-title, .section-desc, #header .logo-text, .nav-item, .menu-item a, footer *, .footer *, .footer-text,
.a-footer *, .cta-label, .cta-text, .xp-btn span, .xp-poem-btn span, .xp-fullpaint-btn span, .scroll-cta,
.scroll-cta *, .open-text, .side-text, .xp-section .open-text, .question .title, .question .answer,
.question .answer p, .subscribe-btn span, .woocommerce *, .cart-widget * {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
}
.sign-in, .become-member, #header .right .icons, #menu-mobile .top-menu, .widget-cart, .pages, .nav-links, .navigation-items {
    display: none !important;
}
</style>
<script>
// Eski sitenin önbelleğini (Service Worker) sil
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
// LocalStorage ve SessionStorage'ı da temizle
localStorage.clear();
sessionStorage.clear();
</script>
</head>
`;

txt = txt.replace('</head>', injection);

// 2. app.js referansını app-fatmanur-v3.js ile değiştir
txt = txt.replace(/app\.js\?ver=[0-9]+/g, 'app-fatmanur-v3.js');

fs.writeFileSync('public/index.html', txt);
console.log('HTML injected successfully');
