import * as genderCodeRequests from './requests/genders';
import * as locationRequests from './requests/locations';
import NestedReducer from '../../infrastructure/NestedReducer';
import { ReducersMapObject } from 'redux';
import { STATE_KEY } from './common';
import { addReducerToMap } from '../../infrastructure/reduxUtils';

export {
  SystemModuleState,
  STATE_KEY
} from './common';

const nestedReducer = new NestedReducer([
  // Gender Codes
  genderCodeRequests.genderCodeMapRequest.reducer,

  // Locations
  locationRequests.locationMapRequest.reducer
]);

const reducer = nestedReducer.reducer;
export default reducer;

export function registerReducer(reducersMap: ReducersMapObject) {
  return addReducerToMap(reducersMap, STATE_KEY, reducer);
}