const {piniata} = require('../keys');
const axios = require('axios');

export const pinJSONToIPFS = (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: piniata['API Key'],
                pinata_secret_api_key: piniata['API Secret']
            }
        })
        .then(function (response) {
            console.log("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
            return {
                success: true,
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
        });
};

