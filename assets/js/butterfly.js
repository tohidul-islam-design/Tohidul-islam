/**
 * Floating Butterfly - Global Scroll-to-Top Component
 * Features:
 * - Fixed right-center positioning with responsive scaling
 * - Smooth fade reveal when scrolling down past 160px
 * - Continuous gentle floating animation
 * - Interactive hover micro-effects
 * - Majestic GSAP-powered flight to top when clicked
 */
(function () {
    if (document.getElementById('floating-butterfly')) return;

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
    styleEl.id = 'butterfly-floating-styles';
    styleEl.textContent = `
        /* Floating Butterfly (Right Center) */
        #floating-butterfly {
            position: fixed;
            right: 8px;
            top: 50%;
            transform: translateY(-50%) translateX(32px);
            z-index: 45;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 640px) {
            #floating-butterfly {
                right: 16px;
            }
        }

        @media (min-width: 1024px) {
            #floating-butterfly {
                right: 28px;
            }
        }

        @media (min-width: 1440px) {
            #floating-butterfly {
                right: 40px;
            }
        }

        #floating-butterfly.is-visible {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
            pointer-events: auto;
        }

        @keyframes butterflyFloatGlobal {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-14px) rotate(3.5deg);
            }
        }

        .butterfly-img {
            animation: butterflyFloatGlobal 4s ease-in-out infinite;
            filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.22));
            transition: transform 0.35s ease, filter 0.35s ease;
        }

        #floating-butterfly:hover .butterfly-img {
            transform: scale(1.12) rotate(-6deg);
            filter: drop-shadow(0 18px 32px rgba(255, 209, 0, 0.45));
        }

        #floating-butterfly:active .butterfly-img {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(styleEl);

    // Create container
    const butterflyContainer = document.createElement('div');
    butterflyContainer.id = 'floating-butterfly';
    butterflyContainer.title = 'Fly to top';
    butterflyContainer.className = 'cursor-pointer group select-none';
    butterflyContainer.innerHTML = `
        <img src="${butterflyImgSrc}" alt="Butterfly" class="butterfly-img w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-52 xl:h-52 object-contain">
    `;

    function initButterfly() {
        if (!document.body.contains(butterflyContainer)) {
            document.body.appendChild(butterflyContainer);
        }

        let isButterflyFlying = false;

        // Scroll listener for smooth reveal
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

        // Click to Fly Animation
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
                    x: -30,
                    y: -45,
                    rotation: -18,
                    scale: 1.15,
                    duration: 0.35,
                    ease: "power1.out"
                })
                .to(butterflyContainer, {
                    x: -85,
                    y: -window.innerHeight * 0.65,
                    rotation: -35,
                    scale: 0.95,
                    duration: 0.65,
                    ease: "power1.inOut"
                })
                .to(butterflyContainer, {
                    x: -125,
                    y: -window.innerHeight * 1.3,
                    rotation: -50,
                    opacity: 0,
                    scale: 0.7,
                    duration: 0.5,
                    ease: "power2.in"
                });
            } else {
                butterflyContainer.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
                butterflyContainer.style.transform = 'translateY(-120vh) translateX(-100px) scale(0.7)';
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
        document.addEventListener('DOMContentLoaded', initButterfly);
    } else {
        initButterfly();
    }
})();
