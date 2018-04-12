import * as moment from 'moment';
import { displayEnum } from '../infrastructure/EnumUtils';

export type DateType = Date | moment.Moment | string;
export type StringMap = { [key: string]: string };
export type IdType = string;
export type ShiftMap = { [key: number]: Shift };
export type LeaveMap = { [key: number]: Leave };
export type SheriffMap = { [key: number]: Sheriff };
export type AssignmentMap = { [key: number]: Assignment };
export type AssignmentDutyMap = { [key: number]: AssignmentDuty };
export type WorkSectionCode = 'COURTS' | 'JAIL' | 'ESCORTS' | 'OTHER';
export type Assignment = CourtAssignment | JailAssignment | EscortAssignment | OtherAssignment;
export type TimeType = string | number;
export type CourtroomMap = { [key: number]: Courtroom };
export type RunMap = { [key: number]: Run };
export type JailRoleMap = { [key: number]: JailRole };
export type AlternateAssignmentMap = { [key: number]: AlternateAssignment };

/* tslint:disable:no-bitwise */
export enum DaysOfWeek {
    Mon = 1 << 0,
    Tue = 1 << 1,
    Wed = 1 << 2,
    Thu = 1 << 3,
    Fri = 1 << 4,
    Sat = 1 << 5,
    Sun = 1 << 6,
    Everyday = Mon | Tue | Wed | Thu | Fri | Sat | Sun,
    Weekdays = Mon | Tue | Wed | Thu | Fri
}

/* tslint:enable:no-bitwise */

export namespace DaysOfWeek {

    export function getDisplayValues(value: DaysOfWeek): string[] {
        let dayDisplay = displayEnum(DaysOfWeek, value);

        const weekdaysIndex = dayDisplay.indexOf('Weekdays');
        const satIndex = dayDisplay.indexOf('Sat');
        const sunIndex = dayDisplay.indexOf('Sun');

        if (weekdaysIndex > -1) {
            if (satIndex > -1 || sunIndex > -1) {
                dayDisplay.splice(weekdaysIndex, 1);
            }
        }

        return dayDisplay;
    }

    export function getWeekdayNumbers(value: DaysOfWeek): number[] {
        const dayMap = {
            'Sun': 0,
            'Mon': 1,
            'Tue': 2,
            'Wed': 3,
            'Thu': 4,
            'Fri': 5,
            'Sat': 6
        };

        const dayNames = getDisplayValues(value);
        let dayNumbers: number[] = [];

        if (dayNames.indexOf('Everyday') !== -1) {
            dayNumbers = [0, 1, 2, 3, 4, 5, 6];
        } else if (dayNames.indexOf('Weekdays') !== -1) {
            dayNumbers = [1, 2, 3, 4, 5];
        } else {
            dayNames.forEach(day => {
                dayNumbers.push(dayMap[day]);
            });
        }

        return dayNumbers;
    }
}

export const BLANK_SHERIFF: Sheriff = {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: '',
    lastName: '',
    badgeNo: '-1',
    imageUrl: '/img/avatar.png'
};

export const BLANK_COURTHOUSE: Courthouse = {
    id: '-1',
    name: ''
};

export const DEFAULT_RECURRENCE: RecurrenceInfo[] = [
    {
        daysBitmap: DaysOfWeek.Weekdays,
        startTime: moment().hour(9).minute(0),
        endTime: moment().hour(12).minute(0),
        sheriffsRequired: 1
    },
    {
        daysBitmap: DaysOfWeek.Weekdays,
        startTime: moment().hour(13).minute(0),
        endTime: moment().hour(17).minute(0),
        sheriffsRequired: 2
    }
];

export interface Sheriff {
    id: IdType;
    firstName: string;
    lastName: string;
    badgeNo: string;
    imageUrl?: string;
}

export interface BaseAssignment {
    id: IdType;
    title: string;
    courthouseId: IdType;
    workSectionId: WorkSectionCode;
    dutyRecurrences?: RecurrenceInfo[];
}

export interface CourtAssignment extends BaseAssignment {
    workSectionId: 'COURTS';
    courtroomId: IdType;
}

export interface JailAssignment extends BaseAssignment {
    workSectionId: 'JAIL';
    jailRoleId: IdType;
}

export interface EscortAssignment extends BaseAssignment {
    workSectionId: 'ESCORTS';
    runId: IdType;
}

export interface OtherAssignment extends BaseAssignment {
    workSectionId: 'OTHER';
    otherAssignmentTypeId: IdType;
}

export interface AssignmentDutyDetails {
    notes?: string;
}

export interface AssignmentDuty {
    id: IdType;
    assignmentId: IdType;
    startDateTime: DateType;
    endDateTime: DateType;
    sheriffDuties: SheriffDuty[];
    sheriffsRequired: number;
    extraDetails?: AssignmentDutyDetails;
}

export interface SheriffDuty {
    id: IdType;
    sheriffId?: IdType;
    dutyId: IdType; 
    startDateTime: DateType;
    endDateTime: DateType;
}

export interface RecurrenceInfo {
    id?: IdType;
    assignmentIdPath?: IdType;
    startTime: DateType;
    endTime: DateType;
    daysBitmap: DaysOfWeek;
    sheriffsRequired: number;
}

export interface Courthouse {
    id: IdType;
    name: string;
}

export interface Region {
    id: number;
    name: string;
}

export interface Courtroom {
    id: IdType;
    courthouseId: IdType;
    code: IdType;
    name: string;
}

export interface JailRole {
    id: IdType;
    title: string;
}

export interface Shift {
    id: IdType;
    sheriffId?: IdType;
    courthouseId: IdType;
    workSectionId?: WorkSectionCode;
    startDateTime: DateType;
    endDateTime: DateType;
}

export interface ShiftCopyOptions {
    shouldIncludeSheriffs: boolean;
    startOfWeekSource: DateType;
    startOfWeekDestination: DateType;
}

export interface Leave {
    id: IdType;
    sheriffId: IdType;
    date: DateType;
    leaveCode?: string;
}

export interface Run {
    id: IdType;
    courthouseId: IdType | string;
    description: string;
}

export interface AlternateAssignment {
    id: IdType | string;
    description: string;
}

export interface API {

    // Sheriffs
    getSheriffs(): Promise<Sheriff[]>;
    createSheriff(newSheriff: Sheriff): Promise<Sheriff>;
    updateSheriff(sheriffToUpdate: Partial<Sheriff>): Promise<Sheriff>;

    // Assignments
    getAssignments(): Promise<Assignment[]>;
    createAssignment(assignment: Partial<Assignment>): Promise<Assignment>;
    updateAssignment(assignment: Partial<Assignment>): Promise<Assignment>;
    deleteAssignment(assignmentId: IdType): Promise<void>;

    // Assignment Duties
    getAssignmentDuties(): Promise<AssignmentDuty[]>;
    createAssignmentDuty(duty: Partial<AssignmentDuty>): Promise<AssignmentDuty>;
    updateAssignmentDuty(duty: Partial<AssignmentDuty>): Promise<AssignmentDuty>;
    deleteAssignmentDuty(dutyId: IdType): Promise<void>;

    // Sheriff Shifts
    getShifts(): Promise<Shift[]>;
    updateShift(shiftToUpdate: Partial<Shift>): Promise<Shift>;
    createShift(newShift: Partial<Shift>): Promise<Shift>;
    deleteShift(shiftId: IdType): Promise<void>;
    copyShifts(shiftCopyDetails: ShiftCopyOptions): Promise<Shift[]>;

    // Sheriff Leaves
    getLeaves(): Promise<Leave[]>;

    getCourtrooms(): Promise<Courtroom[]>;
    getRuns(): Promise<Run[]>;
    getJailRoles(): Promise<JailRole[]>;
    getAlternateAssignmentTypes(): Promise<AlternateAssignment[]>;
}