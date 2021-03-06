import { RootState } from '../../store';
import { IdType } from '../../api/Api';
import { createSelector } from 'reselect';
import { allAssignmentDuties } from '../assignments/selectors';
import { DEFAULT_SHERIFF_SORTER, sheriffsForCurrentLocation } from '../sheriffs/selectors';
import { doesSheriffHaveShift } from '../shifts/selectors';

export const visibleTime = (state: RootState): { visibleTimeStart: any, visibleTimeEnd: any } => {
    const { visibleTimeStart, visibleTimeEnd } = state.dutyRoster;
    return { visibleTimeStart, visibleTimeEnd };
};

export const draggingSheriff = (state: RootState): IdType | undefined => {
    const { currentDraggingSheriff } = state.dutyRoster;
    return currentDraggingSheriff;
};

export const dutiesForDraggingSheriff = createSelector(
    draggingSheriff,
    allAssignmentDuties,
    (sheriffId, duties = []) => {
        if (sheriffId) {
            return duties.filter(d => d.sheriffDuties.some(sd => sd.sheriffId === sheriffId));
        }
        return [];
    }
);

export const sheriffsOnShift = (state: RootState) => {
    const sheriffs = sheriffsForCurrentLocation(state);
    const defaultSorter = DEFAULT_SHERIFF_SORTER(state);
    const { visibleTimeStart } = visibleTime(state);
    return sheriffs.filter(s => doesSheriffHaveShift(visibleTimeStart, s.id)(state))
        .sort(defaultSorter);
};

export const sheriffsOffShift = (state: RootState) => {
    const sheriffs = sheriffsForCurrentLocation(state);
    const defaultSorter = DEFAULT_SHERIFF_SORTER(state);
    const { visibleTimeStart } = visibleTime(state);
    return sheriffs.filter(s => !doesSheriffHaveShift(visibleTimeStart, s.id)(state))
        .sort(defaultSorter);
};
