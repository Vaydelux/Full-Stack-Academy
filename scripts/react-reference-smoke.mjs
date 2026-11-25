// Browser-level regression against locally running Next, never the hosted production domain.
export async function verifyReactReferences({page,base,assert,wait}) {
 const index=await page.goto(base+'/reference');
 assert.equal(index.status(),200);
 await wait(page.getByRole('heading',{name:'API and library references'}));
 const search=page.getByLabel('Find a reference');
 await search.fill('useEffect');
 await page.getByLabel('Reference status').selectOption('authored');
 const link=page.getByRole('link',{name:/useEffect/}).first();
 await wait(link);
 assert.ok((await link.getAttribute('href')).includes('/reference/react-useeffect'));
 await link.click();
 await wait(page.getByRole('heading',{name:'React 19: useEffect()'}));
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored reference is indexable');
 const related=page.getByRole('heading',{name:'Related lessons and official source'});
 await wait(related);
 const destination=page.locator('#related a[href^="/learn/"]').first();
 await wait(destination);
 const lessonHref=await destination.getAttribute('href');
 await page.goto(base+lessonHref);
 const context=page.getByText('Prerequisites and official documentation',{exact:true});
 await context.click();
 await wait(page.getByRole('link',{name:'useEffect',exact:true}));
 const memo=await page.goto(base+'/reference/react-react-memo');
 assert.equal(memo.status(),200);
 await wait(page.getByRole('heading',{name:'React: React.memo'}));
 const unknown=await page.goto(base+'/reference/nonexistent-reference-f16');
 assert.equal(unknown.status(),404,'Unknown reference stays unavailable');
 console.log('React reference smoke authored: search/filter, authored draft and unknown-route boundaries');
}
