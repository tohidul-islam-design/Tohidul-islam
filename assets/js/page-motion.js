(() => {
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const images = new WeakMap();
 const reveals = new Map();
 const selector = '.scroll-reveal, section h2, .case-section .sf-split, .sf-cover, .sf-delivery > article, .vc-grid > article, .offer-card, .offer-process > li, .plan-card, #works-grid .section-group > .grid > *, #contact-form, main article';
 const gs = window.gsap;
 const st = window.ScrollTrigger;
 if (gs && st) gs.registerPlugin(st);
 function media(img) {
  if (images.has(img) || img.complete || img.closest('#navbar,.site-brand,#floating-contact-widget,#preloader')) return;
  img.classList.add('media-loading');
  const finish = () => {
   img.classList.remove('media-loading');
   clearTimeout(images.get(img));
   img.removeEventListener('load', finish);
   img.removeEventListener('error', finish);
   images.delete(img);
  };
  img.addEventListener('load', finish, {once:true});
  img.addEventListener('error', finish, {once:true});
  images.set(img, setTimeout(finish, 12000));
 }
 function reveal(el) {
  if (!gs || !st || reduce.matches || reveals.has(el) || el.closest('#hero-showcase,.swiper-wrapper,#navbar')) return;
  // Reveal groups together; don't animate their children twice.
  if (el.parentElement?.closest(selector)) return;
  const entry = {trigger:null, tween:null};
  reveals.set(el, entry);
  entry.trigger = st.create({trigger:el, start:'top 92%', once:true, onEnter:() => {
   if (reduce.matches || el.getBoundingClientRect().bottom <= 0) return;
   entry.tween = gs.fromTo(el, {opacity:0, y:24}, {opacity:1, y:0, duration:.7, ease:'power2.out', clearProps:'opacity,transform'});
  }});
 }
 function scan(root) {
  if (!(root instanceof Element || root instanceof Document)) return;
  if (root.matches?.('img')) media(root);
  root.querySelectorAll('img').forEach(media);
  if (root.matches?.(selector)) reveal(root);
  root.querySelectorAll(selector).forEach(reveal);
 }
 function init() {
  scan(document);
  let frame;
  new MutationObserver(records => {
   for (const record of records) {
    if (record.type === 'attributes') media(record.target);
    else record.addedNodes.forEach(scan);
   }
   for (const [el, entry] of reveals) if (!el.isConnected) {
    entry.trigger?.kill(); entry.tween?.kill(); reveals.delete(el);
   }
   if (st) { cancelAnimationFrame(frame); frame=requestAnimationFrame(() => st.refresh()); }
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  reduce.addEventListener('change', () => {
   for (const [el, entry] of reveals) {
    entry.trigger?.kill(); entry.tween?.kill();
    gs?.set(el,{clearProps:'opacity,transform'});
   }
   reveals.clear();
   if (!reduce.matches) scan(document);
  });
  window.addEventListener('load', () => st?.refresh(), {once:true});
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
 else init();
})();
