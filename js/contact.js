const contactPageName = document.body.dataset.page;

function initContactPage() {
    if (contactPageName !== "contact") return;

    initContactHeroAnimation();
    initContactParallax();
    initContactTiltCards();
    initContactSectionAnimations();
    initContactForm();
    initSuccessModal();
}

function initContactHeroAnimation() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap) return;

    const { gsap } = window;

    const heroContent = document.querySelector(".contact-hero__content");
    const heroVisual = document.querySelector(".contact-hero__visual");
    const heroImage = document.querySelector(".contact-hero__image img");
    const heroNote = document.querySelector(".contact-hero__note");
    const quickCards = document.querySelectorAll(".contact-hero__quick-card");

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

    if (heroImage) {
        tl.fromTo(
            heroImage,
            {
                scale: 1.08,
            },
            {
                scale: 1.02,
                duration: 1.18,
                ease: "power2.out",
            },
            "-=1"
        );
    }

    if (heroNote) {
        tl.fromTo(
            heroNote,
            {
                y: 18,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.62,
            },
            "-=0.8"
        );
    }

    if (quickCards.length) {
        tl.fromTo(
            quickCards,
            {
                y: 12,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.07,
            },
            "-=0.55"
        );
    }
}

function initContactParallax() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector(".contact-hero__image img");
    const heroNote = document.querySelector(".contact-hero__note");
    const sideImage = document.querySelector(".contact-side-card--image img");

    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".contact-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }

    if (heroNote) {
        gsap.to(heroNote, {
            y: -14,
            ease: "none",
            scrollTrigger: {
                trigger: ".contact-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }

    if (sideImage) {
        gsap.to(sideImage, {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".contact-form-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
            },
        });
    }
}

function initContactTiltCards() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll(
        ".contact-option-card, .contact-side-card, .contact-map__aside-card, .contact-hero__quick-card"
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

function initContactSectionAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const optionCards = document.querySelectorAll(".contact-options__grid .contact-option-card");
    const sideCards = document.querySelectorAll(".contact-side-panel .contact-side-card");
    const mapAsideCards = document.querySelectorAll(".contact-map__aside .contact-map__aside-card");
    const formPanel = document.querySelector(".contact-form-panel");
    const mapCard = document.querySelector(".contact-map__card");
    const clarityPanel = document.querySelector(".contact-clarity__panel");

    createContactReveal(gsap, optionCards, {
        y: 24,
        duration: 0.76,
        stagger: 0.1,
        start: "top 86%",
    });

    createContactReveal(gsap, sideCards, {
        x: 22,
        duration: 0.72,
        stagger: 0.1,
        start: "top 86%",
    });

    createContactReveal(gsap, mapAsideCards, {
        x: 20,
        duration: 0.7,
        stagger: 0.1,
        start: "top 86%",
    });

    if (formPanel) {
        gsap.fromTo(
            formPanel,
            {
                y: 24,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: formPanel,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }

    if (mapCard) {
        gsap.fromTo(
            mapCard,
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
                    trigger: mapCard,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }

    if (clarityPanel) {
        gsap.fromTo(
            clarityPanel,
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
                    trigger: clarityPanel,
                    start: "top 88%",
                    once: true,
                },
            }
        );
    }
}

function createContactReveal(gsap, elements, options = {}) {
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

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        showSuccessModal();
        form.reset();
    });
}

function initSuccessModal() {
    const modal = document.getElementById("success-modal");
    const closeButton = document.getElementById("success-modal-close");
    const actionButton = document.getElementById("success-modal-button");
    const backdrop = modal?.querySelector(".success-modal__backdrop");

    if (!modal) return;

    closeButton?.addEventListener("click", hideSuccessModal);
    actionButton?.addEventListener("click", hideSuccessModal);
    backdrop?.addEventListener("click", hideSuccessModal);

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-visible")) {
            hideSuccessModal();
        }
    });
}

function showSuccessModal() {
    const modal = document.getElementById("success-modal");
    if (!modal) return;

    modal.hidden = false;
    document.body.classList.add("cookie-modal-open");

    requestAnimationFrame(() => {
        modal.classList.add("is-visible");
    });
}

function hideSuccessModal() {
    const modal = document.getElementById("success-modal");
    if (!modal) return;

    modal.classList.remove("is-visible");
    document.body.classList.remove("cookie-modal-open");

    window.setTimeout(() => {
        modal.hidden = true;
    }, 380);
}

window.addEventListener("page:ready", (event) => {
    if (event.detail?.page === "contact") {
        initContactPage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (contactPageName === "contact") {
        initContactPage();
    }
});