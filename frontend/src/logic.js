import { BLOCKTALK_CONTRACT } from "./config";
import { ethers } from "ethers";
import Twitter from './jsonFiles/BlockTalkContract.json';

const EtherFunc = async ({ func, id, message }) => {
  try {
    const TwitterContractAddress = BLOCKTALK_CONTRACT;
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TwitterContract = new ethers.Contract(
        TwitterContractAddress,
        Twitter.abi,
        signer
      )

      if (func == 'deleteTweet') await TwitterContract.deleteTweet(id, true);
      else if (func == 'upvote') await TwitterContract.upvote(id);
      else if (func == 'downvote') await TwitterContract.downvote(id);
      else if (func == 'addTweet') await TwitterContract.addTweet(id.tweetTitle, id.ipfsHash, false);
			else if (func == 'updateProfilePicture') await TwitterContract.updateProfilePicture(id);
      else if (func === 'trending') {
        const trendingTweets = await TwitterContract.getTrendingTweets();
        return trendingTweets;
      }
      else if (func == 'getUser') {
        const userDetails = await TwitterContract.getUserDetails();
        return userDetails;
      }
      console.log({ message });
    } else {
      console.log("Ethereum object doesn't exist");
    }
  } catch (error) {
    console.error("EtherFunc Error:", error);
    throw new Error("Contract interaction failed");
  }
}

export default EtherFunc;
