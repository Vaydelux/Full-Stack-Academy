export type Issue={id:string;title:string};
export function IssueBoard({issues}:{issues:readonly Issue[]}){
 if(issues.length===0)return <p role="status">No issues.</p>;
 return <ul>{issues.map(issue=><li key={issue.id} data-issue-id={issue.id}>{issue.title}</li>)}</ul>;
}
