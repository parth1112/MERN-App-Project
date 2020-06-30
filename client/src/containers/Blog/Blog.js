import React, { useState, useEffect }  from 'react';
import axios from '../../axios';


import Posts from './Posts/Posts';
import NewPost from './NewPost/NewPost';
import Spinner from '../../components/UI/Spinner/Spinner';
import swal from 'sweetalert';

const Blog = props => {

   const [posts, setPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
   const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/posts');
                const posts = response.data.data.posts;
                setPosts(posts);
                setIsLoading(false);

            } catch(err) {
               swal("Something Went Wrong", `${err.response.data.message}`, "error");
            }
        }
        fetchData();
  }, []);
   
  const addPostHandler = async (discription) => {
          try {
          
           const res = await axios.post('/api/posts', { discription });
           setPosts( prevPosts => {
               return prevPosts.concat({
                   ...res.data.data.post
               });
           });
     }  catch(err) {
        swal("Something Went Wrong", `${err.response.data.message}`, "error");
          }
         
   };

   const signInHandler = () => props.history.push('/signin');
   const signUpHandler = () => props.history.push('/signup');

   return (
           <React.Fragment>
          <NewPost onAddPost={addPostHandler} onsignIn={signInHandler} onsignUp={signUpHandler}/>
                { isLoading && <Spinner /> }
                { !isLoading &&  <Posts items={posts}/> }
           </React.Fragment>
             
        );
    
}

export default Blog;