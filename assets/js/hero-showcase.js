(() => {
 const viewport = document.getElementById('hero-showcase');
 if (!viewport) return;
 const track = viewport.querySelector('.showcase-track');
 if (!track || !track.children.length) return;
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const originals = Array.from(track.children);
 originals.forEach(card => {
  const copy = card.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  track.append(copy);
 });
 let distance = 0, position = viewport.scrollLeft, previous = 0, resumeAt = 0;
 let touching = false, visible = true;
 const measure = () => {
  distance = track.children[originals.length].offsetLeft - originals[0].offsetLeft;
  position = viewport.scrollLeft;
 };
 new ResizeObserver(measure).observe(track);
 new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(viewport);
 let pointerId = null, startX = 0, startScroll = 0, dragged = false, suppressClick = false;
 viewport.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  touching = true;
  suppressClick = false;
  dragged = false;
  // Touch keeps native horizontal swiping and vertical page scrolling.
  if (event.pointerType === 'touch') return;
  pointerId = event.pointerId;
  startX = event.clientX;
  startScroll = viewport.scrollLeft;
 });
 viewport.addEventListener('pointermove', event => {
  if (event.pointerId !== pointerId) return;
  const delta = event.clientX - startX;
  if (!dragged && Math.abs(delta) < 6) return;
  if (!dragged) {
   dragged = true;
   viewport.setPointerCapture(pointerId);
   viewport.classList.add('is-dragging');
  }
  event.preventDefault();
  viewport.scrollLeft = startScroll - delta;
  position = viewport.scrollLeft;
 });
 const release = () => {
  suppressClick = dragged;
  dragged = false;
  touching = false;
  const releasedPointer = pointerId;
  pointerId = null;
  viewport.classList.remove('is-dragging');
  if (releasedPointer !== null && viewport.hasPointerCapture(releasedPointer)) viewport.releasePointerCapture(releasedPointer);
  resumeAt = performance.now() + 1800;
 };
 viewport.addEventListener('dragstart', event => event.preventDefault());
 viewport.addEventListener('click', event => {
  if (!suppressClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressClick = false;
 }, true);
 window.addEventListener('pointerup', release);
 window.addEventListener('pointercancel', release);
 window.addEventListener('blur', release);
 viewport.addEventListener('wheel', () => { resumeAt = performance.now() + 1800; }, {passive:true});
 viewport.addEventListener('keydown', event => {
  if (event.target !== viewport || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  viewport.scrollBy({left:(event.key === 'ArrowRight' ? 1 : -1)*viewport.clientWidth*.75,behavior:'auto'});
 });
 function animate(now) {
  const elapsed = previous ? Math.min(now - previous, 50) : 0;
  previous = now;
  const keyboardFocused = viewport.matches(':focus-visible') || !!viewport.querySelector(':focus-visible');
  if (!preference.matches && !keyboardFocused && !touching && visible && !document.hidden && now >= resumeAt && distance > 0) {
   position = (position + elapsed * .035) % distance;
   viewport.scrollLeft = position;
  } else position = viewport.scrollLeft;
  requestAnimationFrame(animate);
 }
 measure();
 requestAnimationFrame(animate);
})();
