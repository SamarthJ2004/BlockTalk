import React from 'react'
import { useState, useEffect } from 'react';
import './css/Communities.css';
import "./css/MainContent.css";

const New = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3011/communities')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setCommunities(data);
      })
      .catch(error => {
        console.error('Error fetching communities:', error);
      });
  }, []);

  return (
    <div className="main-content feed">
      <div>

        <h1 className='heading'>
          <i className="fa-solid fa-user-secret"></i>
          <br />
          Communities</h1>
      </div>
      <h2 className='heading2'>Join our decentralised community</h2>
      {communities.length > 0 ? (
        communities.map((community, index) => (
          <div key={index} className="community-card">
            <h2>{community.account}</h2>
            <p>Timestamp: {new Date(community.timestamp).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="no-communities">No communities found.</p>
      )}
    </div>

  );
}

export default New