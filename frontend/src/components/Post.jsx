import React, { useState } from 'react'
import './css/Post.css';
import EtherFunc from '../logic';

const Post = () => {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetTitle, setTweetTitle] = useState("");

  const sendTweet = (e) => {
    e.preventDefault();
    EtherFunc({ id: { tweetTitle, tweetMessage }, func: "addTweet", message: "The tweet was added" });
    setTweetTitle("");
    setTweetMessage("");
  };

  return (
    <div className="tweetBox">
      <form>
        <input
          value={tweetTitle}
          onChange={(e) => setTweetTitle(e.target.value)}
          className="tweetBox__title"
          placeholder="Add Your Tweet Title"
          type="text"
          required
        />
        <input
          onChange={(e) => setTweetMessage(e.target.value)}
          value={tweetMessage}
          placeholder="What's happening?"
          type="text"
          className='tweetBox__content'
          required
        />

        <button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__Button"
        >
          Tweet
        </button>

      </form>
    </div>
  )
}
export default Post;