export function SupportSearch({results}:{results:number}){
 return <form role="search"><label htmlFor="support-query">Search support</label>
 <input id="support-query" type="search" name="q"/>
 <p role="status">{results===1?'1 result':`${results} results`}</p>
 <button type="submit">Search</button></form>;
}
