// import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useState} from 'react';
import { tokenAddress} from './config';
import  Token  from './artifacts/contracts/Token.sol/Token.json';
// import React from 'react';
// import ReactDOM from 'react-dom/client';

export default function App() {

  const [amount, setAmount] = useState();
  const [metaMaskAccount, setMetaMaskAccount] = useState("");
  const [balanceAmount, setBalanceAmount] = useState();

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

  }

  const getWalletState = async () => {
    
    var connetButton = document.getElementById("connectBtn");
    var claimAmount = document.getElementById("claimAmount");
    if (typeof window.ethereum !== 'undefined') {
      if(connetButton != null && claimAmount != null) {
        connetButton.style.display = "none"; 
        claimAmount.style.display = "block"; 

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        setMetaMaskAccount(account);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
        const balance = await contract.balanceOf(account);

        console.log(balance);

        setBalanceAmount(balance);

      }
    }
  }

  const claim = async (amount) => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.claim(amount);
    }
  }


  return (
    <div className="App">
      <header id = "mainHeader" className="App-header">
        <button id="connectBtn" className='Button' onClick={getWalletState}>connnet wallet</button>
        <div id ="claimAmount"  className='claim-div'  style={{display: "none"}}>
            <h1> My HaraHat Token (RST) </h1>
            <p> Your MetaMask Wallet account :  <label>{metaMaskAccount}</label></p>

            <p>Enter claim amount: <label>{balanceAmount}</label> </p>
            <input
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button id="claimBtn" className='Button' onClick={()=>claim(amount)}>connnet wallet</button>
        </div>
      </header>
    </div>
  );
}

