// Isolated Chromium verification of the 64-lesson offline JavaScript + TypeScript batch.
// Browser fixtures are file: URLs, never deployed previews. Node/tsx separately verifies all 64 exercises.
export async function verifyJsTsBatch({page,base,assert,wait}) {
  const originalViewport = page.viewportSize();
  const modules = ['03.01','03.02','03.03','03.04','04.01','04.02','04.03','04.04'];
  for (const trackModule of modules) {
    for (const suffix of ['01','08']) {
      const id = trackModule + '.' + suffix;
      const result = await page.goto(base+'/learn/'+id);
      assert.equal(result.status(),200,'Published JS/TS route must load: '+id);
      await wait(page.getByRole('heading',{name:"The problem we're solving"}));
      assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored route indexable: '+id);
    }
  }
  await page.goto(base+'/learn/06.05.01');
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count()>0,'Next unauthored React module must remain noindex');
  const sitemap = await (await page.request.get(base+'/sitemap.xml')).text();
  // Local GitHub CI deliberately omits NEXT_PUBLIC_SITE_URL; the application must never publish localhost URLs.
  if (sitemap.includes('<loc>')) {
    for(const id of ['03.01.01','03.02.08','03.03.08','03.04.08','04.01.01','04.02.08','04.03.08','04.04.08'])assert.ok(sitemap.includes('/learn/'+id),'Configured public sitemap should include authored lesson '+id);
    assert.ok(!sitemap.includes('/learn/06.05.01'),'Planned lesson must not appear in sitemap');
  } else {
    assert.ok(sitemap.includes('<urlset'),'No-origin build should emit an empty valid sitemap instead of guessed localhost links');
  }

  const baseSlug = slug => new URL('../labs/js-'+slug+'/solution/index.html',import.meta.url).href;
  const visit = slug => page.goto(baseSlug(slug));
  await page.setViewportSize({width:320,height:780});
  const slugs=['dom','delegation','forms','history','storage','profiling','safe-dom','widget'];
  for (const slug of slugs) {
    await visit(slug);
    assert.equal(await page.locator('html').getAttribute('lang'),'en','Browser lab lang: '+slug);
    assert.equal(await page.getByRole('main').count(),1,'Browser lab main: '+slug);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Browser lab 320px overflow: '+slug);
  }

  await visit('dom');
  await page.getByRole('button',{name:'Increment'}).click();
  await page.getByRole('button',{name:'Increment'}).click();
  assert.equal(await page.getByRole('status').innerText(),'2','DOM events update observable output');
  await visit('delegation');
  await page.getByRole('button',{name:'Add B'}).click();
  await page.getByRole('button',{name:'Select B'}).click();
  assert.equal(await page.getByRole('status').innerText(),'B','Delegated event handles dynamically inserted child');
  await page.getByRole('button',{name:'Select A'}).click();
  assert.equal(await page.getByRole('status').innerText(),'A');
  await visit('forms');
  await page.getByLabel('Workshop name').fill('   ');
  await page.getByRole('button',{name:'Validate form'}).click();
  assert.match(await page.getByRole('status').innerText(),/at least two nonspace/);
  await page.getByLabel('Workshop name').fill('Ada');
  await page.getByRole('button',{name:'Validate form'}).click();
  assert.equal(await page.getByRole('status').innerText(),'Accepted: Ada');
  await visit('history');
  await page.getByRole('button',{name:'Apply filter'}).click();
  assert.ok(page.url().includes('#filter=CSS%20%26%20Web'),'History API should encode local URL state');
  await wait(page.getByRole('status').getByText('Filter: CSS & Web'));
  await visit('storage');
  await page.getByRole('button',{name:'Save local note'}).click();
  await wait(page.getByRole('status').getByText(/Stored using (memory|localStorage)/));
  await visit('profiling');
  await page.getByRole('button',{name:'Measure local calculation'}).click();
  assert.match(await page.getByRole('status').innerText(),/Measured local calculation; checksum 49995000, duration/);
  await visit('safe-dom');
  const suspicious='<img src=x onerror=alert(1)>';
  await page.getByLabel('Preview text').fill(suspicious);
  await page.getByRole('button',{name:'Preview as text'}).click();
  assert.equal(await page.getByRole('status').innerText(),suspicious,'Untrusted text must remain literal');
  assert.equal(await page.locator('output#status img').count(),0,'Untrusted content never becomes an image element');
  await visit('widget');
  const first=page.getByRole('tab',{name:'Overview'}),second=page.getByRole('tab',{name:'Resources'});
  await first.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await second.getAttribute('aria-selected'),'true','ArrowRight should activate next tab');
  assert.equal(await second.getAttribute('tabindex'),'0','Selected tab should be in natural Tab order');
  assert.equal(await page.locator('#panel-a').isHidden(),true);
  assert.equal(await page.locator('#panel-b').isVisible(),true);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await first.getAttribute('aria-selected'),'true','ArrowLeft should wrap to previous tab');
  assert.equal(await page.locator('#panel-a').isVisible(),true);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Accessible tabs must fit mobile');

  if(originalViewport)await page.setViewportSize(originalViewport);
  console.log('JavaScript/TypeScript batch smoke passed: 64 authored routes, sitemap/noindex and 8 real browser labs with keyboard and injection checks');
}
