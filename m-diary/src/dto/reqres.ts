export class BaseResponse {
    status: 'OK' | 'WARN' | 'KO';
    statusDescription?: string;
}

export class AppStatusResponse extends BaseResponse {
    resource: string;
}

export class BaseRequest {

}

export class BareRecording {
    datetime?: Date;
    value?: string | number;
}

export class DiaryRecord {
    guid?: string;
    matter?: string;
    measure?: string;
    recording?: BareRecording;
    cluster?: string;
    status?: string;
}

export class SaveRecordingRequest extends BaseRequest {
    record?: DiaryRecord;
}

export class SaveRecordingResponse extends BaseResponse {
    record?: DiaryRecord;
}

export class LoadRecordingsResponse extends BaseResponse {
    records?: DiaryRecord[];
}

export class LoadAvailableClustersResponse extends BaseResponse {
    clusters?:string[];
}