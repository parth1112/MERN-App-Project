import * as actionTypes from './actionTypes';
import axios from 'axios';
import swal from 'sweetalert';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (role) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        role
    };
};

export const authFail = () => {
    return {
        type: actionTypes.AUTH_FAIL
    };
};

export const logoutSuccess = () => {
   return {
        type: actionTypes.AUTH_LOGOUT_SUCCESS
    };
};

export const logout = () => {
     return dispatch => {
  
          axios.get('/api/users/logout')
            .then(() => {
                dispatch(logoutSuccess());
                window.location.reload(false);
             }) 
            .catch(err => {
                  swal("Something Went Wrong", `${err.response.data.message}`, "error")
             });
     };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
          setTimeout(() => {
             dispatch(logout());
          },expirationTime * 1000);
    };
 };
 
 export const signIn = (email, password) => {
    return dispatch => {
        dispatch(authStart());
         
        const authData = {
          email,
          password
        };
        const url = '/api/users/login';

        axios.post(url, authData)
          .then(response => {
          dispatch(authSuccess(response.data.data.role));
          dispatch(checkAuthTimeout(3600));
         })
      .catch(err => {
          swal("Something Went Wrong", `${err.response.data.message}`, "error")
          .then(() => {
            dispatch(authFail());
          })
      })
    };
};    

export const signUp = (token) => {
    return dispatch => {
        dispatch(authStart());
        
       const url = '/api/users/verifyEmail'; 

        axios.patch(url, { token } )
          .then(response => {
         dispatch(authSuccess(response.data.data.role));
          dispatch(checkAuthTimeout(3600));
        })
      .catch(err => {
        swal("Something Went Wrong", `${err.response.data.message}`, "error")
        .then(() => {
          dispatch(authFail());
        })
      })
    };
};

export const authCheckState = () => {
     return dispatch => {
     axios.get('/api/users/isLoggedIn', { withCredentials: true } )
     .then(response => {
         if(response.data.status === 'success') {
           dispatch(authSuccess(response.data.data.role));
          }
        })
     .catch(() => {})
  }
}