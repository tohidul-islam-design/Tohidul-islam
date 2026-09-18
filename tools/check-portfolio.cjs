const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const http = require('http');
const root=path.resolve(__dirname,'..');
const {chromium}=require('C:/Users/tohid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const projects=JSON.parse(fs.readFileSync(path.join(root,'content/projects.json'),'utf8'));
let scripts=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
 const html=fs.readFileSync(path.join(root,file),'utf8');
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {if(m[0].slice(0,m[0].indexOf('>')).includes('type="application/json"')) {JSON.parse(m[1]);continue;} new vm.Script(m[1],{filename:file}); scripts++;}
}
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!target.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
 if(!fs.existsSync(target)||!fs.statSync(target).isFile()) {res.writeHead(404).end();return;}
 const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.gif':'image/gif'};
 res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');
 fs.createReadStream(target).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try {
  for(const p of projects) {
   await page.goto(origin+'/work-'+p.slug+'.html',{waitUntil:'domcontentloaded'});
   assert.equal((await page.locator('header h1').innerText()).replace(/\.$/,''),p.title);
   assert.equal(await page.locator('main').count(),1);
   assert.equal(await page.locator('main').getByText('2.5M',{exact:true}).count(),0);
  }
  await page.goto(origin+'/case-studies-details.html?id=tms');
  await page.waitForURL('**/work-tms.html');
  await page.goto(origin+'/case-studies-details.html?id=unknown');
  assert.equal(await page.getByRole('heading',{name:'Find a project'}).count(),1);
  await page.goto(origin+'/index.html');
  assert(await page.locator('#recent-works').evaluate(el=>el.offsetTop < document.querySelector('#approach').offsetTop));
  assert.equal(await page.locator('.motion-toggle, .skip-link').count(),0);
  assert(await page.locator('html').evaluate(el=>!el.hasAttribute('data-motion-paused')));
  assert(await page.locator('video').evaluate(v=>v.autoplay && v.muted && v.loop));
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(root,'review-notes/home-desktop.png')});
  await page.goto(origin+'/contact-us.html');
  for(const name of ['Name *','Email *','Project Type','Message *']) assert.equal(await page.getByLabel(name,{exact:true}).count(),1);
  const summary=page.locator('summary').first();
  await summary.focus(); await page.keyboard.press('Enter');
  assert(await page.locator('details').first().evaluate(el=>el.open));
  await page.setViewportSize({width:390,height:844});
  for(const route of ['index.html','work-ed-ai.html','contact-us.html','case-studies.html']) {
   await page.goto(origin+'/'+route);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow: '+route);
   await page.locator('#nav-toggle').click();
   assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'),'true');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'),'false');
   if(route==='work-ed-ai.html') {
    for(const img of await page.locator('main img').all()) {await img.scrollIntoViewIfNeeded(); await img.evaluate(el=>el.decode());}
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(root,'review-notes/ed-ai-mobile.png'),fullPage:true});
    await page.locator('#design-decisions').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(root,'review-notes/ed-ai-decisions-mobile.png')});
   }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(origin+'/index.html');
  assert(await page.locator('video').evaluate(v=>v.paused));
  // Independent of CDN scripts: project content must remain correct and visible.
  await page.route('https://**/*',route=>route.abort());
  await page.goto(origin+'/work-tms.html');
  assert(await page.locator('header h1').isVisible());
  assert.equal(await page.locator('#preloader').isVisible(),false);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({inlineScripts:scripts,projects:projects.length,desktopMobileKeyboardMotionAndFallback:'passed'},null,2));
 } finally {await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
