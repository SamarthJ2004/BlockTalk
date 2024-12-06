import './css/Tweet.css';
import { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EtherFunc from '../logic';
import BookmarkButton from './BookmarkButton';
import { getFromPinata } from '../pinataUtil';

const Tweet = forwardRef(
  ({ id, displayName, title, ipfsHash, time, personal, upvote, downvote }, ref) => {
    const [expandedImage, setExpandedImage] = useState(null);
    const [tweetContent, setTweetContent] = useState(null);
    const [loading, setLoading] = useState(true);
    // Add loading states for each action
    const [actionLoading, setActionLoading] = useState({
      upvote: false,
      downvote: false,
      delete: false
    });

    useEffect(() => {
      const fetchIPFSContent = async () => {
        try {
          const content = await getFromPinata(ipfsHash);
          setTweetContent(content);
        } catch (error) {
          console.error('Error fetching IPFS content:', error);
        } finally {
          setLoading(false);
        }
      };

      if (ipfsHash) {
        fetchIPFSContent();
      }
    }, [ipfsHash]);

    const getTimeDifference = (blockTimestamp) => {
      const currentTime = Math.floor(Date.now() / 1000);
      const differenceInSeconds = currentTime - blockTimestamp;
      const secondsInDay = 60 * 60 * 24;
      const secondsInHour = 60 * 60;
      const days = Math.floor(differenceInSeconds / secondsInDay);
      const hours = Math.floor((differenceInSeconds % secondsInDay) / secondsInHour);
      return { days, hours };
    };

    const { days, hours } = getTimeDifference(time);

    const handleImageClick = (image) => {
      setExpandedImage("https://gateway.pinata.cloud/ipfs/"+image);
    };

    const getImageGridClass = () => {
      if (!tweetContent?.images) return '';
      
      switch (tweetContent.images.length) {
        case 1: return 'post__images--single';
        case 2: return 'post__images--two';
        case 3: return 'post__images--three';
        case 4: return 'post__images--four';
        default: return '';
      }
    };

    const handleVote = async (type) => {
      if (actionLoading[type]) return; // Prevent multiple clicks
      
      setActionLoading(prev => ({ ...prev, [type]: true }));
      try {
        await EtherFunc({
          func: type,
          id: id,
          message: `The vote was ${type === 'upvote' ? 'increased' : 'decreased'}`
        });
      } catch (error) {
        console.error(`Error ${type}ing tweet:`, error);
      } finally {
        setActionLoading(prev => ({ ...prev, [type]: false }));
      }
    };

    const handleDelete = async () => {
      if (actionLoading.delete) return; // Prevent multiple clicks
      
      setActionLoading(prev => ({ ...prev, delete: true }));
      try {
        await EtherFunc({
          func: 'deleteTweet',
          id: id,
          message: "The tweet was deleted"
        });
      } catch (error) {
        console.error('Error deleting tweet:', error);
      } finally {
        setActionLoading(prev => ({ ...prev, delete: false }));
      }
    };

    if (loading) {
      return (
        <div className="post loading">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      );
    }

    return (
      <>
        <div className="post" ref={ref} key={id}>
          <div className="post__body">
            <h2 className="post__title">{title || "No Title"}</h2>
            <div className="post__headerText">
              <h3 className="post__displayName">
                Author: {personal ? "Your Tweet" : displayName}
              </h3>
              <span className="post__time">
                {days > 0 && `${days} day(s) `}
                {hours > 0 && `${hours} hours`}
                {(days === 0 && hours === 0) ? 'Just now' : ' ago'}
              </span>
            </div>
            
            <div className="post__headerDescription">
              {tweetContent?.content || "No Body"}
            </div>
            
            {tweetContent?.images && tweetContent.images.length > 0 && (
              <div className={`post__images ${getImageGridClass()}`}>
                {tweetContent.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="post__imageContainer"
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={"https://gateway.pinata.cloud/ipfs/"+image} 
                      alt={`Tweet image ${index + 1}`}
                      className="post__image"
                      style={{ 
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: "4px"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="post__footer">
              <BookmarkButton displayName={displayName} id={id}/>
              {personal && (
                <button 
                  className={`post__actionButton ${actionLoading.delete ? 'loading' : ''}`}
                  onClick={handleDelete}
                  disabled={actionLoading.delete}
                >
                  {actionLoading.delete ? (
                    <div className="button-spinner"></div>
                  ) : (
                    <DeleteIcon 
                      fontSize='small' 
                      className="post__deleteIcon"
                    />
                  )}
                </button>
              )}
              <button
                className={`post__actionButton ${actionLoading.upvote ? 'loading' : ''}`}
                onClick={() => handleVote('upvote')}
                disabled={actionLoading.upvote}
              >
                {actionLoading.upvote ? (
                  <div className="button-spinner"></div>
                ) : (
                  <>
                    <ThumbUpIcon 
                      fontSize="small" 
                      className="post__voteIcon"
                    />
                    <span>{upvote}</span>
                  </>
                )}
              </button>
              <button
                className={`post__actionButton ${actionLoading.downvote ? 'loading' : ''}`}
                onClick={() => handleVote('downvote')}
                disabled={actionLoading.downvote}
              >
                {actionLoading.downvote ? (
                  <div className="button-spinner"></div>
                ) : (
                  <>
                    <ThumbDownIcon 
                      fontSize="small" 
                      className="post__voteIcon"
                    />
                    <span>{downvote}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {expandedImage && (
          <div className="post__imageModal" onClick={() => setExpandedImage(null)}>
            <div className="post__imageModal-content">
              <CloseIcon 
                className="post__imageModal-close" 
                onClick={() => setExpandedImage(null)} 
              />
              <img src={expandedImage} alt="Expanded view" style={{width:600}}/>
            </div>
          </div>
        )}
      </>
    );
  }
);

Tweet.propTypes = {
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  title: PropTypes.string,
  ipfsHash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  personal: PropTypes.bool.isRequired,
  upvote: PropTypes.number.isRequired,
  downvote: PropTypes.number.isRequired,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

Tweet.defaultProps = {
  title: '',
};

Tweet.displayName = "Tweet";

export default Tweet;
