import { UserProfile } from "./userprofile";

export class BareRecording {
    datetime?: Date;
    value?: string | number;
}

export class DiaryRecord {
    guid?: string;
    // userProfile?: UserProfile;
    matter?: string;
    measure?: string;
    recording?: BareRecording;
    cluster?: string;
    status?: string;
}