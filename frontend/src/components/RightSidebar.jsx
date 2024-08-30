import React from 'react';
import './css/RightSidebar.css';
import TrendingTweets from './Trending';

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <div className="right-sidebar-item">
        <h3>Subscribe to Premium</h3>
        <button className="subscribe-button">Subscribe</button>
      </div>
      <TrendingTweets/>
      <div className="right-sidebar-item">
        <h3>What's happening</h3>
        <div className="happening-item">Esports World Cup 2024</div>
        <div className="happening-item">#OnDemandAI</div>
        <div className="happening-item">#DelhiCoachingCenterIncident</div>
        <div className="happening-item">#NeerajChopra</div>
        <div className="happening-item">Sunil Gavaskar</div>
      </div>
    </div>
  );
}

export default RightSidebar;