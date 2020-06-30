import React from 'react';

import Post from '../../../components/Post/Post';
import  './Posts.css';

const Posts = props => {
   
  let content;

  if(!props.items || props.items.length === 0) {
      content = (
          <div className="Posts">
              <p>Could not find any posts. Maybe create one?</p>
               { props.myPosts &&  <button onClick={props.onNewPost}>Make A Post</button> }
          </div>
      )
  } else {
      content = (
          <ul>
              { props.items.map( post => {
                return( 
                    <Post 
                    key={post._id}
                    postId={post._id}
                    upVotes={post.upVotes}
                    downVotes={post.downVotes}
                    myPosts={props.myPosts}
                    discription={post.discription}
                    userName={post.userName} 
                    blackList={post.blackList}/>
                );
            })
        }
          </ul>
      );
  }

  return content;

 
};

export default Posts;