import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/helper';

const CommentForm = ({ imageId ,onCommentSubmit}) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (comment.trim().length > 20) {
          alert("Comment length must be less than or equal to 20 characters.");
          return;
    }
    try{
      const authToken = getToken();
       const headers = { Authorization: `Bearer ${authToken}` };
        const response = await axios.post(`http://localhost:4000/${imageId}/comment`, { comment },{headers})
        console.log("comment",response.data)
        onCommentSubmit();
        setComment('');
    }
    catch(error){
        console.error(error)
    } 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={handleCommentChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
