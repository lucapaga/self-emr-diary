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

export class UserPreference {
    key?: 'recording-matter' | 'recording-measure' | 'filter-per-m&m' | 'filter-per-cluster' | 'selected-cluster';
    value?: string | number | boolean | Date;
}