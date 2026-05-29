const homePageName = document.body.dataset.page;

function initHomePage() {
    if (homePageName !== "home") return;

    initHomeSwiper();
    initHomeHeroParallax();
    initHomeTiltCards();
    initHomeGlowTracking();
    initHomeSectionAnimations();
}

function initHomeSwiper() {
    const swiperElement = document.querySelector(".home-rail-swiper");
    if (!swiperElement || typeof window.Swiper === "undefined") return;

    new window.Swiper(swiperElement, {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 850,
        grabCursor: true,
        loop: true,
        centeredSlides: false,
        navigation: {
            nextEl: ".home-rail__button--next",
            prevEl: ".home-rail__button--prev",
        },
        autoplay: {
            delay: 3400,
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

function initHomeHeroParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector(".hero-panel--main img");
    const floatingCards = document.querySelectorAll(".hero-floating-card");
    const heroContent = document.querySelector(".hero-section__content");
    const heroHighlights = document.querySelectorAll(".hero-section__highlights li");

    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (floatingCards.length) {
        floatingCards.forEach((card, index) => {
            gsap.to(card, {
                y: index % 2 === 0 ? -16 : 16,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.1,
                },
            });
        });
    }

    if (heroContent) {
        const heroChildren = Array.from(heroContent.children);

        gsap.fromTo(
            heroChildren,
            {
                y: 24,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
            }
        );
    }

    if (heroHighlights.length) {
        gsap.fromTo(
            heroHighlights,
            {
                y: 12,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.06,
                ease: "power2.out",
                delay: 0.35,
            }
        );
    }
}

function initHomeTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(
        ".service-card--featured, .testimonial-card, .info-card, .step-card"
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
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
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

function initHomeGlowTracking() {
    const glowTargets = document.querySelectorAll(
        ".service-card--featured, .rail-card, .coverage-side-card, .testimonial-card"
    );

    glowTargets.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty("--pointer-x", `${x}%`);
            card.style.setProperty("--pointer-y", `${y}%`);
        });
    });
}

function initHomeSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const servicesCards = document.querySelectorAll(".services-preview__grid .service-card--featured");
    const processCards = document.querySelectorAll(".process-grid .step-card");
    const testimonialCards = document.querySelectorAll(".testimonials-grid .testimonial-card");
    const benefitsCards = document.querySelectorAll(".benefits-grid .info-card");
    const coverageSideCard = document.querySelector(".coverage-side-card");
    const ctaPanel = document.querySelector(".cta-panel");

    createStaggerReveal(gsap, benefitsCards, {
        y: 24,
        duration: 0.72,
        stagger: 0.1,
        start: "top 85%",
    });

    createStaggerReveal(gsap, servicesCards, {
        y: 28,
        duration: 0.82,
        stagger: 0.12,
        start: "top 84%",
    });

    createStaggerReveal(gsap, processCards, {
        y: 22,
        duration: 0.68,
        stagger: 0.1,
        start: "top 86%",
    });

    createStaggerReveal(gsap, testimonialCards, {
        y: 22,
        duration: 0.68,
        stagger: 0.1,
        start: "top 86%",
    });

    if (coverageSideCard) {
        gsap.fromTo(
            coverageSideCard,
            {
                x: 28,
                opacity: 0,
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.78,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: coverageSideCard,
                    start: "top 87%",
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
                duration: 0.85,
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

function createStaggerReveal(gsap, elements, options = {}) {
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
    if (event.detail?.page === "home") {
        initHomePage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (homePageName === "home") {
        initHomePage();
    }
});