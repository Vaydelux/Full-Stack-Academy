export function imagePlan(width:number,height:number,hero:boolean){
 if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<=0||height<=0)throw new RangeError('Invalid image dimensions');
 return {width,height,preload:hero,sizes:'(max-width: 768px) 100vw, 720px'};
}
