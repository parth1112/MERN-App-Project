import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import './Post.css';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';
import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import swal from 'sweetalert';

const Post = React.memo((props) =>  {

   const role = useSelector(state => {
      return state.auth.role;
   });
   

   const [loading, setLoading] = useState(false);
   const [upVote, setUpVote] = useState(props.upVotes);
   const [downVote, setDownVote] = useState(props.downVotes);
   const [upVoted, setUpVoted] = useState(false);
   const [downVoted, setDownVoted] = useState(false);

   const deleteHandler = (postId) => {
      const deletePost = async () => {
         try {
           const response = await axios.delete(`/api/posts/${postId}`);
           if(response.status === 204)  swal('Post deleted successfully', "", "success")
         } catch(err) {
            swal("Something Went Wrong", `${err.response.data.message}`, "error")
            }
      }
      deletePost();
   };

   const blackListHandler = (postId) => {
      const blacklist = async () => {
         try {
            setLoading(true);
         const res = await axios.patch(`/api/posts/${postId}`, { blackList: true });
         if(res.data.status === 'success') {
            swal('Post blackListed Successfully', "", "success")
            .then(() => {
               setLoading(false);
             })
          }
         } catch(err) {
               swal("Something Went Wrong", `${err.response.data.message}`, "error")
               .then(() => {
                  setLoading(false);
               })
         }
      }
      blacklist();
   };

   const checkVotes = (postId) => {
      const checkPost = async () => {
         try {
           const res = await axios.get(`/api/reviews/${postId}`);
           if(res.data.data.review) {
              if(res.data.data.review.upVotes === 1) setUpVoted(true);
              else if(res.data.data.review.downVotes === 1) setDownVoted(true);
           } else {
            setUpVoted(false);
            setDownVoted(false);
           } 
         } catch(err) {
            swal("Something Went Wrong", `${err.response.data.message}`, "error")
            }
      }
      checkPost();
   }

   const upVotesHandler = (postId) => {
      const upVotePost = async () => {

             if(!upVoted && !downVoted) {
               try {
                  await axios.post(`/api/reviews/${postId}`, { upVotes: true } );
                  setUpVote(prevState => prevState + 1);
                  setUpVoted(true);
               } catch(err) {
                  swal("Something Went Wrong", `${err.response.data.message}`, "error")
                     .then(() => {
                        setUpVoted(false);
                     })
               }

            } else if(upVoted && !downVoted) {
               try {
                  await axios.delete(`/api/reviews/${postId}`);
                  setUpVote(prevState => prevState - 1);
                  setUpVoted(false);
               } catch(err) {
                  swal("Something Went Wrong", `${err.response.data.message}`, "error")
                  .then(() => { 
                     setUpVoted(true);
                  })
               }

            } else if(!upVoted && downVoted) {
               try {
                  await axios.patch(`/api/reviews/${postId}`, { upVotes: true } );
                  setUpVote(prevState => prevState + 1);
                  setUpVoted(true);
                  setDownVote(prevState => prevState - 1);
                  setDownVoted(false);
               } catch(err) {
                  swal("Something Went Wrong", `${err.response.data.message}`, "error")
                        .then(() => {
                           setUpVoted(false);
                           setDownVoted(true);
                        })
               }

            }
        }
      upVotePost();
   };

   const downVotesHandler = (postId) => {
      const downVotePost = async () => {

         if(!upVoted && !downVoted) {
            try {
               await axios.post(`/api/reviews/${postId}`, { downVotes: true } );
               setDownVote(prevState => prevState + 1);
               setDownVoted(true);
            } catch(err) {
               swal("Something Went Wrong", `${err.response.data.message}`, "error")
                        .then(() => { 
                           setDownVoted(false);
                        })
            }

         } else if(!upVoted && downVoted) {
            try {
               await axios.delete(`/api/reviews/${postId}`);
               setDownVote(prevState => prevState - 1);
               setDownVoted(false);
            } catch(err) {
               swal("Something Went Wrong", `${err.response.data.message}`, "error")
                        .then(() => { 
                           setDownVoted(true);
                        })
            }

         } else if(upVoted && !downVoted) {
            try {
               await axios.patch(`/api/reviews/${postId}`, { downVotes: true } );
               setUpVote(prevState => prevState - 1);
               setUpVoted(false);
               setDownVote(prevState => prevState + 1);
               setDownVoted(true);
            } catch(err) {
               swal("Something Went Wrong", `${err.response.data.message}`, "error")
                        .then(() => { 
                           setUpVoted(true);
                           setDownVoted(false);
                        })
            }

         }

      }
      downVotePost();
   };

      let card;

                if (!role) {
               card = (
            <Card style={{ marginBottom: '2rem'}}>
               <div className="post">
                  <h2>{'@ ' + props.userName}</h2>
                     <p>{props.discription}</p>
                     <br /><br /><hr />
                   <p>{props.upVotes}: upVotes | {props.downVotes}: downVotes</p>
               </div>
            </Card>
            );
         } else if (role === 'admin') {
            card = (<Card style={{ marginBottom: '2rem'}}>
                     {
                        !loading ?
                        <div className="post">
                           <h2>{'@ ' + props.userName}</h2>
                              <p>{props.discription}</p>
                              <br /><br /><hr />
                              <p>{props.upVotes}: upVotes | {props.downVotes}: downVotes</p>
                              { !props.blackList && <Button btnType={'BlackList'} clicked={() => blackListHandler(props.postId)}>BlackList</Button> }
                              { props.myPosts && <Button btnType={'BlackList'} clicked={() => deleteHandler(props.postId)}>DELETE</Button> } 
                         </div>   :  
                        <Spinner />        
                     }
                   </Card>);
         } else if (role === 'user') {

            checkVotes(props.postId);

            card = (
         <Card style={{ marginBottom: '2rem'}}>
            <div className="post">
               <h2>{'@ ' + props.userName}</h2>
                  <p>{props.discription}</p>
                   <br /><br /><hr />
                   { !props.myPosts && <p>{upVote}: <Button 
                   btnType={ upVoted ? 'Done' : 'Safe' } 
                   clicked={() => upVotesHandler(props.postId)}>upVotes</Button> | {downVote}: <Button 
                   btnType={ downVoted ? 'Done' : 'Danger' } 
                   clicked={() => downVotesHandler(props.postId)}>downVotes</Button></p> 
                   } 
                   { props.myPosts && <p>{props.upVotes}: upVotes | {props.downVotes}: downVotes</p> } 
                   { props.myPosts && <Button btnType={'BlackList'} clicked={() => deleteHandler(props.postId)}>DELETE</Button> } 
            </div>
         </Card>
               );
         } 
 
             return card;
});
 
export default  Post; 