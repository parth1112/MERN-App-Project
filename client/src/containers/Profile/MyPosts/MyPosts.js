import React, { useState, useEffect } from 'react';

import axios from '../../../axios';
import Navbar from '../../../components/Navigation/Navbar/Navbar';
import classes from './MyPosts.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Posts from '../../Blog/Posts/Posts';
import swal from 'sweetalert';

const MyPosts = ( props ) => {
 
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
 
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/users/profile/myPosts');
            const posts = response.data.data.posts;
            setPosts(posts);
            setIsLoading(false);

        } catch(err) {
           swal("Something Went Wrong", `${err.response.data.message}`, "error");
        }
    }

     useEffect(() => {
      fetchData();
   }, []);
    
 const newPostHandler = () => props.history.push('/');

    return  (   
    <div className={classes.MyPosts}>
         <Navbar />
         { isLoading && <Spinner /> }
         { !isLoading &&  <Posts items={posts} myPosts={true} onNewPost={newPostHandler}/> }
   </div>
       
    );
};

export default MyPosts;