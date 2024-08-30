import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Init from './Init';
import { SEPOLIA_ID } from '../config';

function Home() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask not detected');
        window.alert("Connect to Metamask");
        window.location = "https://metamask.io/";
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain:' + chainId);
      const sepoliaChainId = SEPOLIA_ID;

      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Found account', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('Error connecting to metamask', error);
    }
  };

  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain:' + chainId);

    const sepoliaChainId = SEPOLIA_ID;

    setCorrectNetwork(chainId === sepoliaChainId);
  };

  useEffect(() => {
    if (currentAccount) {
      checkCorrectNetwork();
    }
  }, [currentAccount]);

  useEffect(() => {
    if (currentAccount && correctNetwork) {
      navigate('/home');
    }
  }, [currentAccount, correctNetwork, navigate]);

  return (
    <div>
      {currentAccount === '' ? (
        <Init connectWallet={connectWallet} />
      ) : !correctNetwork ? (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>----------------------------------------</div>
          <div>Please connect to the Sepolia Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      ) : (
        <div>Redirecting to /home...</div>
      )}
    </div>
  );
}

export default Home;