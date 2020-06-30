import React, { useState, useEffect }from 'react';

import Navbar from '../../components/Navigation/Navbar/Navbar';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import Logout from '../Auth/Logout/Logout';
import classes  from './Profile.module.css';
import axios from '../../axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import swal from 'sweetalert';

const Profile = props => {

  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const fetchData = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get('/api/users/profile');
        setUserName(response.data.data.user.userName);
        setIsLoading(false);

    } catch(err) {
        swal("Something Went Wrong", `${err.response.data.message}`, "error")
          .then(() => {
            setIsLoading(false);
          });
    }
};

   useEffect( () => { fetchData(userName) }, [ userName ] );

  
   const deleteHandler = () => {
    const deleteUser = async () => {
        try {
          const res = await axios.delete('/api/users/profile/deleteMe');
          if(res.status === 204) {
            swal('User Deactivated Successfully', "", "success")
              .then(() => {
                setDeleted(true);
              });
            } 
          } catch(err) {
            swal("Something Went Wrong", `${err.response.data.message}`, "error")
              .then(() => {
                setDeleted(false);
             });
        }
    }
    deleteUser();
   };

       let logout = null;
         if(deleted) {
           logout = <Logout />;
         }

   const data = (
            <Card style={{ marginBottom: '2rem', width: '300px', height: '150px'}}>
              <div>
                  <h1>WELCOME</h1>
                    <h2>{userName.toUpperCase()}</h2>
              </div>
            </Card>
          );

   return (
             <div className={classes.Profile}>
                    <Navbar />                     
                      {logout}
           { isLoading ? <Spinner /> : data }
                          <hr />
                     <Button btnType={'BlackList'} clicked={deleteHandler}>Deactivate Account</Button>
             </div>
             
        );
    
}

export default Profile;