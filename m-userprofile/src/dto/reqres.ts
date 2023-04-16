export class BaseResponse {
    status:'OK' | 'WARN' | 'KO';
    statusDescription?:string;
}

export class AppStatusResponse extends BaseResponse {
    resource: string;
}

export class GetLLoggedUserDetailsResponse extends BaseResponse {
    clientPrincipal?:ClientPrincipal;
}

export class ClientPrincipal {
    userGUID?:string;
    tenantGUID?:string;
    id?:string;
    name?:string;
    aud?:string;
    displayName?:string;
    username?:string;
    roles?:string[];
}