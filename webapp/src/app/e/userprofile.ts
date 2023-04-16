export class UserPrincipal {
    userGUID?:string;
    tenantGUID?:string;
    id?:string;
    name?:string;
    aud?:string;
    displayName?:string;
    username?:string;
    roles?:string[];
}

export class UserProfile {
    principal?:UserPrincipal;
}