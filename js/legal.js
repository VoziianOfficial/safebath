const legalPageName = document.body.dataset.page;

function initLegalPage() {
    if (legalPageName !== "legal") return;

    initLegalHeroAnimation();
    initLegalParallax();
    initLegalSidebarScrollSpy();
    initLegalSectionAnimations();
    initLegalTiltCards();
}

function initLegalHeroAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap) return;

    const { gsap } = window;

    const heroContent = document.querySelector(".legal-hero__content");
    const heroVisual = document.querySelector(".legal-hero__visual");
    const heroImage = document.querySelector(".legal-hero__image img");
    const floatingCard = document.querySelector(".legal-hero__floating-card");
    const heroMeta = document.querySelectorAll(".legal-hero__meta span");

    const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
    });

    if (heroContent) {
        tl.fromTo(
            Array.from(heroContent.children),
            {
                y: 22,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
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
                duration: 0.88,
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
                duration: 1.12,
                ease: "power2.out",
            },
            "-=0.95"
        );
    }

    if (floatingCard) {
        tl.fromTo(
            floatingCard,
            {
                y: 18,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
            },
            "-=0.78"
        );
    }

    if (heroMeta.length) {
        tl.fromTo(
            heroMeta,
            {
                y: 10,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.42,
                stagger: 0.06,
            },
            "-=0.45"
        );
    }
}

function initLegalParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector(".legal-hero__image img");
    const floatingCard = document.querySelector(".legal-hero__floating-card");

    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".legal-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (floatingCard) {
        gsap.to(floatingCard, {
            y: -12,
            ease: "none",
            scrollTrigger: {
                trigger: ".legal-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }
}

function initLegalSidebarScrollSpy() {
    const sidebarLinks = document.querySelectorAll(".legal-sidebar__nav a");
    const sections = document.querySelectorAll(".legal-section[id]");

    if (!sidebarLinks.length || !sections.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const activateLink = (id) => {
        sidebarLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (!visibleEntries.length) return;

            const topEntry = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            activateLink(topEntry.target.id);
        },
        {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0.1,
        }
    );

    sections.forEach((section) => observer.observe(section));

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href")?.replace("#", "");
            const target = targetId ? document.getElementById(targetId) : null;
            if (!target) return;

            if (!prefersReducedMotion) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

function initLegalSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const sidebarCard = document.querySelector(".legal-sidebar__card");
    const sections = document.querySelectorAll(".legal-article .legal-section");
    const article = document.querySelector(".legal-article");

    if (sidebarCard) {
        gsap.fromTo(
            sidebarCard,
            {
                x: -20,
                opacity: 0,
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sidebarCard,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }

    if (article) {
        gsap.fromTo(
            article,
            {
                y: 24,
                opacity: 0,
                scale: 0.995,
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: article,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }

    if (sections.length) {
        gsap.fromTo(
            sections,
            {
                y: 18,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.62,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sections[0].parentElement || sections[0],
                    start: "top 84%",
                    once: true,
                },
            }
        );
    }
}

function initLegalTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(".legal-sidebar__card, .legal-article");

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

            const rotateY = ((x / rect.width) - 0.5) * 4;
            const rotateX = ((y / rect.height) - 0.5) * -4;

            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
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

window.addEventListener("page:ready", (event) => {
    if (event.detail?.page === "legal") {
        initLegalPage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (legalPageName === "legal") {
        initLegalPage();
    }
});