import { ClientPrincipal } from "./userprofile";

export class DiaryRecording {
    guid?: string;
    user?: ClientPrincipal;
    matter?: string;
    measure?: string;
    cluster?: string;
    datetime?: Date;
    value?: string | number;
    status?: string;
}