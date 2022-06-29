// import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useState, useEffect} from 'react';
import { tokenAddress} from './config';
import  Token  from './artifacts/contracts/Token.sol/Token.json';
// import React from 'react';
// import ReactDOM from 'react-dom/client';

export default function App() {

  const [amount, setAmount] = useState(0);
  const [metaMaskAccount, getMetaMaskAccount] = useState("");
  const [claimableAmount, getClaimableAmount] = useState();

  const requestAccount = async () => {
    // await window.ethereum.request({ method: 'eth_requestAccounts' });

    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    getMetaMaskAccount(account);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    const ClaimedAmount = await contract.getClaimAmount(account);

    getClaimableAmount(ClaimedAmount.toString());

  }

  const getWalletState = async () => {
    
    var connetButton = document.getElementById("connectBtn");
    var claimAmountDiv = document.getElementById("claimAmountDiv");
    // plz get chainID
    var [Prototype, PromiseState, PromiseResult] = await window.ethereum.request({method: 'eth_chainId'});

    if (typeof window.ethereum !== 'undefined') {
      if(PromiseResult == 4 && connetButton != null && claimAmountDiv != null) {

        connetButton.style.display = "none";
        claimAmountDiv.style.display = "block"; 

        await requestAccount();

      }else{

        alert("select Rinkeby network.");

      }
    }else{

       alert("Connect Metamask wallet");

    }
  }

  const claim = async (amount) => {
    
    if (typeof window.ethereum !== 'undefined') {
      if(amount >0 && amount <= claimableAmount){
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log( provider )
        const signer = provider.getSigner();  
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transaction = await contract.claim(amount);
        await transaction.wait();

        await requestAccount();
        
        // useEffect(() => {
        //   setCalculation(() => count * 2);
        // }, [ClaimedAmount]); // <- add the count variable here


      }else{
        alert(" You have to enter a value greater than 0! ");
      }

    }
  }


  return (
    <div className="App">
      <header id = "mainHeader" className="App-header">
        <button id="connectBtn" className='Button' onClick={getWalletState}>connnet wallet</button>
        <div id ="claimAmountDiv"  className='claim-div'  style={{display: "none"}}>
            <h1> My HaraHat Token (RST) </h1>
            <p> Your MetaMask Wallet account :  <label>{metaMaskAccount}</label></p>

            <p>The claimable amount of token : <label>{claimableAmount}</label> </p>
            <input
              className = "claim-amount-input"
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button id="claimBtn" className='claim-btn' onClick={()=>claim(amount)}>Claim</button>
        </div>
      </header>
    </div>
  );
}

