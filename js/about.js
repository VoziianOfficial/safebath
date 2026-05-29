const aboutPageName = document.body.dataset.page;

function initAboutPage() {
    if (aboutPageName !== "about") return;

    initAboutHeroAnimation();
    initAboutParallax();
    initAboutTiltCards();
    initAboutSectionAnimations();
}

function initAboutHeroAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap) return;

    const { gsap } = window;

    const heroContent = document.querySelector(".about-hero__content");
    const heroVisual = document.querySelector(".about-hero__visual");
    const mainImage = document.querySelector(".about-hero__image--main img");
    const smallImage = document.querySelector(".about-hero__image--small img");
    const floatingCard = document.querySelector(".about-hero__floating-card");
    const heroTags = document.querySelectorAll(".about-hero__tags li");

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
                x: 30,
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

    if (mainImage) {
        tl.fromTo(
            mainImage,
            {
                scale: 1.08,
            },
            {
                scale: 1.02,
                duration: 1.2,
                ease: "power2.out",
            },
            "-=1"
        );
    }

    if (smallImage) {
        tl.fromTo(
            smallImage,
            {
                scale: 1.08,
                y: 16,
            },
            {
                scale: 1.02,
                y: 0,
                duration: 1,
                ease: "power2.out",
            },
            "-=0.95"
        );
    }

    if (floatingCard) {
        tl.fromTo(
            floatingCard,
            {
                y: 20,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.62,
            },
            "-=0.75"
        );
    }

    if (heroTags.length) {
        tl.fromTo(
            heroTags,
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
            },
            "-=0.5"
        );
    }
}

function initAboutParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const mainImage = document.querySelector(".about-hero__image--main img");
    const smallImage = document.querySelector(".about-hero__image--small img");
    const floatingCard = document.querySelector(".about-hero__floating-card");
    const galleryItems = document.querySelectorAll(".about-gallery__item img");

    if (mainImage) {
        gsap.to(mainImage, {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (smallImage) {
        gsap.to(smallImage, {
            yPercent: -4,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.95,
            },
        });
    }

    if (floatingCard) {
        gsap.to(floatingCard, {
            y: -14,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }

    galleryItems.forEach((image, index) => {
        gsap.to(image, {
            yPercent: index % 2 === 0 ? 5 : -5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: image.closest(".about-gallery__item"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    });
}

function initAboutTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(
        ".about-story-card, .clarity-panel, .about-process-card, .about-value-point, .about-impression-card"
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

function initAboutSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const storyCards = document.querySelectorAll(".about-story__right .about-story-card");
    const clarityPanels = document.querySelectorAll(".about-clarity__grid .clarity-panel");
    const galleryItems = document.querySelectorAll(".about-gallery__item");
    const processCards = document.querySelectorAll(".about-process__grid .about-process-card");
    const valuePoints = document.querySelectorAll(".about-value__points .about-value-point");
    const impressionCards = document.querySelectorAll(".about-impressions__grid .about-impression-card");
    const valuePanel = document.querySelector(".about-value__panel");
    const ctaPanel = document.querySelector(".about-cta__panel");

    createAboutReveal(gsap, storyCards, {
        x: 24,
        duration: 0.72,
        stagger: 0.12,
        start: "top 86%",
    });

    createAboutReveal(gsap, clarityPanels, {
        y: 24,
        duration: 0.78,
        stagger: 0.1,
        start: "top 86%",
    });

    createAboutReveal(gsap, galleryItems, {
        y: 26,
        duration: 0.8,
        stagger: 0.1,
        start: "top 88%",
    });

    createAboutReveal(gsap, processCards, {
        y: 22,
        duration: 0.7,
        stagger: 0.1,
        start: "top 87%",
    });

    createAboutReveal(gsap, valuePoints, {
        x: 18,
        duration: 0.65,
        stagger: 0.09,
        start: "top 87%",
    });

    createAboutReveal(gsap, impressionCards, {
        y: 22,
        duration: 0.68,
        stagger: 0.1,
        start: "top 87%",
    });

    if (valuePanel) {
        gsap.fromTo(
            valuePanel,
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
                    trigger: valuePanel,
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

function createAboutReveal(gsap, elements, options = {}) {
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
    if (event.detail?.page === "about") {
        initAboutPage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (aboutPageName === "about") {
        initAboutPage();
    }
});