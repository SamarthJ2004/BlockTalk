import './css/Init.css';

function Init({ connectWallet }) {
  return (
    <div className='container'>
      <div className='content-container'>
        <div className='intro'>
          <h1>Welcome to BlockTalk</h1>
          <h2>Speak Freely, Share Boldly.</h2>
        </div>
        <button onClick={connectWallet} route="/home">Connect Wallet</button>
      </div>
    </div>
  );
}

export default Init;
