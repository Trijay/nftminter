import { useEffect, useState } from "react";
import {ReactDOM} from 'react-dom';
import { Link } from "react-router-dom";
import {
  connectWallet,
  getCurrentWalletConnected,
  getListOfMintedNftsByTokenIds,
  mintNFT,
  getListOfMintedNfts,
} from "./utils/interact";
import reactDom from "react-dom";

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletLister();
  }, []);

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  function addWalletLister() {
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
  }

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(url, name, description);
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL("");
    }
  };

  const onGetMintedListbyId = async () => {
    const { data } = await getListOfMintedNftsByTokenIds();
    setStatus(data);
  };

  const onGetMintedList = async () => {
    const { tokenId, contracts } = await getListOfMintedNfts();
    setURL(tokenId);
    setStatus(contracts);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title"> NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>Link to NFT </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>Name for the NFT </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description for the NFT </h2>
        <input
          type="text"
          placeholder="Please Add the description"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>

      <button id="mintedListNFTButton" onClick={onGetMintedListbyId}>
        List of Minted NFT's by tokenId
      </button>

      <button id="mintedListNFTButton" onClick={onGetMintedList}>
        List of all Minted NFT's
      </button>

      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
