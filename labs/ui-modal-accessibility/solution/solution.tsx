export function modalPlan(title:string,cancelLabel:string){return {accessible:Boolean(title.trim()&&cancelLabel.trim()),initialFocus:'cancel'};}
