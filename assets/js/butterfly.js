/**
 * Floating Butterfly & WhatsApp Button Component
 * Features:
 * - Fixed bottom-right positioning
 * - Floating WhatsApp icon button with tooltip, badge, pulse effect, and direct link
 * - Butterfly positioned directly above the WhatsApp button
 * - Smooth scroll-reveal for butterfly (scroll-to-top feature on click)
 * - Persistent entrance for WhatsApp button
 * - Seamless responsive positioning across mobile, tablet, and desktop
 */
(function () {
    if (document.getElementById('floating-contact-widget')) return;

    // Detect if we are in a nested subdirectory or loaded via relative script
    let butterflyImgSrc = './assets/image/butterfly.gif';
    if (document.currentScript && document.currentScript.getAttribute('src')) {
        const scriptSrc = document.currentScript.getAttribute('src');
        if (scriptSrc.startsWith('../')) {
            butterflyImgSrc = '../assets/image/butterfly.gif';
        }
    } else if (window.location.pathname.includes('portfolio-projects')) {
        butterflyImgSrc = '../assets/image/butterfly.gif';
    }

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.id = 'floating-contact-widget-styles';
    styleEl.textContent = `
        /* Floating Widget Stack (Bottom Right) */
        #floating-contact-widget {
            position: fixed;
            right: 16px;
            bottom: 20px;
            z-index: 9990;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            pointer-events: none;
            user-select: none;
        }

        @media (min-width: 640px) {
            #floating-contact-widget {
                right: 24px;
                bottom: 28px;
                gap: 12px;
            }
        }

        @media (min-width: 1024px) {
            #floating-contact-widget {
                right: 32px;
                bottom: 36px;
                gap: 14px;
            }
        }

        /* 1. Butterfly Floating Element (Top of Stack) */
        #floating-butterfly {
            pointer-events: none;
            opacity: 0;
            transform: translateY(20px) scale(0.85);
            transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            position: relative;
        }

        #floating-butterfly.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        @keyframes butterflyFloatGlobal {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-10px) rotate(3deg);
            }
        }

        .butterfly-img {
            animation: butterflyFloatGlobal 3.8s ease-in-out infinite;
            filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.28));
            transition: transform 0.35s ease, filter 0.35s ease;
        }

        #floating-butterfly:hover .butterfly-img {
            transform: scale(1.12) rotate(-5deg);
            filter: drop-shadow(0 14px 28px rgba(255, 209, 0, 0.5));
        }

        #floating-butterfly:active .butterfly-img {
            transform: scale(0.95);
        }

        /* Butterfly Tooltip */
        .butterfly-tooltip {
            position: absolute;
            right: calc(100% + 12px);
            top: 50%;
            transform: translateY(-50%) translateX(8px);
            background: #050505;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 6px 12px;
            border-radius: 9999px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .butterfly-tooltip::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent #050505;
        }

        #floating-butterfly:hover .butterfly-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }

        /* 2. WhatsApp Floating Button (Bottom of Stack) */
        #floating-whatsapp-btn {
            position: relative;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            background: #25D366;
            color: #ffffff;
            border-radius: 50%;
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.45), 0 4px 10px rgba(0, 0, 0, 0.15);
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, background-color 0.3s ease;
            text-decoration: none;
            cursor: pointer;
        }

        @media (min-width: 640px) {
            #floating-whatsapp-btn {
                width: 58px;
                height: 58px;
            }
        }

        #floating-whatsapp-btn:hover {
            transform: scale(1.08) translateY(-3px);
            background: #20ba5a;
            box-shadow: 0 14px 30px rgba(37, 211, 102, 0.55), 0 6px 14px rgba(0, 0, 0, 0.2);
            color: #ffffff;
        }

        #floating-whatsapp-btn:active {
            transform: scale(0.95);
        }

        #floating-whatsapp-btn i {
            font-size: 28px;
            transition: transform 0.3s ease;
        }

        @media (min-width: 640px) {
            #floating-whatsapp-btn i {
                font-size: 32px;
            }
        }

        #floating-whatsapp-btn:hover i {
            transform: scale(1.05);
        }

        /* Pulse Ring around WhatsApp Button */
        .whatsapp-pulse-ring {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid #25D366;
            opacity: 0.7;
            animation: whatsappPulse 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
            pointer-events: none;
        }

        @keyframes whatsappPulse {
            0% {
                transform: scale(0.95);
                opacity: 0.8;
            }
            70% {
                transform: scale(1.35);
                opacity: 0;
            }
            100% {
                transform: scale(1.45);
                opacity: 0;
            }
        }

        /* Online Status Green Indicator */
        .whatsapp-status-dot {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 13px;
            height: 13px;
            background-color: #10B981;
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
        }

        /* WhatsApp Tooltip on Hover */
        .whatsapp-tooltip {
            position: absolute;
            right: calc(100% + 14px);
            top: 50%;
            transform: translateY(-50%) translateX(8px);
            background: #050505;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            padding: 8px 14px;
            border-radius: 9999px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.12);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .whatsapp-tooltip::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent #050505;
        }

        #floating-whatsapp-btn:hover .whatsapp-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }
    `;
    document.head.appendChild(styleEl);

    // Create Widget Container
    const widget = document.createElement('div');
    widget.id = 'floating-contact-widget';
    widget.setAttribute('role', 'region');
    widget.setAttribute('aria-label', 'Quick Contact and Navigation Controls');

    // Inner HTML with Butterfly on top and WhatsApp below it
    widget.innerHTML = `
        <!-- Floating Butterfly (Fly to top) -->
        <div id="floating-butterfly" title="Fly to top" class="group select-none" role="button" aria-label="Scroll back to top">
            <span class="butterfly-tooltip">Back to top ↑</span>
            <img src="${butterflyImgSrc}" alt="Butterfly" class="butterfly-img w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain">
        </div>

        <!-- Floating WhatsApp Button -->
        <a id="floating-whatsapp-btn" 
           href="https://wa.me/8801760149575?text=Hello%20Tohidul,%20I%20would%20like%20to%20discuss%20a%20project!" 
           target="_blank" 
           rel="noopener noreferrer" 
           aria-label="Chat with Tohidul on WhatsApp" 
           title="Chat on WhatsApp">
            <div class="whatsapp-pulse-ring"></div>
            <i class="fa-brands fa-whatsapp"></i>
            <span class="whatsapp-status-dot"></span>
            <span class="whatsapp-tooltip">
                <i class="fa-brands fa-whatsapp text-emerald-400"></i> Chat with me
            </span>
        </a>
    `;

    function initWidget() {
        if (!document.body.contains(widget)) {
            document.body.appendChild(widget);
        }

        const butterflyContainer = document.getElementById('floating-butterfly');
        if (!butterflyContainer) return;

        let isButterflyFlying = false;

        // Scroll listener for butterfly smooth reveal (reveals when scrolled past 160px)
        window.addEventListener('scroll', () => {
            if (!isButterflyFlying) {
                if (window.scrollY > 160) {
                    butterflyContainer.classList.add('is-visible');
                } else {
                    butterflyContainer.classList.remove('is-visible');
                }
            }
        }, { passive: true });

        // Initial check on load
        if (window.scrollY > 160) {
            butterflyContainer.classList.add('is-visible');
        }

        // Click on butterfly to fly to top
        butterflyContainer.addEventListener('click', () => {
            if (isButterflyFlying) return;
            isButterflyFlying = true;

            // Smooth scroll to top using Lenis if active, or native smooth scroll
            if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(0, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // GSAP Flight Animation
            if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(butterflyContainer, { clearProps: 'all' });
                        butterflyContainer.classList.remove('is-visible');
                        isButterflyFlying = false;
                    }
                });

                tl.to(butterflyContainer, {
                    x: -25,
                    y: -40,
                    rotation: -18,
                    scale: 1.15,
                    duration: 0.35,
                    ease: "power1.out"
                })
                .to(butterflyContainer, {
                    x: -70,
                    y: -window.innerHeight * 0.65,
                    rotation: -32,
                    scale: 0.95,
                    duration: 0.65,
                    ease: "power1.inOut"
                })
                .to(butterflyContainer, {
                    x: -110,
                    y: -window.innerHeight * 1.3,
                    rotation: -45,
                    opacity: 0,
                    scale: 0.7,
                    duration: 0.5,
                    ease: "power2.in"
                });
            } else {
                butterflyContainer.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
                butterflyContainer.style.transform = 'translateY(-120vh) translateX(-80px) scale(0.7)';
                butterflyContainer.style.opacity = '0';
                setTimeout(() => {
                    butterflyContainer.style.transition = '';
                    butterflyContainer.style.transform = '';
                    butterflyContainer.style.opacity = '';
                    butterflyContainer.classList.remove('is-visible');
                    isButterflyFlying = false;
                }, 1300);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
