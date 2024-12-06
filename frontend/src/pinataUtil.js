import axios from 'axios';

const PINATA_API_KEY = 'cbc39b42b789fcd96b8c';
const PINATA_SECRET_KEY = 'b2c67d725a2a2c6696662d1325851a29607778225399dd1a1956aa54a76e3fd4';

// Function to upload content to IPFS via Pinata
export const uploadToPinata = async ({ title, content, images }) => {
    try {
        // First, upload images if they exist
        const imageHashes = [];
        if (images && images.length > 0) {
            for (const image of images) {
                const formData = new FormData();
                formData.append('file', image);
                
                const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    headers: {
                        'Content-Type': `multipart/form-data;`,
                        'pinata_api_key': PINATA_API_KEY,
                        'pinata_secret_api_key': PINATA_SECRET_KEY
                    }
                });
                
                imageHashes.push(imageResponse.data.IpfsHash);
            }
        }

        // Create metadata JSON
        const metadata = {
            title,
            content,
            images: imageHashes,
            timestamp: Date.now()
        };

        // Upload metadata to Pinata
        const jsonResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        return jsonResponse.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw error;
    }
};

// Function to get content from IPFS via Pinata gateway
export const getFromPinata = async (ipfsHash) => {
    try {
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching from Pinata:', error);
        throw error;
    }
};

// Function to upload a profile picture
export const uploadProfilePicture = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': `multipart/form-data;`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};
