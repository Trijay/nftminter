const keys = require("../keys");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(
  `https://eth-ropsten.alchemyapi.io/v2/${keys.ALCHEMY_API_KEY}`
);
const abi = require("../contract-abi.json");
const contractAddress = "0x1Fe48D6AEb6ccDf1aC73b96f6eEeb7D1d7E48ca4";
const { pinJSONToIPFS } = require("./piniata");
const axios = require("axios");

//This is just to connect wallets from metamask api docs

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = { status: "What's the message", address: addresses[0] };
      return obj;
    } catch (error) {
      return { address: "Address Not Found", status: error.message };
    }
  } else {
    return {
      address: "",
      status:
        "Please download metamask browser extension from https://metamask.io/download.html",
    };
  }
};

//Remember if wallet is connected
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addresses = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addresses.length > 0) {
        return {
          address: addresses[0],
          status: "",
        };
      } else {
        alert("Please connect to the browser extension");
        return {
          address: "Address Not Found",
          status: "Not Connected",
        };
      }
    } catch (error) {
      return {
        address: "",
        status: error.message,
      };
    }
  } else {
    return {
      address: "",
      status:
        "Please download metamask browser extension from https://metamask.io/download.html",
    };
  }
};

export const addWalletLister = async () => {
  if (window.ethereum) {
    try {
      window.ethereum.on("Not the same account", (addresses) => {
        if (addresses.length > 0) {
          return {
            add: addresses[0],
            statusbar: addresses[0],
          };
        } else {
          alert("Please connect to the browser extension");
          return {
            add: "Address Not Found",
            statusbar: "Not Connected",
          };
        }
      });
    } catch (error) {
      return {
        add: "",
        statusbar: error.message,
      };
    }
  } else {
    return {
      add: "",
      statusbar:
        "You don't have the metamask extension. Please download from https://metamask.io/download.html",
    };
  }
};

export const mintNFT = async (url, name, description) => {
  if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(abi, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.mint(tokenURI).encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status: "https://ropsten.etherscan.io/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const getListOfMintedNftsByTokenIds = async () => {
  //add token id in the parameter
  const baseUrl = `https://eth-ropsten.alchemyapi.io/v2/${keys.ALCHEMY_API_KEY}/getNFTMetadata`;
  const contractAddr = keys.contractAddr;

  var config = {
    method: "get",
    url: `${baseUrl}?contractAddress=${contractAddr}&tokenId=0&tokenType=erc721`,
  };

  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data, null, 2));
      return {
        success: true,
        data: response.data,
      };
    })
    .catch((error) => console.log(error));
};

export const getListOfMintedNfts = async () => {
  // Address we want get NFT mints from
  const toAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const res = await web3.alchemy.getAssetTransfers({
    fromBlock: "0x0",
    fromAddress: "0x0000000000000000000000000000000000000000",
    toAddress: toAddress[0],
    excludeZeroValue: true,
    category: ["erc721", "erc1155"],
  });

  // Print contract address and tokenId for each NFT (ERC721 or ERC1155):
  for (const events of res.transfers) {
    console.log('Events', events);
    if (events.erc1155Metadata == null) {
      // console.log(
      //   "ERC-721 Token Minted: ID- ",
      //   events.tokenId,
      //   " Contract- ",
      //   events.rawContract.address
      // );
      return {
        tokenId :
        events.tokenId,
        contracts :
        events.rawContract.address
      }
    }
  }
};
