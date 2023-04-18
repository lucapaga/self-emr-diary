export class MatterConfiguration {
    matter?: string;
    safeMin?: number | string;
    safeMax?: number | string;
    hints?: number[] | string[];
}

export class TimeSlotConfiguration {
    hourFrom: number;
    minuteFrom: number;
    hourTo: number;
    hourMinute: number;
}

export class ConfigurationEntry {
    iconName?: string;
    name?: string;
    applicableMatters?: MatterConfiguration[];
    timeSlots?: TimeSlotConfiguration[];
}

export class Configuration {
    key?: string;
    items?: ConfigurationEntry[];
}