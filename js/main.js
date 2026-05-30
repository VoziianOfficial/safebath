const body = document.body;
const html = document.documentElement;

const header = document.getElementById("site-header");
const progressBar = document.querySelector(".site-progress");

const navToggle = document.querySelector(".nav-toggle");
const navToggleIcon = navToggle?.querySelector("i");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuBackdrop = document.querySelector(".mobile-menu__backdrop");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

const cookieBanner = document.getElementById("cookie-banner");
const cookieButtons = document.querySelectorAll("[data-cookie-action]");

const faqRoots = document.querySelectorAll("[data-faq-root]");
const revealItems = document.querySelectorAll("[data-reveal]");

const themeToggles = document.querySelectorAll("[data-theme-toggle]");

const SITE_CONFIG = window.SiteConfig || {};

const COOKIE_STORAGE_KEY = SITE_CONFIG.storage?.cookieConsentKey || "safeBathCookieConsent";
const THEME_STORAGE_KEY = SITE_CONFIG.storage?.themeKey || "safeBathTheme";
const MOBILE_BREAKPOINT = 1024;

let lastFocusedBeforeMenuOpen = null;

function lockBodyScroll() {
    body.classList.add("menu-open");
}

function unlockBodyScroll() {
    body.classList.remove("menu-open");
}

function isDesktopViewport() {
    return window.innerWidth > MOBILE_BREAKPOINT;
}

function getFocusableElements(container) {
    if (!container) return [];

    const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(",");

    return Array.from(container.querySelectorAll(selector)).filter((element) => {
        if (element.hasAttribute("disabled")) return false;
        if (element.getAttribute("aria-hidden") === "true") return false;
        return element.offsetParent !== null || element === document.activeElement;
    });
}

function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function updateProgressBar() {
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

function setMobileMenuInitialState() {
    if (!mobileMenu || !navToggle) return;

    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.setAttribute("inert", "");
    mobileMenu.setAttribute("tabindex", "-1");

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (navToggleIcon) {
        navToggleIcon.classList.remove("fa-xmark");
        navToggleIcon.classList.add("fa-bars-staggered");
    }
}

function openMobileMenu() {
    if (!mobileMenu || !navToggle) return;

    lastFocusedBeforeMenuOpen = document.activeElement;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.removeAttribute("inert");

    navToggle.classList.add("is-active");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    if (navToggleIcon) {
        navToggleIcon.classList.remove("fa-bars-staggered");
        navToggleIcon.classList.add("fa-xmark");
    }

    lockBodyScroll();

    const focusables = getFocusableElements(mobileMenu);
    const target = mobileMenuClose || focusables[0] || mobileMenu;
    target.focus();
}

function closeMobileMenu({ restoreFocus = true } = {}) {
    if (!mobileMenu || !navToggle) return;

    if (document.activeElement && mobileMenu.contains(document.activeElement)) {
        navToggle.focus();
    }

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.setAttribute("inert", "");

    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (navToggleIcon) {
        navToggleIcon.classList.remove("fa-xmark");
        navToggleIcon.classList.add("fa-bars-staggered");
    }

    unlockBodyScroll();

    if (restoreFocus) {
        if (
            lastFocusedBeforeMenuOpen &&
            typeof lastFocusedBeforeMenuOpen.focus === "function" &&
            document.contains(lastFocusedBeforeMenuOpen)
        ) {
            lastFocusedBeforeMenuOpen.focus();
        } else {
            navToggle.focus();
        }
    }
}

function toggleMobileMenu() {
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function trapFocusInMobileMenu(event) {
    if (!mobileMenu || !mobileMenu.classList.contains("is-open")) return;
    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(mobileMenu);

    if (!focusableElements.length) {
        event.preventDefault();
        mobileMenu.focus();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
        if (activeElement === firstElement || !mobileMenu.contains(activeElement)) {
            event.preventDefault();
            lastElement.focus();
        }
    } else {
        if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

function initMobileMenu() {
    if (!navToggle || !mobileMenu) return;

    setMobileMenuInitialState();

    navToggle.addEventListener("click", toggleMobileMenu);
    mobileMenuClose?.addEventListener("click", () => closeMobileMenu());
    mobileMenuBackdrop?.addEventListener("click", () => closeMobileMenu());

    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu({ restoreFocus: false });
        });
    });

    window.addEventListener("resize", () => {
        if (isDesktopViewport() && mobileMenu.classList.contains("is-open")) {
            closeMobileMenu({ restoreFocus: false });
        }
    });
}

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
    }
}

function getPreferredTheme() {
    return "dark";
}

function applyTheme(theme) {
    html.setAttribute("data-theme", theme);

    if (!themeToggles.length) return;

    themeToggles.forEach((toggle) => {
        const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
    });
}

function toggleTheme() {
    applyTheme("dark");
    saveTheme("dark");
}

function initThemeToggle() {
    applyTheme("dark");
    saveTheme("dark");
}

function getCookieConsent() {
    try {
        return localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
        return null;
    }
}

function setCookieConsent(value) {
    try {
        localStorage.setItem(COOKIE_STORAGE_KEY, value);
    } catch {
    }
}

function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.hidden = false;
    requestAnimationFrame(() => cookieBanner.classList.add("is-visible"));
}

function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove("is-visible");

    window.setTimeout(() => {
        cookieBanner.hidden = true;
    }, 380);
}

function initCookieBanner() {
    if (!cookieBanner) return;

    const consent = getCookieConsent();
    if (!consent) {
        showCookieBanner();
    }

    cookieButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.cookieAction;
            if (!action) return;

            if (action === "accept") setCookieConsent("accepted");
            if (action === "decline") setCookieConsent("declined");

            hideCookieBanner();
        });
    });
}

function closeFaqItem(item) {
    if (!item) return;

    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.setAttribute("aria-expanded", "false");
    answer.hidden = true;
    item.classList.remove("is-open");
}

function openFaqItem(item) {
    if (!item) return;

    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.setAttribute("aria-expanded", "true");
    answer.hidden = false;
    item.classList.add("is-open");
}

function initFaqAccordion() {
    if (!faqRoots.length) return;

    faqRoots.forEach((root) => {
        const items = root.querySelectorAll("[data-faq-item]");

        items.forEach((item) => {
            const button = item.querySelector(".faq-question");
            if (!button) return;

            button.addEventListener("click", () => {
                const isExpanded = button.getAttribute("aria-expanded") === "true";

                items.forEach((otherItem) => {
                    if (otherItem !== item) closeFaqItem(otherItem);
                });

                if (isExpanded) {
                    closeFaqItem(item);
                } else {
                    openFaqItem(item);
                }
            });
        });
    });
}

function initRevealObserver() {
    if (!revealItems.length) return;

    const supportsIntersectionObserver = "IntersectionObserver" in window;

    revealItems.forEach((item) => {
        const delay = item.dataset.delay;
        if (delay) {
            item.style.setProperty("--reveal-delay", `${delay}ms`);
        }
    });

    if (!supportsIntersectionObserver) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px",
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function handleGlobalKeydown(event) {
    if (event.key === "Escape") {
        closeMobileMenu();
        return;
    }

    trapFocusInMobileMenu(event);
}

function handleScroll() {
    updateHeaderState();
    updateProgressBar();
}

function initPageScript() {
    const page = body.dataset.page;
    if (!page) return;

    const event = new CustomEvent("page:ready", {
        detail: { page },
    });

    window.dispatchEvent(event);
}

function initGsapDefaults() {
    if (!window.gsap) return;

    window.gsap.config({
        nullTargetWarn: false,
    });
}

function getCurrentPageFileName() {
    const path = window.location.pathname;
    const fileName = path.split("/").pop();

    return fileName || "index.html";
}

function setText(selector, value) {
    if (!value) return;

    document.querySelectorAll(selector).forEach((element) => {
        element.textContent = value;
    });
}

function setHref(selector, value) {
    if (!value) return;

    document.querySelectorAll(selector).forEach((element) => {
        element.setAttribute("href", value);
    });
}

function applyPageMetaFromConfig() {
    const config = window.SiteConfig;
    if (!config?.pageMeta) return;

    const pageFile = getCurrentPageFileName();
    const meta = config.pageMeta[pageFile];
    if (!meta) return;

    if (meta.title) {
        document.title = meta.title;
    }

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
        description = document.createElement("meta");
        description.setAttribute("name", "description");
        document.head.appendChild(description);
    }

    if (meta.description) {
        description.setAttribute("content", meta.description);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
    }

    if (meta.canonical) {
        canonical.setAttribute("href", meta.canonical);
    }

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        themeColor = document.createElement("meta");
        themeColor.setAttribute("name", "theme-color");
        document.head.appendChild(themeColor);
    }

    themeColor.setAttribute("content", "#0D0A07");
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePhoneHref(phoneDisplay = "") {
    const digits = String(phoneDisplay).replace(/[^\d+]/g, "");

    if (!digits) return "";
    if (digits.startsWith("+")) return `tel:${digits}`;

    return `tel:+${digits}`;
}

function replaceTextInTextNode(node, replacements) {
    if (!node || !node.nodeValue) return;

    let text = node.nodeValue;

    replacements.forEach(({ from, to }) => {
        if (!from || !to || from === to) return;

        const pattern = new RegExp(escapeRegExp(from), "g");
        text = text.replace(pattern, to);
    });

    node.nodeValue = text;
}

function replaceTextEverywhere(root, replacements) {
    if (!root || !replacements.length) return;

    const skipTags = new Set([
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "SVG",
        "PATH",
        "META",
        "LINK"
    ]);

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;

                if (!parent) return NodeFilter.FILTER_REJECT;
                if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => replaceTextInTextNode(node, replacements));
}

function replaceAttributesEverywhere(replacements) {
    const attributes = [
        "aria-label",
        "title",
        "alt",
        "placeholder",
        "value"
    ];

    document.querySelectorAll("*").forEach((element) => {
        attributes.forEach((attr) => {
            if (!element.hasAttribute(attr)) return;

            let value = element.getAttribute(attr);

            replacements.forEach(({ from, to }) => {
                if (!from || !to || from === to) return;

                const pattern = new RegExp(escapeRegExp(from), "g");
                value = value.replace(pattern, to);
            });

            element.setAttribute(attr, value);
        });
    });
}

function applyGlobalConfigReplacements() {
    const config = window.SiteConfig;
    if (!config) return;

    const company = config.company || {};
    const contact = config.contact || {};

    const companyName = company.name || "";
    const phoneDisplay = contact.phoneDisplay || "";
    const email = contact.email || "";
    const address = contact.address || "";

    const replacements = [
        ...(company.aliases || []).map((from) => ({
            from,
            to: companyName
        })),

        ...(contact.phoneAliases || []).map((from) => ({
            from,
            to: phoneDisplay
        })),

        ...(contact.emailAliases || []).map((from) => ({
            from,
            to: email
        })),

        ...(contact.addressAliases || []).map((from) => ({
            from,
            to: address
        }))
    ].filter((item) => item.from && item.to);

    replaceTextEverywhere(document.body, replacements);
    replaceAttributesEverywhere(replacements);

    const phoneHref = contact.phoneHref || normalizePhoneHref(phoneDisplay);
    const emailHref = contact.emailHref || (email ? `mailto:${email}` : "");

    if (phoneHref) {
        document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
            link.setAttribute("href", phoneHref);
        });
    }

    if (emailHref) {
        document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
            link.setAttribute("href", emailHref);
        });
    }
}

function applyBrandConfig() {
    const config = window.SiteConfig;
    if (!config) return;

    const company = config.company || {};
    const contact = config.contact || {};
    const footer = config.footer || {};
    const cookie = config.cookieBanner || {};

    setText(".site-logo__title", company.shortName || company.name);

    document.querySelectorAll(".site-logo").forEach((logo) => {
        logo.setAttribute("aria-label", `${company.name} home`);
    });

    setHref('a[href^="tel:"]', contact.phoneHref);
    setHref('a[href^="mailto:"]', contact.emailHref);

    document.querySelectorAll("[data-phone-text]").forEach((element) => {
        element.textContent = contact.phoneDisplay;
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
        const strong = link.querySelector("strong");

        if (strong && strong.textContent.match(/[0-9]/)) {
            strong.textContent = contact.phoneDisplay;
        }
    });

    document.querySelectorAll("[data-email-text]").forEach((element) => {
        element.textContent = contact.email;
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        const strong = link.querySelector("strong");

        if (strong && strong.textContent.includes("@")) {
            strong.textContent = contact.email;
            return;
        }

        if (!link.querySelector("i") && !link.querySelector("span")) {
            link.textContent = contact.email;
        }
    });

    setText("[data-company-name]", company.name);
    setText("[data-address-text]", contact.address);
    setText("[data-service-area]", company.serviceArea);

    document.querySelectorAll(".site-footer__brand > p").forEach((paragraph) => {
        paragraph.textContent = company.description;
    });

    const footerBadges = document.querySelectorAll(".footer-badges span");
    if (footer.badges?.length && footerBadges.length) {
        footerBadges.forEach((badge, index) => {
            if (footer.badges[index]) badge.textContent = footer.badges[index];
        });
    }

    document.querySelectorAll(".site-footer__disclaimer").forEach((disclaimer) => {
        disclaimer.textContent = footer.disclaimer;
    });

    document.querySelectorAll(".site-footer__bottom p").forEach((copyright) => {
        copyright.textContent = `© 2026 ${company.name}. All rights reserved.`;
    });

    document.querySelectorAll(".cookie-banner__text h2").forEach((title) => {
        title.textContent = cookie.title || "Your privacy choices";
    });

    document.querySelectorAll(".cookie-banner__text p").forEach((text) => {
        text.textContent = cookie.text || "";
    });
    applyGlobalConfigReplacements();
}

function initSiteConfig() {
    applyPageMetaFromConfig();
    applyBrandConfig();
}

function init() {
    initSiteConfig();

    initThemeToggle();

    updateHeaderState();
    updateProgressBar();

    initMobileMenu();
    initCookieBanner();
    initFaqAccordion();
    initGsapDefaults();
    initPageScript();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleGlobalKeydown);
}
document.addEventListener("DOMContentLoaded", init);
