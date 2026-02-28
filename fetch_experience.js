const https = require('https');
const fs = require('fs');

https.get('https://davidwhyte.com/experience/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        let txt = data;

        // XHR, Fetch and Font absolute paths broken down to local Next.js proxy
        txt = txt.replace(/https:\/\/davidwhyte\.com\/wp-content\/themes\/davidwhyte/g, '/wp-content/themes/fatmanur');
        txt = txt.replace(/https:\/\/davidwhyte\.com\//g, '/');

        // Cache busting and extreme text-hiding injection
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
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
localStorage.clear();
sessionStorage.clear();
</script>
</head>
`;
        txt = txt.replace('</head>', injection);

        // Bridge to our v3 JS containing the wiped clear WebGL texts
        txt = txt.replace(/app\.js\?ver=[0-9]+/g, 'app-fatmanur-v3.js');
        txt = txt.replace(/app\.js"/g, 'app-fatmanur-v3.js"');
        txt = txt.replace(/app\.js'/g, "app-fatmanur-v3.js'");

        fs.writeFileSync('public/index.html', txt);
        console.log('Experience page HTML fetched and injected successfully');
    });
});
