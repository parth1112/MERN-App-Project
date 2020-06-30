import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

import axios from '../../../axios';
import Button from '../../../components/UI/Button/Button';
import Navbar from '../../../components/Navigation/Navbar/Navbar';
import Card from '../../../components/UI/Card/Card'
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './Users.module.css';

const Users = props => {
   
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

     useEffect(() => {
    const fetchData = async () => {
             try {
                 setIsLoading(true);
                 const response = await axios.get('/api/users');
                 const users = response.data.data.users;
                 setUsers(users);
                 setIsLoading(false);
 
             } catch(err) {
                swal("Something Went Wrong", `${err.response.data.message}`, "error")
                   .then(() => {
                    setIsLoading(false);
                   });
             }
         }
         fetchData();
   }, []);

   const blackListHandler = (userId) => {
    const blacklist = async () => {
        try {
            setLoading(true);
           const res = await axios.patch(`/api/users/${userId}`, { blackList: true });
             if(res.data.status === 'success') {
             swal('User blackListed Successfully', "", "success")
             .then(() => {
               setLoading(false);
            });
          }
           
         } catch(err) {
            swal("Something Went Wrong", `${err.response.data.message}`, "error")
            .then(() => {
                setLoading(false);
            });
        }
    }
    blacklist();
   };

    const Users = users.map(user => (
        <Card style={{ marginBottom: '1rem', width: '350px', height:'75px' }} key={user._id}>
            <div>
                { !loading ? 
                <h2>
                    {user.userName + "   "}
                    {!user.blackList ? 
                    <Button btnType={'BlackList'} clicked={() => blackListHandler(user._id)}>BlackList</Button> :
                    <h4>BlackListed</h4>
                    }
                </h2> : 
                <Spinner />
                }
            </div>
         </Card>
    )) 

    
   return (
    <div className={classes.Users}>
        <Navbar />
      { isLoading ? <Spinner /> : Users }
    </div>
   );
};

export default Users ;
