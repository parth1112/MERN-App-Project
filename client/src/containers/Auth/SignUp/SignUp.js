import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from '../Auth.module.css';
import { createField, createForm } from '../../../shared/utility';
import * as  actions from '../../../store/actions/index';

const SignUP = props => {
    
    const [verifing, setVerifing] = useState(false);
    const [verified, setVerified] = useState(false);

    const dispatch = useDispatch();

    const loading = useSelector(state => {
       return state.auth.loading;
    });

    const role = useSelector(state => {
        return state.auth.role;
     });

    const onAuth = (token) => dispatch(actions.signUp(token));

    const onSignUp = async (userName, email, password, passwordConfirm) => {
           try {
            setVerifing(true);
            const res =  await axios.post('/api/users/signup', { userName, email, password, passwordConfirm });

            if(res.data.status === 'success') {
              swal(`${res.data.message}`, "Please use that token for activate your account", "success")
              .then(() => {
                  setVerifing(false);
                  setVerified(true);
               })
            }
           } catch (err) {
            swal("Something Went Wrong", `${err.response.data.message}`, "error")
                .then(() => {
                    setVerifing(false);
                    setVerified(false);
                })
           }
 }; 


    const [signUpForm, setSignUpForm] = useState({
        userName: createField('input', 'text', 'UserName', { required: true, minLength: 4}),
        email: createField('input', 'email', 'Mail Address', { required: true, isEmail: true }),
        password: createField('input', 'password', 'Password', { required: true, minLength: 8 }),
        passwordConfirm: createField('input', 'password', 'Confirm Password', { required: true, minLength: 8 })
    });

    const [verificationForm, setVerificaionForm] = useState({
        token: createField('input', 'text', 'Verify Token', { required: true }),
    });

   
   const submitHandler = (event) => {
    event.preventDefault();
    onSignUp(signUpForm.userName.value, signUpForm.email.value, signUpForm.password.value, signUpForm.passwordConfirm.value);
   };

   const verifyHandler = (event) => {
    event.preventDefault();
    onAuth(verificationForm.token.value);
   };


     let form1 = createForm(signUpForm, setSignUpForm);
     let form2 = null;

        if(verifing) {
            form1 = <Spinner />
        }
        if(loading) {
            form2 = <Spinner />
        }

        if(verified) {
            form1 = null;
            form2 = createForm(verificationForm, setVerificaionForm);
        }

        return (
           <div className={classes.Auth}>
               {role && <Redirect to="/profile"/> }
               {
                  !form2 ?
               <form onSubmit={submitHandler}>
                       {form1}
                      <Button btnType="Success" >SUBMIT</Button>
               </form>   :
               <form onSubmit={verifyHandler}>
                        {form2}
              <Button btnType="Success" >SUBMIT AND VERIFY</Button>
              </form>  
               }
           </div>
        );
};


export default SignUP;