import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Navbar } from "../components//Navbar";
import { useAccount } from "wagmi";
import { TOKEN_ABI } from "../constants";
import { Button } from "antd";

const TOKEN_ADDRESS = "0xAFb1C9cdfa5492DCB5d9D7d8280BC1A142b18109";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [voterAddress, setVoterAddress] = useState("0x00");
  const [tokenBalance, setTokenBalance] = useState(0);

  const { data: account } = useAccount();

  useEffect(() => {
    if (account) {
      setConnected(true);
      _getTokenBalance(voterAddress)
        .then((balance) => {
          setTokenBalance(balance);
        })
        .catch((err) => {
          console.log(err);
        });
      setVoterAddress(account.address);
    }
  });

  const claimToken = () => {
    _claimToken();
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className={styles.container}>
        <div className={styles.balanceSection}>
          <div>
            <h3>Your WKND token balance: {tokenBalance}</h3>
          </div>
          <Button
            type="primary"
            className={styles.darkButton}
            onClick={() => {
              if (connected) {
                setTokenBalance(1);
                claimToken();
              }
            }}
          >
            Claim WKND Token
          </Button>
        </div>
      </div>
    </div>
  );
}

async function _claimToken() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const signerAddress = signer.getAddress();

  const WKND = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

  try {
    let tx = await WKND.connect(signer).claim(signerAddress);
    console.log(tx);
  } catch (e) {
    console.log(e);
  }
}

async function _getTokenBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const signerAddress = signer.getAddress();
  const WKND = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
  try {
    let tx = await WKND.connect(signer).balanceOf(signerAddress);
    return tx.toNumber();
  } catch (e) {
    console.log(e);
  }
}
