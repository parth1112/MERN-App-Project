import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    role: null,
    loading: false,
};

const authStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const authSuccess = (state, action) => {
  return updateObject(state, { 
      role: action.role,
      loading: false,
});
};

const authFail = (state, action) => {
    return updateObject(state, { 
        loading: false,
        role: null
    });
};

const authLogoutSuccess = (state, action) => {
      return updateObject(state, {
          role: null,
    });
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
  case actionTypes.AUTH_START:  return authStart(state, action);
  case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
  case actionTypes.AUTH_FAIL: return authFail(state, action);
  case actionTypes.AUTH_LOGOUT_SUCCESS: return authLogoutSuccess(state, action);
  default: return state;
}
};

export default reducer;