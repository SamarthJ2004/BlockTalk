import { useEffect, useState } from 'react';
import './css/MainContent.css';
import Post from './Post';
import Tweet from './Tweet';
import GetTweets from '../getTweets';

function MainContent() {
  const [post, setPost] = useState([]);

	useEffect(() => {
		const fetchTweets = async () => {
			try {
				const fetchedTweets = await GetTweets();
				if (fetchedTweets) {
					setPost(fetchedTweets);
				}
			} catch (error) {
				console.error("Error fetching tweets:", error);
			}
		};

		fetchTweets();
	}, []);

  return (
    <div className="main-content feed">
      <Post />
      {post.length === 0 ? (
        <p>Loading tweets...</p>
      ) : (
        post.map((post) => (
          <Tweet
            key={post.id}
            id={post.id}
            displayName={post.username}
            title={post.tweetTitle}
            ipfsHash={post.ipfsHash}
            time={post.time}
            personal={post.personal}
            upvote={post.upvote}
            downvote={post.downvote}
          />
        ))
      )}
    </div>
  );
}

export default MainContent;
