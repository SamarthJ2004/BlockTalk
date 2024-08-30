import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Tooltip.css';

const Tooltip = ({ account }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='profile' onClick={() => navigate("/profile")}>
        <div><i className="far fa-user icon" /></div>
        <div>My profile</div>
      </div>

      {isHovered && (
        <div className='tooltip-content'>
          My Address: {account}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
