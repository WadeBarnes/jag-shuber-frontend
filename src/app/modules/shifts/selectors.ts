import { RootState } from '../../store';
import { createSelector } from 'reselect';
import * as shiftRequests from './requests/shifts';
import * as leaveRequests from './requests/leaves';
import {
    Shift,
    ShiftMap,
    LeaveMap,
    Leave
} from '../../api/Api';

export const allShifts = createSelector(
    shiftRequests.shiftMapRequest.getData,
    (map: ShiftMap = {}): Shift[] => {
        const list: Shift[] = Object.keys(map).map((k, i) => map[k]);
        return list;
    }
);

export const getShift = (id?: number) => (state: RootState) => {
    if (state && id != null) {
        const map: ShiftMap = shiftRequests.shiftMapRequest.getData(state);
        return map[id];
    }
    return null;
};

export const getSheriffShifts = (sheriffId?: number) => (state: RootState) => {
    if (state && sheriffId != null) {
        return allShifts(state).filter(s => s.sheriffId === sheriffId);
    }
    return [];
};

export const allLeaves = createSelector(
    leaveRequests.leaveMapRequest.getData,
    (map: LeaveMap = {}): Leave[] => {
        const list: Leave[] = Object.keys(map).map((k, i) => map[k]);
        return list;
    }
);

export const getLeave = (id?: number) => (state: RootState) => {
    if (state && id != null) {
        const map: LeaveMap = leaveRequests.leaveMapRequest.getData(state);
        return map[id];
    }
    return null;
};

export const getSheriffLeaves = (sheriffId?: number) => (state: RootState) => {
    if (state && sheriffId != null) {
        return allLeaves(state).filter(l => l.sheriffId === sheriffId);
    }
    return [];
};