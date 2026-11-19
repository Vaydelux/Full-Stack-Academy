// Local Next/Chromium integration. Source contract only until actually executed.
export async function verifyUiGallery({page,base,assert,wait}){
 const response=await page.goto(base+'/learn/ui-gallery');
 assert.equal(response.status(),200);
 await wait(page.getByRole('heading',{name:'Interactive component gallery'}));
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Practice gallery stays noindex');
 await page.getByRole('button',{name:'Dark theme'}).click();
 await wait(page.getByText('Component playground · dark'));
 await page.getByRole('button',{name:'Mobile'}).click();
 await wait(page.getByText('320px preview'));
 await page.getByRole('button',{name:'Save sample'}).click();
 await wait(page.getByRole('status').getByText('primary action activated locally'));
 await page.getByRole('button',{name:'Form validation'}).click();
 await page.getByRole('button',{name:'Validate form'}).click();
 await wait(page.getByRole('alert').getByText('Enter a valid email address to continue.'));
 await page.getByRole('textbox',{name:'Email address'}).fill('learner@example.test');
 await page.getByRole('button',{name:'Validate form'}).click();
 await wait(page.getByRole('status').getByText('Form validated locally. Nothing was submitted to a server.'));
 await page.getByRole('button',{name:'Status and disclosure'}).click();
 await page.getByText('What happens next?').click();
 await wait(page.getByText('The browser handles native disclosure activation. No server request is made.'));
 await page.getByRole('button',{name:'Show sample code'}).click();
 assert.equal(await page.locator('#gallery-code').count(),1,'Source drawer opened');
 console.log('UI gallery local interactions passed: theme, width, action, validation, disclosure and source');
}
