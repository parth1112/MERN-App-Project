import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './NewPost.css';

const NewPost = props => {
     let [discription, setDiscription] = useState('');

     const role = useSelector(state => {
        return state.auth.role;
     });
 
      const submitPostHandler = event => {
         event.preventDefault();
         props.onAddPost(discription);
         setDiscription('');
     }

       return (
            <div className="NewPost">
                <h1>Add a Post</h1>
                <form>
                    <textarea rows="6" column="6" value={discription} onChange={(event) => setDiscription(event.target.value)} />
                    { role && <button onClick={submitPostHandler}>Add Post</button> }
       {  !role && <p><button onClick={props.onsignIn}>signIn To Post</button> OR  <button onClick={props.onsignUp}>signUp To Post</button></p> }  
               </form>
            </div>
        );
    
}

export default NewPost;