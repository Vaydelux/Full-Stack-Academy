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
 const indexOnly=await page.goto(base+'/reference/react-react-memo');
 assert.equal(indexOnly.status(),200);
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Unwritten reference stays noindex');
 console.log('React reference smoke authored: search/filter, authored draft and indexed-only SEO boundaries');
}
