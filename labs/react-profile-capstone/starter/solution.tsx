export type Profile = {id:string; name:string; role:string;online:boolean;skills:readonly {id:string;label:string}[]};
export function ProfileDashboard({_profile,profile}:{_profile?:Profile;profile:Profile}) {
  return <article><h2>Example User</h2><p>Online</p></article>;
}
