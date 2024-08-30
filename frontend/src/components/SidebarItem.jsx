import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Sidebar.css";

function SidebarItem({ icon, text, route }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div className="sidebar-item" onClick={handleClick} role="button" tabIndex={0}>
      <i className={icon + " icon"}></i> {text}
    </div>
  );
}

export default SidebarItem;
