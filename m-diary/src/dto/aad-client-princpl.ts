export class AzAADClientPrincipal {
    auth_typ?:string;
    name_typ?:string;
    role_typ?:string;
    claims?:AzAADClaim[];
}

export class AzAADClaim {
    typ?:string;
    val?:string;
}