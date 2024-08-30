// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BlockTalkToken.sol";

contract BlockTalkContract {
    uint public constant REWARD_DIFF = 3;
    BlockTalkToken public token;

    event AddTweet(address recipient, uint tweetId);
    event Vote(address indexed user, uint tweetId, bool isUpvote);
    event Rewards(uint tweetId, uint reward);
    event DeleteTweet(uint tweetId, bool isDeleted);

    struct Tweet {
        uint id;
        address username;
        string title;
        string tweetText;
        bool isDeleted;
        mapping(address => bool) hasVoted;
        uint upvote;
        uint downvote;
        uint time;
        uint reward;
    }

    struct User {
        address username;
        uint totalTokens;
        uint[] nftId;
    }

    struct TweetView {
        uint id;
        address username;
        string title;
        string tweetText;
        bool isDeleted;
        uint upvote;
        uint downvote;
        uint time;
        uint reward;
    }

    Tweet[] private tweets;
    mapping(address => User) users;
    mapping(uint256 => address) tweetToOwner;
    mapping(string => uint[]) public hashtags;

    constructor(BlockTalkToken _token) {
        token = _token;
    }

    function addTweet(
        string memory title,
        string memory tweetText,
        bool isDeleted
    ) public {
        uint tweetId = tweets.length;
        Tweet storage newTweet = tweets.push();
        newTweet.id = tweetId;
        newTweet.username = msg.sender;
        newTweet.title = title;
        newTweet.tweetText = tweetText;
        newTweet.isDeleted = isDeleted;
        newTweet.upvote = 1;
        newTweet.downvote = 0;
        newTweet.time = block.timestamp;
        newTweet.reward = 0;

        tweetToOwner[tweetId] = msg.sender;

        // Initialize user if not already initialized
        if (users[msg.sender].username == address(0)) {
            users[msg.sender].username = msg.sender;
        }

        emit AddTweet(msg.sender, tweetId);
    }

    function getAllTweets() external view returns (TweetView[] memory) {
        uint count = 0;
        for (uint i = 0; i < tweets.length; i++) {
            if (!tweets[i].isDeleted) {
                count++;
            }
        }

        TweetView[] memory result = new TweetView[](count);
        uint counter = 0;
        for (uint i = 0; i < tweets.length; i++) {
            if (!tweets[i].isDeleted) {
                Tweet storage tweet = tweets[i];
                result[counter] = TweetView(
                    tweet.id,
                    tweet.username,
                    tweet.title,
                    tweet.tweetText,
                    tweet.isDeleted,
                    tweet.upvote,
                    tweet.downvote,
                    tweet.time,
                    tweet.reward
                );
                counter++;
            }
        }
        return result;
    }

    function upvote(uint tweetId) external {
        require(tweetId < tweets.length, "Tweet does not exist");
        Tweet storage tweet = tweets[tweetId];

        require(
            !tweet.hasVoted[msg.sender],
            "You have already voted on this tweet."
        );

        tweet.hasVoted[msg.sender] = true;
        tweet.upvote += 1;

        emit Vote(msg.sender, tweetId, true);

        rewardToken(tweetId);
    }

    function rewardToken(uint tweetId) private {
        Tweet storage tweet = tweets[tweetId];
        uint rewardDiff = tweet.upvote -
            tweet.downvote -
            tweet.reward *
            REWARD_DIFF;
        if (rewardDiff >= REWARD_DIFF) {
            uint additionalRewards = rewardDiff / REWARD_DIFF;
            tweet.reward += additionalRewards;

            // Update user's total tokens
            address tweetOwner = tweet.username;
            users[tweetOwner].totalTokens += additionalRewards;

            // Mint BTK tokens to the user
            token.mint(tweetOwner, additionalRewards * 1e18);

            emit Rewards(tweetId, tweet.reward);
        }
    }

    function downvote(uint tweetId) external {
        require(tweetId < tweets.length, "Tweet does not exist");
        Tweet storage tweet = tweets[tweetId];

        require(
            !tweet.hasVoted[msg.sender],
            "You have already voted on this tweet."
        );

        tweet.hasVoted[msg.sender] = true;
        tweet.downvote += 1;

        emit Vote(msg.sender, tweetId, false);
    }

    function deleteTweet(uint tweetId, bool isDeleted) external {
        require(tweetId < tweets.length, "Tweet does not exist");
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }

    function getTrendingTweets() external view returns (TweetView[] memory) {
        uint count;
        for (uint i = 0; i < tweets.length; i++) {
            if (tweets[i].upvote > 5) count++;
        }

        TweetView[] memory result = new TweetView[](count);
        uint index;
        for (uint i = 0; i < tweets.length; i++) {
            if (tweets[i].upvote > 5) {
                Tweet storage tweet = tweets[i];
                result[index] = TweetView(
                    tweet.id,
                    tweet.username,
                    tweet.title,
                    tweet.tweetText,
                    tweet.isDeleted,
                    tweet.upvote,
                    tweet.downvote,
                    tweet.time,
                    tweet.reward
                );
                index++;
            }
        }
        return result;
    }

    function getUserDetails()
        external
        view
        returns (address username, uint totalTokens, uint[] memory nftIds)
    {
        User storage user = users[msg.sender];
        require(
            user.username == msg.sender,
            "You are not authorized to view this user's details."
        );

        return (user.username, user.totalTokens, user.nftId);
    }

    function updateUserTokenBalance(address userAddress, uint amount) external {
        require(
            users[userAddress].username != address(0),
            "User does not exist"
        );
        require(
            users[userAddress].totalTokens >= amount,
            "Insufficient tokens"
        );

        users[userAddress].totalTokens -= amount;
    }
}