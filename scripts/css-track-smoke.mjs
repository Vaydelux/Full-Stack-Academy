// Exact-head offline Chromium verification for all three CSS track expansion modules.
// This is a real browser check of static local fixtures, not a remote deployment or WCAG certificate.
export async function verifyCssTrack({ page, base, assert, wait }) {
  const originalViewport = page.viewportSize();
  const groups = [
    { module: '02.02', slugs: ['css-flexbox','css-grid-areas','css-intrinsic','css-position','css-overflow','css-container','css-breakpoints','css-sticky-debug'] },
    { module: '02.03', slugs: ['css-theme-tokens','css-color-contrast','css-dark-schemes','css-transitions','css-nesting','css-has','css-component-scope','css-theme-kit'] },
    { module: '02.04', slugs: ['css-render-stages','css-selector-perf','css-transform-opacity','css-font-cls','css-scroll-motion','css-devtools-audit','css-visual-regression','css-ui-qa-capstone'] },
  ];
  const path = slug => new URL('../labs/' + slug + '/solution/index.html', import.meta.url).href;
  const open = slug => page.goto(path(slug));
  const computed = (selector, property) => page.locator(selector).evaluate((element, key) => getComputedStyle(element).getPropertyValue(key), property);
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

  for (const group of groups) {
    const ids = group.slugs.map((_,i) => group.module + '.' + String(i+1).padStart(2,'0'));
    for (const id of [ids[0],ids[7]]) {
      await page.goto(base + '/learn/' + id);
      await wait(page.getByRole('heading', {name: "The problem we're solving"}));
      assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Newly authored lesson must be indexed: ' + id);
    }
  }
  await page.goto(base + '/learn/08.01.01');
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count() > 0, 'Next unauthored React lesson must remain noindex');

  await page.setViewportSize({width:320,height:800});
  for (const group of groups) {
    for (const slug of group.slugs) {
      await open(slug);
      assert.equal(await page.locator('html').getAttribute('lang'),'en','Offline CSS lab language: '+slug);
      assert.equal(await page.getByRole('main').count(),1,'Offline CSS lab must have one main landmark: '+slug);
      assert.ok(await noOverflow(),'Offline CSS lab must fit a 320px viewport: '+slug);
    }
  }

  // 02.02 Layout Engineering: verify actual layout, scrolling and container state.
  await open('css-flexbox');
  assert.equal((await computed('#demo','display')).trim(),'flex','Flex layout must be active');
  assert.equal((await computed('#demo','flex-wrap')).trim(),'wrap','Items must be able to wrap');
  const chipTops = await page.locator('.chip').evaluateAll(items=>items.map(el=>Math.round(el.getBoundingClientRect().top)));
  assert.ok(new Set(chipTops).size > 1,'Phone-width flex items must wrap to new lines');

  await open('css-grid-areas');
  assert.equal((await computed('#demo','grid-template-columns')).trim().split(/\s+/).length,1,'Phone-width Grid should have one track');
  await page.setViewportSize({width:1100,height:800});
  assert.equal((await computed('#demo','grid-template-columns')).trim().split(/\s+/).length,2,'Wide Grid should have two tracks');

  await page.setViewportSize({width:320,height:800});
  await open('css-intrinsic');
  assert.ok(await page.locator('#demo').evaluate(el=>el.getBoundingClientRect().right <= innerWidth),'Intrinsic width must fit the viewport');
  await open('css-position');
  assert.equal((await computed('#badge','position')).trim(),'absolute','Badge must not be fixed to viewport');
  const positions=await page.evaluate(()=>{const d=document.querySelector('#demo').getBoundingClientRect(),b=document.querySelector('#badge').getBoundingClientRect();return {within:b.left>=d.left&&b.right<=d.right&&b.top>=d.top&&b.bottom<=d.bottom}});
  assert.ok(positions.within,'Badge must remain within its positioned ancestor');
  await open('css-overflow');
  assert.equal((await computed('#resources','overflow-y')).trim(),'auto','Reference scrollport must use auto overflow');
  assert.ok(await page.locator('#resources').evaluate(el=>el.scrollHeight>el.clientHeight),'Reference must actually overflow its constrained region');
  assert.equal(await page.locator('#resources').getAttribute('tabindex'),'0','Keyboard users must be able to reach scrolling region');
  await open('css-container');
  assert.equal((await computed('#tile','display')).trim(),'block','Narrow container query should retain stacked layout');
  await page.setViewportSize({width:1100,height:800});
  assert.equal((await computed('#tile','display')).trim(),'grid','Wide query container should change tile to grid');
  await page.setViewportSize({width:320,height:800});
  await open('css-breakpoints');
  assert.equal((await computed('#cards','grid-template-columns')).trim().split(/\s+/).length,1,'Phone catalog uses one column');
  await page.setViewportSize({width:1100,height:800});
  assert.equal((await computed('#cards','grid-template-columns')).trim().split(/\s+/).length,3,'Desktop catalog uses three columns');
  await open('css-sticky-debug');
  assert.equal((await computed('#sidebar','position')).trim(),'sticky');
  assert.equal((await computed('#layout','overflow-x')).trim(),'visible','No sticky-breaking overflow ancestor');
  await page.evaluate(()=>window.scrollTo(0,450));
  await page.waitForFunction(()=>window.scrollY>200);
  const stickyTop=await page.locator('#sidebar').evaluate(el=>el.getBoundingClientRect().top);
  assert.ok(stickyTop>=0&&stickyTop<=36,'Sticky sidebar should remain near top after scrolling: '+stickyTop);

  // 02.03 Theme, color, scheme, selector and component state exercises.
  await page.setViewportSize({width:320,height:800});
  await open('css-theme-tokens');
  const beforeTheme=await computed('#demo','background-color');
  await page.getByRole('button',{name:'Switch component tokens'}).click();
  assert.notEqual(await computed('#demo','background-color'),beforeTheme,'CSS custom properties must affect computed background');
  await wait(page.getByRole('status').getByText('Dark tokens active.'));
  await open('css-color-contrast');
  const color=await computed('#subtitle','color');
  const bg=await computed('#subtitle','background-color');
  const parse = c => [...c.matchAll(/\d+(?:\.\d+)?/g)].slice(0,3).map(m=>Number(m[0])/255);
  const lum = c => parse(c).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[0.2126,0.7152,0.0722][i],0);
  const lc=lum(color),lb=lum(bg),ratio=(Math.max(lc,lb)+0.05)/(Math.min(lc,lb)+0.05);
  assert.ok(ratio>=4.5,'Ordinary subtitle text must meet 4.5:1 contrast; measured '+ratio.toFixed(2));
  await page.emulateMedia({colorScheme:'light'});
  await open('css-dark-schemes');
  const lightSurface=await computed('#demo','background-color');
  await page.emulateMedia({colorScheme:'dark'});
  assert.notEqual(await computed('#demo','background-color'),lightSurface,'light-dark() must respect color preference');
  await page.emulateMedia({colorScheme:'light'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await open('css-transitions');
  assert.equal((await computed('#demo-button','transition-duration')).trim(),'0s','Reduced motion should disable the transition');
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.notEqual((await computed('#demo-button','transition-duration')).trim(),'0s','Normal motion should retain a short transition');
  await open('css-nesting');
  assert.equal((await computed('#label','color')).trim(),'rgb(7, 94, 123)','Nested selector should style actual label');
  await page.locator('#topic').focus();
  assert.equal((await computed('#demo','outline-style')).trim(),'solid','Focus within should highlight the parent');
  await open('css-has');
  await page.locator('#pick').check();
  assert.equal((await computed('#demo','border-top-width')).trim(),'4px',':has checked state styles the containing panel');
  await open('css-component-scope');
  assert.notEqual(await computed('#course-title','color'),await computed('#article-title','color'),'Independent components should not share global title color');
  await open('css-theme-kit');
  const kitSurface=await computed('.kit-card','background-color');
  await page.getByRole('button',{name:'Toggle kit theme'}).click();
  assert.notEqual(await computed('.kit-card','background-color'),kitSurface,'Kit tokens must react to toggled state');
  assert.equal(await page.locator('#toggle-theme').getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Switch writing direction'}).click();
  assert.equal((await computed('#kit','border-right-width')).trim(),'4px','Kit logical accent should follow RTL');
  await page.keyboard.press('Tab');
  await page.locator('#kit-button').focus();
  assert.equal((await computed('#kit-button','outline-style')).trim(),'solid','Kit action must have focus treatment');

  // 02.04 Measurable CSS outcomes, not fabricated FPS/CLS or WCAG claims.
  await page.emulateMedia({reducedMotion:'reduce'});
  await open('css-render-stages');
  await page.getByRole('button',{name:'Toggle movement'}).click();
  assert.notEqual((await computed('#indicator','transform')).trim(),'none','Marker uses transform state for movement');
  assert.equal((await computed('#indicator','left')).trim(),'auto','Marker no longer animates left layout position');
  await open('css-selector-perf');
  assert.notEqual(await computed('#course-item','color'),await computed('#editor-item','color'),'CSS selectors must not leak between component namespaces');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await open('css-transform-opacity');
  await page.getByRole('button',{name:'Toggle notification'}).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#toast')).opacity === '1', { timeout: 5000 });
  assert.equal((await computed('#toast','opacity')).trim(),'1','Toast open state uses opacity after its transition settles');
  assert.ok((await computed('#toast','transition-property')).includes('transform'),'Toast animates transform, not width for users who allow motion');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal((await computed('#toast','transition-duration')).trim(),'0s','Toast disables animation for reduced motion');
  await open('css-font-cls');
  const sizes=await page.locator('#media').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height}});
  assert.ok(Math.abs(sizes.h-sizes.w*9/16)<2,'Media region should reserve 16:9 aspect ratio');
  await open('css-scroll-motion');
  assert.equal((await computed('#indicator','animation-name')).trim(),'none','Reduced-motion decoration must not animate');
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.equal((await computed('#indicator','animation-name')).trim(),'float','Normal-motion decoration may animate');
  await page.emulateMedia({reducedMotion:'reduce'});
  await open('css-devtools-audit');
  assert.equal((await computed('#demo','overflow-wrap')).trim(),'anywhere','Long identifier must wrap');
  assert.ok(await noOverflow(),'Audit card must avoid 320px horizontal overflow');
  await page.keyboard.press('Tab');
  await page.locator('#audit-button').focus();
  assert.equal((await computed('#audit-button','outline-style')).trim(),'solid','Audit action must retain focus ring');
  await open('css-visual-regression');
  const normalBorder=await computed('#variant','border-top-color');
  await page.getByRole('button',{name:'Toggle error state'}).click();
  assert.notEqual(await computed('#variant','border-top-color'),normalBorder,'Error state must be distinguishable');
  assert.equal((await computed('#variant','border-top-color')).trim(),'rgb(170, 38, 38)','Local visual baseline expected red border');

  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  await open('css-ui-qa-capstone');
  assert.ok(await noOverflow(),'QA capstone must fit the phone viewport');
  const qaLight=await computed('#qa','background-color');
  await page.emulateMedia({colorScheme:'dark'});
  assert.notEqual(await computed('#qa','background-color'),qaLight,'QA capstone must support dark scheme');
  await page.getByRole('button',{name:'Toggle direction'}).click();
  assert.equal((await computed('#qa','border-right-width')).trim(),'4px','QA card uses logical RTL border');
  await page.keyboard.press('Tab');
  await page.locator('#qa-action').focus();
  assert.equal((await computed('#qa-action','outline-style')).trim(),'solid','QA keyboard focus needs a visible outline');
  assert.equal((await computed('#qa-action','transition-duration')).trim(),'0s','QA honors reduced motion');
  await page.getByRole('button',{name:'Inspect locally'}).click();
  await wait(page.getByRole('status').getByText('Local QA interaction passed.'));

  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  if (originalViewport) await page.setViewportSize(originalViewport);
  console.log('CSS track smoke passed: 24 local labs, narrow/wide layout, sticky, tokens, contrast, dark, RTL, motion, focus and capstones');
}
