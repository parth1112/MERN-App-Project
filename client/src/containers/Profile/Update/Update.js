import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import axios from '../../../axios';
import { createField, createForm } from '../../../shared/utility';
import Navbar from '../../../components/Navigation/Navbar/Navbar';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Logout from '../../Auth/Logout/Logout';
import classes from './Update.module.css';
import swal from 'sweetalert';

const Update = ( props ) => {

    const [loadingData, setLoadingData] = useState(false);
    const [updatedData, setUpdatedData] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [updatedPassword, setUpdatedPassword] = useState(false);

    const onUpdate = async (userName, email) => {
        try {     
             setLoadingData(true);
           const res = await axios.patch('/api/users/profile/updateMe', { userName, email });
               if(res.data.status === 'success') {
                    swal("Updated Successfully!", "", "success")
                    .then(() => {
                    setLoadingData(false);
                    setUpdatedData(true);
                    })
                 }
         }  catch(err) {
        swal("Something Went Wrong", `${err.response.data.message}`, "error")
        .then(() => {
            setLoadingData(false);
            setUpdatedData(false);
        })
    }
       
 };
 
   const onUpdatePassword = async (passwordCurrent, password, passwordConfirm) => {
    try {     
           const newPassword = {
            passwordCurrent,
            password,
            passwordConfirm
           }  
       
        setLoadingPassword(true);
       const response = await axios.patch('/api/users/profile/updateMyPassword', newPassword);
        if(response.data.status === 'success') {
            swal("Password Successfully updated!", "Please login again!", "success")
                .then(() => {
                    setLoadingPassword(false);
                    setUpdatedPassword(true);
            })
        }
        
     }  catch(err) {
     swal("Something Went Wrong", `${err.response.data.message}`, "error")
        .then(() => {
            setLoadingPassword(false);
            setUpdatedPassword(false);
        })  
      }
 };


    const [updateForm, setUpdateForm] = useState({
        userName: createField('input', 'text', 'New UserName', { minLength: 4 }),
        email: createField('input', 'email', 'New Mail Address', { isEmail: true })
    });

    const [updatePasswordForm, setUpdatePasswordForm] = useState({
        passwordCurrent: createField('input', 'password', 'Current Password', { required: true, minLength: 6 }),
        password: createField('input', 'password', 'New Password', { required: true, minLength: 6 }),
        passwordConfirm: createField('input', 'password', 'Confirm New Password', { required: true, minLength: 6 })
    });
   
   const updateSubmitHandler = (event) => {
    event.preventDefault();
    onUpdate(
        updateForm.userName.value,
         updateForm.email.value
    );
    };

    const updateSubmitPasswordHandler = (event) => {
        event.preventDefault();
        onUpdatePassword(
            updatePasswordForm.passwordCurrent.value,
             updatePasswordForm.password.value, 
             updatePasswordForm.passwordConfirm.value
        );
    };
       
    let form1 = createForm(updateForm, setUpdateForm);
    let form2 = createForm(updatePasswordForm, setUpdatePasswordForm);
  
    if(loadingData) {
        form1 = <Spinner />
    }
    if(loadingPassword) {
        form2 = <Spinner />
    }

    let logout = null;
    if(updatedPassword) {
        logout = <Logout /> ;
      }
  
    return  (
       <div className={classes.Update}>
                 <Navbar />
             { updatedData && <Redirect to="profile" /> }
                     {logout}
             <form onSubmit={updateSubmitHandler}>
                       {form1}
                <Button btnType="Success" >SUBMIT</Button>
             </form>
             <form onSubmit={updateSubmitPasswordHandler}>
                       {form2}
                <Button btnType="Success" >SUBMIT</Button>
             </form>
       </div>
    );
};

export default Update;

