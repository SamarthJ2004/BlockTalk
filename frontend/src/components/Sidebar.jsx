import React, { useState } from 'react';
import './css/Sidebar.css';
import Tooltip from './Tooltip';
import SidebarItem from './SidebarItem';


const Sidebar = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    setCurrentAccount(accounts[0]);
  }

  getAccount();

  return (
    <div className='sidebar'>
      <div className="sidebar-main">
        <div className="logo">BLOCKTALK</div>
        <SidebarItem icon="fas fa-home" text="Home" route="/home" />
        <SidebarItem icon="fas fa-hashtag" text="Explore" route="/working" />
        <SidebarItem icon="fas fa-users" text="Communities" route="/communities" />
        <SidebarItem icon="far fa-bookmark" text="Bookmarks" route="/bookmarks" />
        <SidebarItem icon="fa-solid fa-heart" text="My Likes" route="/working" />
        <SidebarItem icon="fas fa-ellipsis-h" text="More" route="/working" />
      </div>
      <Tooltip account={currentAccount} route="/profile"/>
    </div>
  );
}

export default Sidebar;