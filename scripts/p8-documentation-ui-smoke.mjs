// Run against a locally built Academy only, in an isolated browser context.
export async function verifyDocumentationUI({browser,base,assert}) {
  const context = await browser.newContext({reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  try {
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base+'/reference/nestjs-canactivate');
      await page.getByRole('heading',{level:1,name:'NestJS: CanActivate'}).waitFor();
      const shell=page.locator('[data-doc-shell]');
      assert.ok(await shell.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Reference horizontal overflow at '+width);
      // The current reference layout deliberately collapses its section outline.
      // Open it through the actual user-facing disclosure, not a forced click.
      const outline=page.locator('details').filter({has:page.locator('nav[aria-label="On this page"]')});
      assert.equal(await outline.count(),1,'Expected one reference outline at '+width);
      const summary=outline.locator('summary');
      await summary.waitFor({state:'visible'});
      assert.equal(await outline.evaluate(el=>el.open),false,'Outline must initially be collapsed');
      await summary.focus();
      await page.keyboard.press('Enter');
      assert.equal(await outline.evaluate(el=>el.open),true,'Keyboard must open reference outline');
      const toc=page.getByRole('navigation',{name:'On this page'});
      await toc.waitFor({state:'visible'});
      await toc.getByRole('link',{name:'Production example',exact:true}).click();
      assert.equal(new URL(page.url()).hash,'#production');
      await page.locator('#production').getByRole('heading',{name:'Production example',exact:true}).waitFor({state:'visible'});
      const sidebar=page.getByRole('complementary',{name:'Reference categories'});
      if(width<1024){
        const toggle=sidebar.getByRole('button',{name:'Reference categories'});
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      }
      await sidebar.getByRole('link',{name:'PostgreSQL',exact:true}).click();
      await page.getByRole('heading',{name:'API and library references'}).waitFor();
      assert.equal(await page.getByLabel('Category',{exact:true}).inputValue(),'PostgreSQL');
      await page.getByLabel('Find a reference').fill('conflict');
      await page.getByRole('link',{name:/ON CONFLICT/}).waitFor();
      assert.ok(await page.locator('[data-doc-shell]').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Reference index horizontal overflow at '+width);
      await page.goto(base+'/learn/00.01.01');
      await page.getByRole('heading',{level:1}).waitFor();
      assert.ok(await page.locator('[data-doc-shell]').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Lesson horizontal overflow at '+width);
      const lessons=page.getByRole('complementary',{name:'Curriculum navigation'});
      if(width<1024) await lessons.getByRole('button',{name:'Curriculum navigation'}).click();
      const active=lessons.locator('a[aria-current="page"]');
      await active.waitFor({state:'visible'});
      assert.equal(await active.getAttribute('href'),'/learn/00.01.01');
      const adjacent=page.getByRole('navigation',{name:'Adjacent published lessons'});
      assert.equal(await adjacent.locator('a[rel="next"]').getAttribute('href'),'/learn/00.01.02');
      const skip=page.getByRole('link',{name:'Skip to article'});
      await skip.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'doc-main');
    }
    await page.goto(base+'/reference?category=invalid');
    assert.equal(await page.getByLabel('Category',{exact:true}).inputValue(),'all');
    await page.goto(base+'/reference/nestjs-canactivate');
    await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:new URL(base).origin});
    const syntax=page.locator('#syntax');
    const expected=await syntax.locator('pre').innerText();
    await syntax.getByRole('button',{name:'Copy code'}).click();
    await syntax.getByRole('status').getByText('Copied',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected);
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('denied'))}}));
    await syntax.getByRole('button',{name:'Copy code'}).click();
    await syntax.getByRole('status').getByText('Select and copy the code manually.').waitFor();
    assert.deepEqual(errors,[]);
    console.log('P8 documentation UI: four viewports, category navigation, section anchors, published links, skip focus, clipboard success/failure');
  } finally {await context.close();}
}
