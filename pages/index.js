import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal"
import { providers, Contract } from "ethers"
import { useEffect, useRef, useState } from 'react'
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants"


export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  
  // this is persisted as long as the page is open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Change Network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  }


  /**
   * Add current connected address to whitelist
   */
  const addAddressToWhitelist = async () => {
    try {
      // This a write transaction,  therefore, need a signer here
      const signer = await getProviderOrSigner(true);
      
      // Using a signer whilte creating an instance of the contract allows "update" methods
      // e.g. adding current address to whitelist -> which is changing the state of the contract
      // hence a write transaction
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      
      setLoading(true);

      // waiting for the transaction to get mined
      await tx.wait();

      setLoading(false);

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      // No need of signer here as we are only reading from the blockchain
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      // numOfAddressesWhitelisted is public attribute and can accessed just like a function
      const _numberOfWhitelisted = await whitelistContract.numOfAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (error) {
      console.error(error);
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      // Need signer to get usre adress
      // signer is a special type of provider.  So can use the to read data from blockchain too
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // get the address associated to the sginer which is connected to the Metamask
      const address = await signer.getAddress();

      // whitelistedAddresses is a mapping from address => bool; true = address is whitelisted
      // whitelistedAddresses is public. can be called like a function and then pass the
      // address to get the value associated with it
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Connect to Meta Mask wallet on the browser
   */
  const connectWallet = async () => {
    try {
      // When called for the first time, prompts user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Conditionally render a button depending on the status of the dApp
   */
  const renderButton = () => {
    if (walletConnected) {
      // check if already in whitelist
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            You have successfully joined the Whitelist.  You have an awesome day!!!
          </div>
        )
      } else if (loading) {
        return (
          <button className={styles.button}>Loading...</button>
        );
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>JOIN WHITELIST</button>
        )
      }    
    } else {
      // Wallet not connected, ask to connect first
      return (
        <button onClick={connectWallet} className={styles.button}>Connect your Wallet</button>
      )
    }
  }

  /**
   * When the value of walletConnected changes, do something
   */
  useEffect(() => {
    if (!walletConnected) {
      
      // current vlaue of the reference is persisted as long as the page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      });

      connectWallet();
    }
  }, [walletConnected]);


  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  )
}
