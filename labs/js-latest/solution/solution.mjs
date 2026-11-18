export function solve(){let current=0;return async task=>{const id=++current;const value=await task();return id===current?{accepted:true,value}:{accepted:false,value:null};};}
