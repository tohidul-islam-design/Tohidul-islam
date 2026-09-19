(() => {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');
    if (!toggle || !links || !navbar) return;

    navbar.setAttribute('aria-label', 'Main navigation');
    const logo = document.getElementById('nav-logo');
    if (logo) {
        const brand = document.createElement('div');
        brand.className = 'site-brand';
        navbar.before(brand);
        brand.append(logo);
        logo.href = 'index.html';
    }
    const contact = document.getElementById('nav-btn');
    if (contact) {
        // Keep visual and keyboard order aligned around the center action.
        links.insertBefore(contact, links.children[2]);
        const mobileContact = contact.cloneNode(true);
        mobileContact.removeAttribute('id');
        mobileContact.className = 'nav-mobile-contact';
        toggle.before(mobileContact);
    }
    const menuLabel = document.createElement('span');
    menuLabel.textContent = 'Menu';
    toggle.prepend(menuLabel);
    const page = location.pathname.split('/').pop() || 'index.html';
    const activePage = page.startsWith('work-') || page === 'case-studies-details.html'
        ? 'case-studies.html' : ['service-details.html', 'approach.html'].includes(page) ? 'our-services.html' : page;
    links.querySelectorAll('a').forEach((link) => {
        if (new URL(link.href).pathname.split('/').pop() === activePage) {
            link.setAttribute('aria-current', 'page');
        }
    });

    const desktop = window.matchMedia('(min-width: 768px)');
    const icon = toggle.querySelector('i');
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', links.id);
    links.setAttribute('data-lenis-prevent', '');

    function setOpen(open, restoreFocus = false) {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        if (icon) {
            icon.classList.toggle('fa-bars', !open);
            icon.classList.toggle('fa-xmark', open);
            icon.setAttribute('aria-hidden', 'true');
        }
        if (restoreFocus) toggle.focus();
    }

    setOpen(false);
    toggle.addEventListener('click', () => {
        if (!desktop.matches) setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false, true);
        }
    });
    document.addEventListener('focusin', (event) => {
        if (!navbar.contains(event.target)) setOpen(false);
    });
    desktop.addEventListener('change', () => {
        const focusWasInLinks = links.contains(document.activeElement);
        const focusWasOnToggle = document.activeElement === toggle;
        setOpen(false, !desktop.matches && focusWasInLinks);
        if (desktop.matches && focusWasOnToggle) links.querySelector('a')?.focus();
    });
})();

// Animate same-tab menu navigation, then let the destination's page loader run.
(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const curtain = document.createElement('div');
    curtain.className = 'page-transition';
    curtain.setAttribute('aria-hidden', 'true');
    const indicator = document.createElement('span');
    indicator.className = 'page-transition-indicator';
    curtain.append(indicator);
    document.body.append(curtain);
    let pending = false;
    let navigationTimer;
    let recoveryTimer;
    function reset() {
        clearTimeout(navigationTimer);
        clearTimeout(recoveryTimer);
        pending = false;
        curtain.classList.remove('is-leaving');
    }
    window.addEventListener('pageshow', reset);
    document.addEventListener('click', event => {
        const link = event.target.closest?.('#navbar a, .site-brand a');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const destination = new URL(link.href, location.href);
        if (destination.origin !== location.origin || !['http:', 'https:', 'file:'].includes(destination.protocol)) return;
        if (destination.pathname === location.pathname && destination.search === location.search) return;
        if (reducedMotion.matches) return;
        event.preventDefault();
        if (pending) return;
        pending = true;
        curtain.classList.add('is-leaving');
        navigationTimer = setTimeout(() => {
            location.assign(destination.href);
            // Recover if the browser cancels navigation or the next page stalls.
            recoveryTimer = setTimeout(reset, 5000);
        }, 350);
    });
})();
