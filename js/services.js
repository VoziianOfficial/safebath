const servicesPageName = document.body.dataset.page;

function initServicesPage() {
    if (servicesPageName !== "services") return;

    initServicesSwiper();
    initServicesHeroAnimation();
    initServicesParallax();
    initServicesTiltCards();
    initServicesSectionAnimations();
}

function initServicesSwiper() {
    const swiperElement = document.querySelector(".services-rail-swiper");
    if (!swiperElement || typeof window.Swiper === "undefined") return;

    new window.Swiper(swiperElement, {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 900,
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: ".services-rail__button--next",
            prevEl: ".services-rail__button--prev",
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1180: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
        },
    });
}

function initServicesHeroAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap) return;

    const { gsap } = window;

    const heroContent = document.querySelector(".services-hero__content");
    const heroVisual = document.querySelector(".services-hero__visual");
    const heroImage = document.querySelector(".services-hero__media img");
    const heroBadge = document.querySelector(".services-hero__badge");
    const heroStats = document.querySelectorAll(".services-hero__stat");

    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    if (heroContent) {
        tl.fromTo(
            Array.from(heroContent.children),
            {
                y: 24,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.82,
                stagger: 0.1,
            }
        );
    }

    if (heroVisual) {
        tl.fromTo(
            heroVisual,
            {
                x: 28,
                opacity: 0,
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.9,
            },
            "-=0.55"
        );
    }

    if (heroImage) {
        tl.fromTo(
            heroImage,
            {
                scale: 1.08,
            },
            {
                scale: 1.02,
                duration: 1.2,
                ease: "power2.out",
            },
            "-=0.95"
        );
    }

    if (heroBadge) {
        tl.fromTo(
            heroBadge,
            {
                y: 18,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.62,
            },
            "-=0.82"
        );
    }

    if (heroStats.length) {
        tl.fromTo(
            heroStats,
            {
                y: 14,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.46,
                stagger: 0.07,
            },
            "-=0.55"
        );
    }
}

function initServicesParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector(".services-hero__media img");
    const heroBadge = document.querySelector(".services-hero__badge");

    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".services-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (heroBadge) {
        gsap.to(heroBadge, {
            y: -16,
            ease: "none",
            scrollTrigger: {
                trigger: ".services-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }
}

function initServicesTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(
        ".services-showcase-card, .services-testimonial-card, .editorial-note-card, .services-rail-card"
    );

    tiltTargets.forEach((card) => {
        let frameId = null;

        function resetCard() {
            card.style.transform = "";
            card.style.setProperty("--pointer-x", "50%");
            card.style.setProperty("--pointer-y", "50%");
        }

        function onMove(event) {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 8;
            const rotateX = ((y / rect.height) - 0.5) * -8;

            const pointerX = `${(x / rect.width) * 100}%`;
            const pointerY = `${(y / rect.height) * 100}%`;

            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                card.style.setProperty("--pointer-x", pointerX);
                card.style.setProperty("--pointer-y", pointerY);
            });
        }

        function onLeave() {
            if (frameId) cancelAnimationFrame(frameId);
            resetCard();
        }

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
    });
}

function initServicesSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const showcaseCards = document.querySelectorAll(".services-catalog__grid .services-showcase-card");
    const editorialCards = document.querySelectorAll(".editorial-note-card");
    const testimonials = document.querySelectorAll(".services-testimonials__grid .services-testimonial-card");
    const comparisonPanel = document.querySelector(".services-comparison__panel");
    const ctaPanel = document.querySelector(".services-cta__panel");

    createServicesReveal(gsap, showcaseCards, {
        y: 30,
        duration: 0.82,
        stagger: 0.1,
        start: "top 85%",
    });

    createServicesReveal(gsap, editorialCards, {
        x: 22,
        duration: 0.72,
        stagger: 0.12,
        start: "top 86%",
    });

    createServicesReveal(gsap, testimonials, {
        y: 22,
        duration: 0.68,
        stagger: 0.1,
        start: "top 86%",
    });

    if (comparisonPanel) {
        gsap.fromTo(
            comparisonPanel,
            {
                y: 24,
                opacity: 0,
                scale: 0.99,
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: comparisonPanel,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }

    if (ctaPanel) {
        gsap.fromTo(
            ctaPanel,
            {
                y: 24,
                opacity: 0,
                scale: 0.99,
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ctaPanel,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }
}

function createServicesReveal(gsap, elements, options = {}) {
    if (!elements || !elements.length || !window.ScrollTrigger) return;

    const {
        y = 20,
        x = 0,
        duration = 0.7,
        stagger = 0.1,
        start = "top 85%",
    } = options;

    gsap.fromTo(
        elements,
        {
            y,
            x,
            opacity: 0,
        },
        {
            y: 0,
            x: 0,
            opacity: 1,
            duration,
            stagger,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elements[0].parentElement || elements[0],
                start,
                once: true,
            },
        }
    );
}

window.addEventListener("page:ready", (event) => {
    if (event.detail?.page === "services") {
        initServicesPage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (servicesPageName === "services") {
        initServicesPage();
    }
});