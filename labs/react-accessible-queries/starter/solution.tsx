export function SupportSearch({results}:{results:number}){
 return <form role="search"><input type="search" name="q"/>
 <p>{results} results</p><button type="submit">Search</button></form>;
}
