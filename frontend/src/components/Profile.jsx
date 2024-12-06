import { useEffect, useState, useCallback, useRef } from 'react';
import Tweet from './Tweet';
import GetTweets from '../getTweets';
import './css/Profile.css';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import EtherFunc from '../logic';
import { uploadProfilePicture} from '../pinataUtil';
import "../App.css";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Profile = () => {
  const [post, setPost] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [profile, setProfile] = useState({});
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const getUser = useCallback(async () => {
    if (!currentAccount) return;
    try {
      const userDetails = await EtherFunc({ 
        func: 'getUser', 
        id: currentAccount, 
        message: "We got the user" 
      });
      if (userDetails) {
        const profileDetails = {
          username: currentAccount,
          tweetsCount: post.length,
          tokenCount: parseInt(userDetails[1]._hex, 16),
          nftCount: userDetails[2].length,
          profileIpfsHash: userDetails.profileIpfsHash,
        };
        setProfile(profileDetails);
				console.log(profileDetails);
        
        // Fetch profile picture if hash exists
        if (userDetails.profileIpfsHash) {
          try {
            const imageUrl = `https://gateway.pinata.cloud/ipfs/${userDetails.profileIpfsHash}`;
            setProfilePicture(imageUrl);
          } catch (error) {
            console.error('Error fetching profile picture:', error);
          }
        }
      }
    } catch (error) {
      console.error('User not found or error fetching user:', error);
      setProfile({ 
        username: currentAccount, 
        tweetsCount: 0, 
        tokenCount: 0, 
        nftCount: 0 
      });
    }
  }, [currentAccount, post]);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to Pinata
      const ipfsHash = await uploadProfilePicture(file);
      
      // Update profile picture hash in smart contract
      await EtherFunc({
        func: 'updateProfilePicture',
        id: ipfsHash,
        message: "Profile picture updated"
      });

      // Update UI
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setProfilePicture(imageUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
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
    }
  }, [currentAccount]);

  useEffect(() => {
    if (currentAccount) {
      getUser();
    }
  }, [currentAccount, getUser]);

  return (
    <div className="app">
      <Sidebar />
      <div className="profile-page">
        <div className="profile-banner">
          <div className="profile-picture-container">
            <img 
              src={profilePicture} 
              alt="Profile" 
              className={`profile-pic ${isUploading ? 'uploading' : ''}`}
              onClick={handleProfilePictureClick}
						/>
						<div className="profile-pic-overlay" onClick={handleProfilePictureClick}>
							<CameraAltIcon />
							<span>Update Photo</span>
						</div>
            {isUploading && <div className="upload-overlay">Uploading...</div>}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
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
                  ipfsHash={post.ipfsHash}
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
