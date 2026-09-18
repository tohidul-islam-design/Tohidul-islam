(() => {
 const params = new URLSearchParams(location.search);
 const service = params.get('service');
 const packageName = params.get('package');
 const estimate = params.get('estimate');
 const message = document.getElementById('contact-message');
 if (!message || message.value || !['Website', 'Web App', 'Mobile App', 'Branding'].includes(service)) return;
 if (!packageName || packageName.length > 60 || !/^\d{1,6}$/.test(estimate || '')) return;
 const projectType = document.getElementById('contact-project_type');
 if (projectType) projectType.value = service === 'Branding' ? 'Brand Identity' : 'UI/UX Design';
 message.value = `I’m interested in ${service}: ${packageName} (starting estimate: $${Number(estimate).toLocaleString('en-US')} USD).\n\nMy project goals:\n\nCurrent stage:\n\nPreferred timeline:\n`;
})();
