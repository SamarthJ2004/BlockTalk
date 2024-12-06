import './css/Tweet.css'
import { forwardRef } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EtherFunc from '../logic';
import BookmarkButton from './BookmarkButton';

const Tweet = forwardRef(
  ({ id, displayName, title, text, time, personal, upvote, downvote }, ref) => {

    const getTimeDifference = (blockTimestamp) => {
      const currentTime = Math.floor(Date.now() / 1000);
      const differenceInSeconds = currentTime - blockTimestamp;

      const secondsInDay = 60 * 60 * 24;
      const secondsInHour = 60 * 60;

      const days = Math.floor(differenceInSeconds / secondsInDay);
      const hours = Math.floor((differenceInSeconds % secondsInDay) / secondsInHour);

      return { days, hours };
    }

    const { days, hours } = getTimeDifference(time);

    return (
      <div className="post" ref={ref} key={id}>

        <div className="post__body">
          <h2 className="post__title">{title || "No Title"}</h2>

          <div className="post__headerText">
            <h3 className="post__displayName">Author: {personal ? "Your Tweet" : displayName}</h3>
            <span className="post__time">{days > 0 && `${days} day(s) `}
              {hours > 0 && `${hours} hours`}
              {(days === 0 && hours === 0) ? 'Just now' : ' ago'}</span>
          </div>

          <div className="post__headerDescription">{text || "No Body"}</div>

          <div className="post__footer">
            <BookmarkButton displayName={displayName} id={id}/>
            {personal && <DeleteIcon fontSize='small' onClick={() => EtherFunc({ id, func: 'deleteTweet', message: "The tweet was deleted" })} />}
            <div>
              <ThumbUpIcon fontSize="small" onClick={() => EtherFunc({ id, func: 'upvote', message: "The vote was increased" })} /> {upvote}
            </div>
            <div>
              <ThumbDownIcon fontSize="small" onClick={() => EtherFunc({ id, func: 'downvote', message: "The vote was decreased" })} /> {downvote}
            </div>
          </div>

        </div>
      </div>
    );
  }
);

export default Tweet;
