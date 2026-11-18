(function(){
 'use strict';
 function parseHex(color){
  if(typeof color!=='string'||!/^#[0-9a-fA-F]{6}$/.test(color))throw new Error('Expected six-digit hex color');
  const channels=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);
  return channels.map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
 }
 function luminance(color){
  const [r,g,b]=parseHex(color);
  return 0.2126*r+0.7152*g+0.0722*b;
 }
 function contrastRatio(a,b){
  const first=luminance(a),second=luminance(b);
  return (Math.max(first,second)+0.05)/(Math.min(first,second)+0.05);
 }
 globalThis.contrastRatio=contrastRatio;
})();
