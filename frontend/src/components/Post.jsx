import { useState } from 'react';
import './css/Post.css';
import EtherFunc from '../logic';
import { uploadToPinata } from '../pinataUtil.js';

const Post = () => {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetTitle, setTweetTitle] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const sendTweet = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First upload content to Pinata
      const uploadData = {
        title: tweetTitle,
        content: tweetMessage,
        images: images
      };

      const ipfsHash = await uploadToPinata(uploadData);

      // Then store the hash on blockchain
      await EtherFunc({
        func: 'addTweet',
        id: {
          tweetTitle: tweetTitle,
          ipfsHash: ipfsHash,
        },
        message: 'Tweet posted successfully!'
      });

      // Clear form
      setTweetTitle('');
      setTweetMessage('');
      // Clean up preview URLs before removing images
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error posting tweet:', error);
      alert('Error posting tweet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file sizes and types
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please ensure all files are images under 5MB.');
    }

    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs for valid files
    const newUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index) => {
    // Clean up the preview URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="tweetBox">
      <form onSubmit={sendTweet}>
        <input
          value={tweetTitle}
          onChange={(e) => setTweetTitle(e.target.value)}
          className="tweetBox__title"
          placeholder="Add Your Tweet Title"
          type="text"
          required
          disabled={isLoading}
        />
        <textarea
          onChange={(e) => setTweetMessage(e.target.value)}
          value={tweetMessage}
          placeholder="What's happening?"
          className='tweetBox__content'
          required
          disabled={isLoading}
        />
        
        <div className="tweetBox__imageUpload">
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="hidden"
            id="image-upload"
            disabled={isLoading || images.length >= 4}
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer inline-block px-4 py-2 rounded
              ${images.length >= 4 || isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'} 
              text-white`}
          >
            {images.length >= 4 ? 'Max images reached' : 'Add Images'}
          </label>
          <span className="text-sm text-gray-500 ml-2">
            Max 4 images, 5MB each
          </span>
        </div>

        {previewUrls.length > 0 && (
          <div className="tweetBox__previews">
            {previewUrls.map((url, index) => (
              <div key={index} className="tweetBox__previewContainer">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="tweetBox__previewImage"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="tweetBox__removeImage"
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className={`tweetBox__Button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Posting...</span>
          ) : (
            <span>Tweet</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Post;
