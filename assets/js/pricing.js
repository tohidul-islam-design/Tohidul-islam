(() => {
 const catalog = JSON.parse(document.getElementById('pricing-data').textContent);
 const tabs = Array.from(document.querySelectorAll('[data-service]'));
 const panel = document.getElementById('pricing-panel');
 const cards = document.getElementById('pricing-cards');
 const tags = ['A focused start', 'Build the foundation', 'Expand the scope'];
 function select(tab) {
  const data = catalog[tab.dataset.service];
  tabs.forEach(button => { const active = button === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  panel.setAttribute('aria-labelledby', tab.id);
  document.getElementById('pricing-service-title').textContent = data.label + ' design';
  document.getElementById('pricing-service-description').textContent = data.description;
  cards.replaceChildren(...data.plans.map((plan, i) => {
   const card = document.createElement('article');
   card.className = 'plan-card' + (i === 1 ? ' featured' : '');
   const add = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; card.append(el); return el; };
   add('span', tags[i], 'plan-tag'); add('h3', plan.name);
   add('p', '$' + plan.price.toLocaleString('en-US'), 'plan-price');
   add('span', 'USD · starting estimate / project', 'price-unit'); add('p', plan.scope, 'plan-scope');
   const list = add('ul', ''); plan.features.forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); });
   const link = add('a', 'Discuss this scope ↗', 'offer-button' + (i === 1 ? '' : ' outline'));
   link.href = 'contact-us.html?' + new URLSearchParams({service:data.label, package:plan.name, estimate:plan.price}) + '#contact-form';
   return card;
  }));
 }
 tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', event => {
   let next;
   if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
   if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
   if (event.key === 'Home') next = 0;
   if (event.key === 'End') next = tabs.length - 1;
   if (next === undefined) return;
   event.preventDefault(); tabs[next].focus(); select(tabs[next]);
  });
 });
})();
