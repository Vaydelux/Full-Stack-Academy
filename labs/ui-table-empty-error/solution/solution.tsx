export function viewState(loading:boolean,error:boolean,rows:number){if(error)return 'error';if(loading)return 'loading';return rows===0?'empty':'ready';}
