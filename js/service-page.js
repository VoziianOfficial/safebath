const servicePageName = document.body.dataset.page;

function initServicePage() {
    if (servicePageName !== "service-page") return;

    initServiceHeroAnimation();
    initServiceParallax();
    initServiceTiltCards();
    initServiceSectionAnimations();
    initServiceFaqAnimation();
    initServiceButtonMicroMotion();
}

function initServiceHeroAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap) return;

    const { gsap } = window;

    const heroContent = document.querySelector(".service-hero__content");
    const heroVisual = document.querySelector(".service-hero__visual");
    const heroPanel = document.querySelector(".service-hero__panel");
    const heroImage = document.querySelector(".service-hero__panel img");
    const heroCards = document.querySelectorAll(".service-hero__card");
    const heroChips = document.querySelectorAll(".service-hero__chips li");

    const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
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

    if (heroPanel) {
        tl.fromTo(
            heroPanel,
            {
                scale: 0.98,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.95,
            },
            "-=0.75"
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
            "-=1.05"
        );
    }

    if (heroCards.length) {
        tl.fromTo(
            heroCards,
            {
                y: 18,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.62,
                stagger: 0.12,
            },
            "-=0.8"
        );
    }

    if (heroChips.length) {
        tl.fromTo(
            heroChips,
            {
                y: 10,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.05,
            },
            "-=0.45"
        );
    }
}

function initServiceParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector(".service-hero__panel img");
    const heroCards = document.querySelectorAll(".service-hero__card");

    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".service-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (heroCards.length) {
        heroCards.forEach((card, index) => {
            gsap.to(card, {
                y: index % 2 === 0 ? -14 : 14,
                ease: "none",
                scrollTrigger: {
                    trigger: ".service-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        });
    }
}

function initServiceTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(
        ".service-mini-card, .service-detail-card, .related-card, .service-factor-panel, .service-cta__panel"
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

            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.setProperty("--pointer-x", `${(x / rect.width) * 100}%`);
                card.style.setProperty("--pointer-y", `${(y / rect.height) * 100}%`);
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

function initServiceSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const miniCards = document.querySelectorAll(".service-mini-card");
    const detailCards = document.querySelectorAll(".service-detail-card");
    const relatedCards = document.querySelectorAll(".related-card");
    const factorPanel = document.querySelector(".service-factor-panel");
    const ctaPanel = document.querySelector(".service-cta__panel");

    createServiceReveal(gsap, miniCards, {
        x: 20,
        duration: 0.72,
        stagger: 0.1,
        start: "top 86%",
    });

    createServiceReveal(gsap, detailCards, {
        y: 22,
        duration: 0.74,
        stagger: 0.09,
        start: "top 85%",
    });

    createServiceReveal(gsap, relatedCards, {
        y: 20,
        duration: 0.68,
        stagger: 0.1,
        start: "top 86%",
    });

    if (factorPanel) {
        gsap.fromTo(
            factorPanel,
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
                    trigger: factorPanel,
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

function createServiceReveal(gsap, elements, options = {}) {
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

function initServiceFaqAnimation() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) return;

        button.addEventListener("click", () => {
            const isExpanded = button.getAttribute("aria-expanded") === "true";

            if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                if (!isExpanded) {
                    window.gsap.fromTo(
                        answer,
                        {
                            y: 8,
                            opacity: 0,
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.32,
                            ease: "power2.out",
                        }
                    );
                }
            }
        });
    });
}

function initServiceButtonMicroMotion() {
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = window;
    const buttons = document.querySelectorAll(".service-hero .button, .service-cta .button, .related-card a");

    buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, {
                y: -2,
                duration: 0.22,
                ease: "power2.out",
            });
        });

        button.addEventListener("mouseleave", () => {
            gsap.to(button, {
                y: 0,
                duration: 0.22,
                ease: "power2.out",
            });
        });
    });
}

window.addEventListener("page:ready", (event) => {
    if (event.detail?.page === "service-page") {
        initServicePage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (servicePageName === "service-page") {
        initServicePage();
    }
});