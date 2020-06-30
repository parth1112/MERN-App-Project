import React, { useState }from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from '../Auth.module.css';
import { createField, createForm } from '../../../shared/utility';
import * as  actions from '../../../store/actions/index';
import swal from 'sweetalert';

const SignIn = props => {

    const [fetching, setFetching] = useState(false);
    const [verify, setVerify] = useState(false);
    const [checking, setChecking] = useState(false);
    const [changed, setChanged] = useState(false);
 
    const dispatch = useDispatch();

    const loading = useSelector(state => {
       return state.auth.loading;
    });

     const role = useSelector(state => {
        return state.auth.role;
     });

    const onAuth = (email, password) => dispatch(actions.signIn(email, password));
    
    const onForgot = async (email) => {
        try {      
         setFetching(true);
       const res = await axios.post('/api/users/forgotPassword', { email });
       if(res.data.status === 'success') {
            swal(`${res.data.message}`, "", "success")
            .then(() => {
                setFetching(false);
                setVerify(true);
             })
          }
         
      }  catch(err) {
        swal("Something Went Wrong", `${err.response.data.message}`, "error")
        .then(() => {
            setVerify(false);
            setFetching(false);
        })
      }
   };

    const onReset = async (token, password, passwordConfirm) => {
        try {     
        setChecking(true);
        const response = await axios.patch('/api/users/resetPassword', { token, password, passwordConfirm });
        if(response.data.status === 'success') {
            swal(`${response.data.message}`, "", "success")
            .then(() => {
                setChecking(false);
                setChanged(true);
             })
          }
      }  catch(err) {
        swal("Something Went Wrong", `${err.response.data.message}`, "error")
        .then(() => {
            setChecking(false);
            setChanged(false);
        })
      } 
 };


    const [signInForm, setSignInForm] = useState({
        email: createField('input', 'email', 'Mail Address', { required: true, isEmail: true }),
        password: createField('input', 'password', 'Password', { required: true, minLength: 8 })
    });

    const [forgotpassForm, setForgotpassForm] = useState({
        email: createField('input', 'email', 'Mail Address', { required: true, isEmail: true })
    });

    const [resetPassForm, setResetPassForm] = useState({
        token: createField('input', 'text', 'Verify Token', { required: true }),
        password: createField('input', 'password', 'New Password', { required: true, minLength: 8 }),
        passwordConfirm: createField('input', 'password', 'Confirm New Password', { required: true, minLength: 8 })
    });

   

  
    const signInSubmitHandler = (event) => {
    event.preventDefault();
    onAuth(signInForm.email.value, signInForm.password.value);
   };

   const forgotpassSubmitHandler = (event) => {
      event.preventDefault();
    onForgot(forgotpassForm.email.value);
   };

   const resetPassSubmitHandler = (event) => {
    event.preventDefault();
    onReset(resetPassForm.token.value, resetPassForm.password.value, resetPassForm.passwordConfirm.value);
  };

   

    let form1 = createForm(signInForm, setSignInForm);
    let form2 = createForm(forgotpassForm, setForgotpassForm);
    let form3 = null;

        if(loading) {
            form1 = <Spinner />
        }
        if(fetching) {
            form2 = <Spinner />
        }
        if(checking) {
            form3 = <Spinner />
        }
        
        if(verify) {
            form2 = null;
            form3 = createForm(resetPassForm, setResetPassForm);
         }

         if(changed) {
             form3 = null;
             form2 = createForm(forgotpassForm, setForgotpassForm);
             forgotpassForm.email.value = '';
         }
 
        return (
           <div className={classes.Auth}>
               {role && <Redirect to="/profile"/> }
               <form onSubmit={signInSubmitHandler}>
                       {form1}
                      <Button btnType="Success" >SUBMIT</Button>
              </form>
              <hr />
              <h4>OR</h4>
              {
              form2 ? 
              <form onSubmit={forgotpassSubmitHandler}>
                       {form2}
                      <Button btnType="Safe" >FORGOT PASSWORD</Button>
              </form> :
              <form onSubmit={resetPassSubmitHandler}>
                       {form3}
                      <Button btnType="Success" >SUBMIT AND VERIFY</Button>
              </form>
              }
       </div>
        );
};


export default SignIn;