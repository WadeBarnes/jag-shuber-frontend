import * as assignmentRequests from './requests/assignments';
import * as assignmentDutyRequests from './requests/assignmentDuties';
import * as alternateAssignmentTypeRequests from './requests/alternateAssignmentTypes';
import * as courtRoleRequests from './requests/courtRoles';
import * as courtroomRequests from './requests/courtrooms';
import * as jailRoleRequests from './requests/jailRoles';
import * as runRequests from './requests/runs';

import { ReducersMapObject } from 'redux';
import NestedReducer from '../../infrastructure/NestedReducer';
import { addReducerToMap } from '../../infrastructure/reduxUtils';
import {
  AssignmentModuleState,
  STATE_KEY
} from './common';
import {
  IActionType,
  IActionPayload,
  IAction
} from './actions';

export {
  AssignmentModuleState,
  STATE_KEY
} from './common';

export type ReducerResponse<State> = State;
export type ReducerCases<State> = {
  [T in IActionType]: (
    state: State,
    payload: IActionPayload<T>
  ) => State;
};

export function createReducer<State>(
  cases: Partial<ReducerCases<State>>
) {
  return function (state: State, action: IAction): ReducerResponse<State> {
    const fn = cases[action.type];
    if (fn) { // the "as any" part is a bit of a shame but ignore it
      return (fn as any)(state, action.payload, action);
    } else {
      return state || {} as State;
    }
  };
}

const actionReducer = createReducer<AssignmentModuleState>({
  ADMIN_COURTROOMS_SELECT_SECTION: (state, sectionName) => {
    return { ...state, selectedProfileSection: sectionName };
  },
  ADMIN_COURTROOMS_SET_PLUGIN_SUBMIT_ERRORS: (state, pluginErrors) => {
    return { ...state, pluginSubmitErrors: pluginErrors };
  },
  ADMIN_COURTROOMS_SET_PLUGIN_FILTERS: (state, filters) => {
    return { ...state, pluginFilters: filters };
  },
  ADMIN_COURT_ROLES_SELECT_SECTION: (state, sectionName) => {
    return { ...state, selectedProfileSection: sectionName };
  },
  ADMIN_COURT_ROLES_SET_PLUGIN_SUBMIT_ERRORS: (state, pluginErrors) => {
    return { ...state, pluginSubmitErrors: pluginErrors };
  },
  ADMIN_COURT_ROLES_SET_PLUGIN_FILTERS: (state, filters) => {
    return { ...state, pluginFilters: filters };
  },
  ADMIN_JAIL_ROLES_SELECT_SECTION: (state, sectionName) => {
    return { ...state, selectedProfileSection: sectionName };
  },
  ADMIN_JAIL_ROLES_SET_PLUGIN_SUBMIT_ERRORS: (state, pluginErrors) => {
    return { ...state, pluginSubmitErrors: pluginErrors };
  },
  ADMIN_JAIL_ROLES_SET_PLUGIN_FILTERS: (state, filters) => {
    return { ...state, pluginFilters: filters };
  },
  ADMIN_ESCORT_TYPES_SELECT_SECTION: (state, sectionName) => {
    return { ...state, selectedProfileSection: sectionName };
  },
  ADMIN_ESCORT_TYPES_SET_PLUGIN_SUBMIT_ERRORS: (state, pluginErrors) => {
    return { ...state, pluginSubmitErrors: pluginErrors };
  },
  ADMIN_ESCORT_TYPES_SET_PLUGIN_FILTERS: (state, filters) => {
    return { ...state, pluginFilters: filters };
  },
  ADMIN_OTHER_TYPES_SELECT_SECTION: (state, sectionName) => {
    return { ...state, selectedProfileSection: sectionName };
  },
  ADMIN_OTHER_TYPES_SET_PLUGIN_SUBMIT_ERRORS: (state, pluginErrors) => {
    return { ...state, pluginSubmitErrors: pluginErrors };
  },
  ADMIN_OTHER_TYPES_SET_PLUGIN_FILTERS: (state, filters) => {
    return { ...state, pluginFilters: filters };
  }
});

const nestedReducer = new NestedReducer([
  // Assignments
  assignmentRequests.assignmentMapRequest.reducer,
  assignmentRequests.createAssignmentRequest.reducer,
  assignmentRequests.updateAssignmentRequest.reducer,
  assignmentRequests.deleteAssignmentRequest.reducer,
  assignmentRequests.deleteAssignmentDutyRecurrenceRequest.reducer,
  // Assignment Types - Alternate
  alternateAssignmentTypeRequests.alternateAssignmentTypeMapRequest.reducer,
  alternateAssignmentTypeRequests.createOrUpdateAlternateAssignmentTypesRequest.reducer,
  alternateAssignmentTypeRequests.deleteAlternateAssignmentTypesRequest.reducer,
  // Assignment Types - Court Roles
  courtRoleRequests.courtRoleMapRequest.reducer,
  courtRoleRequests.createOrUpdateCourtRolesRequest.reducer,
  courtRoleRequests.deleteCourtRolesRequest.reducer,
  // Assignment Types - Courtrooms
  courtroomRequests.courtroomMapRequest.reducer,
  courtroomRequests.createOrUpdateCourtroomsRequest.reducer,
  courtroomRequests.deleteCourtroomsRequest.reducer,
  // Assignment Types - Jail Roles
  jailRoleRequests.jailRoleMapRequest.reducer,
  jailRoleRequests.createOrUpdateJailRolesRequest.reducer,
  jailRoleRequests.deleteJailRolesRequest.reducer,
  // Assignment Types - Escort Runs
  runRequests.runMapRequest.reducer,
  // TODO: Make sure these don't operate on the escort run...
  runRequests.createOrUpdateEscortRunsRequest.reducer,
  runRequests.deleteEscortRunsRequest.reducer,
  // Assignment Duties
  assignmentDutyRequests.assignmentDutyMapRequest.reducer,
  assignmentDutyRequests.createAssignmentDutyRequest.reducer,
  assignmentDutyRequests.updateAssignmentDutyRequest.reducer,
  assignmentDutyRequests.deleteAssignmentDutyRequest.reducer,
  assignmentDutyRequests.createDefaultDutiesRequest.reducer,
  // Sheriff Duties
  assignmentDutyRequests.deleteSheriffDutyRequest.reducer,
  assignmentDutyRequests.reassignSheriffDutyRequest.reducer,
  assignmentDutyRequests.autoAssignSheriffDutiesRequest.reducer,
  // Actions
  actionReducer
]);

const reducer = nestedReducer.reducer;
export default reducer;

export function registerReducer(reducersMap: ReducersMapObject) {
  return addReducerToMap(reducersMap, STATE_KEY, reducer);
}
