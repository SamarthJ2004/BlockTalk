import { BLOCKTALK_CONTRACT } from "./config";
import { ethers } from "ethers";
import Twitter from './jsonFiles/BlockTalkContract.json';

const GetTweets = async () => {
  const TwitterContractAddress = BLOCKTALK_CONTRACT;
  let Posts;

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];

    for (let i = 0; i < allTweets.length; i++) {
      const tweet = allTweets[i];
      const isPersonal = tweet.username.toLowerCase() === address.toLowerCase();
      const updatedTweet = {
        'id': tweet.id._hex,
        'tweetTitle': tweet.title,
        'ipfsHash': tweet.tweetText,
        'username': tweet.username,
        'upvote': parseInt(tweet.upvote._hex, 16),
        'downvote': parseInt(tweet.downvote._hex, 16),
        'time': parseInt(tweet.time._hex, 16),
        'reward': tweet.reward,
        'personal': isPersonal
      };

      updatedTweets.push(updatedTweet);
    }
    return updatedTweets.reverse();
  }

  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TwitterContract = new ethers.Contract(
        TwitterContractAddress,
        Twitter.abi,
        signer
      )

      let allTweets = await TwitterContract.getAllTweets();
			console.log(allTweets);
      let updatedTweets = getUpdatedTweets(allTweets, ethereum.selectedAddress);
      Posts = updatedTweets;
			console.log(Posts);
    } else {
      console.log("Ethereum object doesn't exist");
    }
  } catch (error) {
    console.log(error);
  }

  return Posts;
}

export default GetTweets;
