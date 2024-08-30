import React from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Profile from './components/Profile';
import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react';
import Com from './components/Com';
import Working from './components/Working';
import Bookmarks from './components/Bookmarks';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3011/api/data', { withCredentials: true })
      .then(() => {
        console.log("backend frontend connected");
      })
      .catch(error => {
        console.error('There was an error making the request', error);
      });
  }, []);

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    setCurrentAccount(accounts[0]);
  }

  const sendAccountToBackend = async () => {
    try {
      const response = await axios.post('http://localhost:3011/api/account', {
        account: currentAccount,
      });
      console.log('Account sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending account:', error);
    }
  };

  getAccount();

  useEffect(() => {
    if (currentAccount) sendAccountToBackend();
  }, [currentAccount]);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path='/home' element={<MainPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/communities' element={<Com />} />
        <Route path='/working' element={<Working />} />
        <Route path='/bookmarks' element={<Bookmarks />} />
      </Routes>
    </Router>
  );
}

export default App;