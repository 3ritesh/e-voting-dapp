import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "./constants";

export const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
    // ─── State ─────────────────────────────────────────────────────────────────
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [candidateArray, setCandidateArray] = useState([]);
    const [voterArray, setVoterArray] = useState([]);
    const [currentVoter, setCurrentVoter] = useState(null);
    const [electionDetails, setElectionDetails] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ─── Helper: Get Contract Instance ────────────────────────────────────────
    const getContract = async (withSigner = false) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        if (withSigner) {
            const signer = provider.getSigner();
            return new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
        }
        return new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
    };

    // ─── Connect Wallet ────────────────────────────────────────────────────────
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setError("Please install MetaMask to use this dApp");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
            await checkOwner(accounts[0]);
            await fetchAllData();
        } catch (err) {
            setError("Failed to connect wallet: " + err.message);
        }
    };

    // ─── Auto-connect on load ──────────────────────────────────────────────────
    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return;
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                await checkOwner(accounts[0]);
                await fetchAllData();
            }
        } catch (err) {
            setError("Wallet check failed: " + err.message);
        }
    };

    // ─── Check if current user is the contract owner ────────────────────────
    const checkOwner = async (account) => {
        try {
            if (!VOTING_CONTRACT_ADDRESS) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
            const contractOwner = await contract.getOwner();
            setIsOwner(contractOwner.toLowerCase() === account.toLowerCase());
        } catch (err) {
            console.log("Owner check error:", err.message);
        }
    };

    // ─── Fetch All Data ────────────────────────────────────────────────────────
    const fetchAllData = async () => {
        try {
            if (!VOTING_CONTRACT_ADDRESS) return;
            await getNewCandidates();
            await getVoters();
            await getElectionDetails();
        } catch (err) {
            console.log("Data fetch error:", err.message);
        }
    };

    // ─── Create Election ───────────────────────────────────────────────────────
    const createElection = async (title, organization, startTime, endTime) => {
        setLoading(true);
        try {
            const contract = await getContract(true);
            const tx = await contract.createElection(
                title,
                organization,
                Math.floor(new Date(startTime).getTime() / 1000),
                Math.floor(new Date(endTime).getTime() / 1000)
            );
            await tx.wait();
            await getElectionDetails();
        } catch (err) {
            setError("Election creation failed: " + err.message);
        }
        setLoading(false);
    };

    // ─── Register Candidate ────────────────────────────────────────────────────
    const registerCandidate = async (candidateAddress, age, name, image, ipfs) => {
        setLoading(true);
        try {
            const contract = await getContract(true);
            const tx = await contract.registerCandidate(candidateAddress, age, name, image, ipfs || "");
            await tx.wait();
            await getNewCandidates();
        } catch (err) {
            setError("Candidate registration failed: " + err.message);
        }
        setLoading(false);
    };

    // ─── Give Voter Right (Whitelist) ─────────────────────────────────────────
    const giveVoterRight = async (voterAddress, name, image, ipfs) => {
        setLoading(true);
        try {
            const contract = await getContract(true);
            const tx = await contract.giveVoterRight(voterAddress, name, image, ipfs || "");
            await tx.wait();
            await getVoters();
        } catch (err) {
            setError("Voter registration failed: " + err.message);
        }
        setLoading(false);
    };

    // ─── Vote ──────────────────────────────────────────────────────────────────
    const vote = async (candidateAddress) => {
        setLoading(true);
        try {
            const contract = await getContract(true);
            const tx = await contract.vote(candidateAddress);
            await tx.wait();
            await getNewCandidates();
            await getVoters();
        } catch (err) {
            setError("Voting failed: " + err.message);
        }
        setLoading(false);
    };

    // ─── Fetch Candidates ─────────────────────────────────────────────────────
    const getNewCandidates = async () => {
        try {
            if (!VOTING_CONTRACT_ADDRESS) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
            const candidates = await contract.getAllCandidates();
            const formatted = candidates.map((c) => ({
                candidateId: c.candidateId.toNumber(),
                name: c.name,
                age: c.age,
                image: c.image,
                voteCount: c.voteCount.toNumber(),
                address: c._address,
                ipfs: c.ipfs,
            }));
            setCandidateArray(formatted);
        } catch (err) {
            console.log("Fetch candidates error:", err.message);
        }
    };

    // ─── Fetch Voters ─────────────────────────────────────────────────────────
    const getVoters = async () => {
        try {
            if (!VOTING_CONTRACT_ADDRESS) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
            const voters = await contract.getAllVoters();
            const formatted = voters.map((v) => ({
                voterId: v.voterId.toNumber(),
                name: v.name,
                image: v.image,
                voterAddress: v.voterAddress,
                allowed: v.allowed.toNumber(),
                voted: v.voted,
                vote: v.vote.toNumber(),
                ipfs: v.ipfs,
            }));
            setVoterArray(formatted);
        } catch (err) {
            console.log("Fetch voters error:", err.message);
        }
    };

    // ─── Fetch Election Details ────────────────────────────────────────────────
    const getElectionDetails = async () => {
        try {
            if (!VOTING_CONTRACT_ADDRESS) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
            const details = await contract.getElectionDetails();
            const endTimestamp = details.endTime.toNumber();
            setElectionDetails({
                title: details.electionTitle,
                organization: details.organizationTitle,
                startTime: details.startTime.toNumber(),
                endTime: endTimestamp,
                endDate: new Date(endTimestamp * 1000),
            });
        } catch (err) {
            console.log("Fetch election error:", err.message);
        }
    };

    // ─── Fetch Current Voter Status ────────────────────────────────────────────
    const getCurrentVoter = async (address) => {
        try {
            if (!VOTING_CONTRACT_ADDRESS || !address) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
            const voter = await contract.getVoter(address);
            setCurrentVoter({
                name: voter.name,
                image: voter.image,
                allowed: voter.allowed.toNumber(),
                voted: voter.voted,
                vote: voter.vote.toNumber(),
            });
        } catch (err) {
            console.log("Get current voter error:", err.message);
        }
    };

    // ─── Effects ───────────────────────────────────────────────────────────────
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        if (currentAccount) {
            getCurrentVoter(currentAccount);
        }
    }, [currentAccount]);

    // ─── Account Change Listener ──────────────────────────────────────────────
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                    await checkOwner(accounts[0]);
                } else {
                    setCurrentAccount(null);
                    setIsOwner(false);
                }
            });
        }
    }, []);

    return (
        <VoterContext.Provider
            value={{
                // State
                currentAccount,
                isOwner,
                candidateArray,
                voterArray,
                currentVoter,
                electionDetails,
                error,
                loading,
                // Functions
                connectWallet,
                createElection,
                registerCandidate,
                giveVoterRight,
                vote,
                getNewCandidates,
                getVoters,
                getElectionDetails,
                setError,
            }}
        >
            {children}
        </VoterContext.Provider>
    );
};
