import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import GetTweets from '../getTweets';
import './css/Profile.css';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import EtherFunc from '../logic';
import "../App.css";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [profile, setProfile] = useState({});

  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        console.log("Current Account:", accounts[0]);
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const getUser = async () => {
    if (!currentAccount) return;

    try {
      const userDetails = await EtherFunc({ func: 'getUser', id: currentAccount, message: "We got the user" });

      if (userDetails) {
        const profileDetails = {
          username: currentAccount,
          tweetsCount: post.length,
          tokenCount: parseInt(userDetails[1]._hex, 16),
          nftCount: userDetails[2].length,
        };
        setProfile(profileDetails);
      }
    } catch (error) {
      console.error('User not found or error fetching user:', error);
      setProfile({ username: currentAccount, tweetsCount: 0, tokenCount: 0, nftCount: 0 });
    }
  };

  const setTweets = async () => {
    try {
      const tweets = await GetTweets();
      const personalTweets = tweets.filter(tweet => tweet.personal);
      setPost(personalTweets);
      console.log("Setting Tweets...");
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      setTweets();
    };
  }, [currentAccount]);

  useEffect(() => {
    if (currentAccount) {
      getUser();
    };
  }, [currentAccount, post]);

  return (
    <div className="app">
      <Sidebar />
      <div className="profile-page">
        <div className="profile-banner">
          <img src="https://via.placeholder.com/150" alt="Profile" className='profile-pic' />
        </div>
        <div className="profile-info">
          <div className="profile-details">
            <p>{profile.username}</p>
            <div className="profile-stats">
              <span><strong>{profile.tweetsCount}</strong> Tweets</span>
              <span><strong>{profile.tokenCount}</strong> Tokens</span>
              <span><strong>{profile.nftCount}</strong> NFTs</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tab">Your Tweets</div>

          <div className="profile-tweets">
            {post.length === 0 ? (
              <p>Loading tweets...</p>
            ) : (
              post.map((post) => (
                <Tweet
                  key={post.id}
                  id={post.id}
                  displayName={post.username}
                  title={post.tweetTitle}
                  text={post.tweetText}
                  time={post.time}
                  personal={post.personal}
                  upvote={post.upvote}
                  downvote={post.downvote}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

export default Profile;