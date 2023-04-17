export class BaseResponse {
    status:'OK' | 'WARN' | 'KO';
    statusDescription?:string;
}

export class AppStatusResponse extends BaseResponse {
    resource: string;
}
