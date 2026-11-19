import React from "react";
export function Workshop(){return <form aria-label="Form accessibility workshop"><h2>Contact form</h2><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" aria-describedby="email-error" aria-invalid="true" required/><p id="email-error">Enter a valid email address.</p><button type="submit">Continue</button></form>;}
