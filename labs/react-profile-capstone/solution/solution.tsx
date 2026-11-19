export type Profile = {id:string; name:string; role:string;online:boolean;skills:readonly {id:string;label:string}[]};
export function ProfileDashboard({profile}:{profile:Profile}) {
  return <article aria-label={`Profile of ${profile.name}`}>
    <h2>{profile.name}</h2><p>{profile.role}</p>
    <p role="status">{profile.online?'Online':'Offline'}</p>
    {profile.skills.length ? <ul>{profile.skills.map(s=><li key={s.id} data-id={s.id}>{s.label}</li>)}</ul>
       : <p>No skills listed.</p>}
  </article>;
}
