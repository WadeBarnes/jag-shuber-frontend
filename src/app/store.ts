import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { default as thunk, ThunkAction as _ThunkAction } from 'redux-thunk';

import { reducer as modalReducer } from 'redux-modal';
import { reducer as formReducer } from 'redux-form';

import { registerReducer as registerSystemReducer, SystemModuleState } from './modules/system/reducer';
import { registerReducer as registerRolesReducer, RoleModuleState } from './modules/roles/reducer';
import { registerReducer as registerUsersReducer, UserModuleState as UsersModuleState } from './modules/users/reducer';
import { registerReducer as registerSheriffReducer, SheriffModuleState } from './modules/sheriffs/reducer';
import { registerReducer as registerAssignmentReducer, AssignmentModuleState } from './modules/assignments/reducer';
import { registerReducer as registerShiftReducer, ShiftModuleState } from './modules/shifts/reducer';
import { registerReducer as registerLeavesReducer, LeaveModuleState } from './modules/leaves/reducer';

import { registerReducer as registerCurrentUserReducer, UserState as CurrentUserState } from './modules/user/reducer';
import { default as dutyRosterReducer, DutyRosterState } from './modules/dutyRoster/reducer';
import { default as scheduleReducer, ScheduleState } from './modules/schedule/reducer';
import { default as assignmentScheduleReducer, AssignmentScheduleState } from './modules/assignmentSchedule/reducer';

import { default as api, API } from './api';
import Client from './api/Client';

import { requestUserToken, updateUserToken } from './modules/user/actions';

export interface ThunkExtra {
    api: API;
}

export type Thunk<TResponse = void> = _ThunkAction<Promise<TResponse>, RootState, ThunkExtra>;
export type ThunkAction<TRequest, TResponse = void> = (args?: TRequest) => Thunk<TResponse>;

export interface RootState {
    sheriffs: SheriffModuleState;
    assignments: AssignmentModuleState;
    assignmentSchedule: AssignmentScheduleState;
    dutyRoster: DutyRosterState;
    shifts: ShiftModuleState;
    schedule: ScheduleState;
    user: CurrentUserState;
    leaves: LeaveModuleState;
    users: UsersModuleState;
    roles: RoleModuleState;
    system: SystemModuleState;
}

const reducers = {
    dutyRoster: dutyRosterReducer,
    assignmentSchedule: assignmentScheduleReducer,
    schedule: scheduleReducer,
    modal: modalReducer,
    form: formReducer
};

registerSheriffReducer(reducers);
registerShiftReducer(reducers);
registerAssignmentReducer(reducers);

registerCurrentUserReducer(reducers);
registerUsersReducer(reducers);
registerRolesReducer(reducers);

registerLeavesReducer(reducers);
registerSystemReducer(reducers);

const rootReducer = combineReducers(reducers);

let thisWindow: any = window;

const composeEnhancers = thisWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(
    applyMiddleware(
        thunk.withExtraArgument({ api })
    )
);

const store = createStore(rootReducer, enhancers);

// Wire up the Token change event to the store
(api as Client).onTokenChanged.on(t => {
    store.dispatch(updateUserToken(t));
});
// Request the initial token
store.dispatch(requestUserToken());

export default store;
