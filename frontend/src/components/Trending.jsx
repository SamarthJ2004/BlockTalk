import React, { useEffect, useState } from 'react';
import EtherFunc from '../logic';
import './css/Trending.css'

const TrendingTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTweets = async () => {
      try {
        const trendingTweets = await EtherFunc({ func: 'trending' });
        setTweets(trendingTweets);
      } catch (error) {
        console.error("Error fetching trending tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTweets();
  }, []);

  if (loading) {
    return <div className="trending-tweets-container">Loading...</div>;
  }

  return (
    <div className="trending-tweets-container">
      <h2>Trending Tweets</h2>
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <div key={tweet.id} className="tweet-card">
            <h2>{tweet.title}</h2>
            <p><strong>By:</strong> {tweet.username}</p>
            <p>{tweet.tweetText}</p>
            <div className="tweet-meta">
              <p>Upvotes: {tweet.upvote}</p>
              <p>Downvotes: {tweet.downvote}</p>
              <p>Reward: {tweet.reward} Tokens</p>
            </div>
          </div>
        ))
      ) : (
        <p className="no-tweets">No trending tweets at the moment.</p>
      )}
    </div>
  );
};

export default TrendingTweets;