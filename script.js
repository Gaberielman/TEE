const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.querySelector('#hero');
const heroVideo = document.querySelector('.hero-video');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('[data-nav-link]');
const revealItems = document.querySelectorAll('.reveal, .glass-card');

const updateNavigation = () => {
    const scrollPosition = window.scrollY;
    nav?.classList.toggle('is-scrolled', scrollPosition > 32);

    navLinks.forEach(link => {
        const section = document.querySelector(`#${link.dataset.navLink}`);
        const isActive = section && scrollPosition + 140 >= section.offsetTop &&
            scrollPosition + 140 < section.offsetTop + section.offsetHeight;
        link.classList.toggle('is-active', Boolean(isActive));
    });
};

updateNavigation();
window.addEventListener('scroll', updateNavigation, { passive: true });

if (!prefersReducedMotion) {
    revealItems.forEach((item, index) => {
        item.classList.add('reveal');
        item.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));

    window.addEventListener('scroll', () => {
        if (!hero || !heroVideo) return;
        const offset = Math.min(window.scrollY * 0.08, 26);
        heroVideo.style.transform = `scale(1.08) translateY(${offset}px)`;
    }, { passive: true });
} else {
    revealItems.forEach(item => item.classList.add('is-visible'));
}

heroVideo?.addEventListener('loadeddata', () => heroVideo.classList.add('is-ready'), { once: true });
heroVideo?.addEventListener('ended', () => heroVideo.play().catch(() => {}));
if (heroVideo) heroVideo.loop = true;
heroVideo?.play().catch(() => {});

window.setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach(item => item.classList.add('is-visible'));
}, 180);
