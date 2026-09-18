(() => {
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const updateMotion = () => {
  document.documentElement.toggleAttribute('data-motion-paused', preference.matches);
  document.querySelectorAll('video[autoplay]').forEach(video => {
   if (preference.matches) video.pause();
   else video.play().catch(() => {});
  });
  window.dispatchEvent(new CustomEvent('portfolio-motion-change', {detail:{paused:preference.matches}}));
 };
 preference.addEventListener('change', updateMotion);
 updateMotion();
 window.addEventListener('load', () => {
  if (!document.querySelector('.recent-work-swiper.swiper-initialized')) {
   document.getElementById('recent-work-prev')?.setAttribute('hidden','');
   document.getElementById('recent-work-next')?.setAttribute('hidden','');
  }
 });
})();
