// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title VotingContract
 * @dev Decentralized E-Voting Smart Contract
 */
contract VotingContract {
    // ─────────────────────────────────────────────────────────────────────────
    // State Variables
    // ─────────────────────────────────────────────────────────────────────────

    address public owner;

    uint256 public startTime;
    uint256 public endTime;
    bool public electionCreated;

    // ─────────────────────────────────────────────────────────────────────────
    // Structs
    // ─────────────────────────────────────────────────────────────────────────

    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    struct Voter {
        uint256 voterId;
        string name;
        string image;
        address voterAddress;
        uint256 allowed;    // 1 = whitelisted
        bool voted;
        uint256 vote;       // candidateId voted for
        string ipfs;
    }

    struct Election {
        string electionTitle;
        string organizationTitle;
        uint256 startTime;
        uint256 endTime;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    address[] public candidateAddresses;
    address[] public voterAddresses;

    mapping(address => Candidate) public candidates;
    mapping(address => Voter) public voters;

    Election public currentElection;

    uint256 public candidateCount;
    uint256 public voterCount;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event ElectionCreated(
        string electionTitle,
        string organizationTitle,
        uint256 startTime,
        uint256 endTime
    );

    event CandidateCreated(
        uint256 indexed candidateId,
        string name,
        string age,
        string image,
        address indexed _address,
        string ipfs
    );

    event VoterCreated(
        uint256 indexed voterId,
        string name,
        string image,
        address indexed voterAddress,
        string ipfs
    );

    event VoteCasted(
        address indexed voter,
        uint256 indexed candidateId,
        uint256 voteCount
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier electionExists() {
        require(electionCreated, "No election has been created");
        _;
    }

    modifier duringVoting() {
        require(electionCreated, "No election has been created");
        require(block.timestamp >= startTime, "Voting has not started yet");
        require(block.timestamp <= endTime, "Voting period has ended");
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Election Management (Owner Only)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Create/update election details and timing
     */
    function createElection(
        string memory _electionTitle,
        string memory _organizationTitle,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyOwner {
        require(_endTime > _startTime, "End time must be after start time");
        require(_endTime > block.timestamp, "End time must be in the future");

        currentElection = Election({
            electionTitle: _electionTitle,
            organizationTitle: _organizationTitle,
            startTime: _startTime,
            endTime: _endTime
        });

        startTime = _startTime;
        endTime = _endTime;
        electionCreated = true;

        emit ElectionCreated(_electionTitle, _organizationTitle, _startTime, _endTime);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Candidate Registration
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Register a new candidate (owner only)
     */
    function registerCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public onlyOwner {
        require(candidates[_address]._address == address(0), "Candidate already registered");
        require(_address != address(0), "Invalid address");

        candidateCount++;

        candidates[_address] = Candidate({
            candidateId: candidateCount,
            age: _age,
            name: _name,
            image: _image,
            voteCount: 0,
            _address: _address,
            ipfs: _ipfs
        });

        candidateAddresses.push(_address);

        emit CandidateCreated(candidateCount, _name, _age, _image, _address, _ipfs);
    }

    /**
     * @dev Get all candidate addresses
     */
    function getCandidateAddresses() public view returns (address[] memory) {
        return candidateAddresses;
    }

    /**
     * @dev Get a candidate's details
     */
    function getCandidate(address _address) public view returns (Candidate memory) {
        return candidates[_address];
    }

    /**
     * @dev Get all candidates as an array
     */
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateAddresses.length);
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            allCandidates[i] = candidates[candidateAddresses[i]];
        }
        return allCandidates;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Voter Registration
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Owner whitelists / registers a voter
     */
    function giveVoterRight(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public onlyOwner {
        require(voters[_address].voterAddress == address(0), "Voter already registered");
        require(_address != address(0), "Invalid address");

        voterCount++;

        voters[_address] = Voter({
            voterId: voterCount,
            name: _name,
            image: _image,
            voterAddress: _address,
            allowed: 1,
            voted: false,
            vote: 0,
            ipfs: _ipfs
        });

        voterAddresses.push(_address);

        emit VoterCreated(voterCount, _name, _image, _address, _ipfs);
    }

    /**
     * @dev Get all voter addresses
     */
    function getVoterAddresses() public view returns (address[] memory) {
        return voterAddresses;
    }

    /**
     * @dev Get a voter's details
     */
    function getVoter(address _address) public view returns (Voter memory) {
        return voters[_address];
    }

    /**
     * @dev Get all voters as an array
     */
    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](voterAddresses.length);
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            allVoters[i] = voters[voterAddresses[i]];
        }
        return allVoters;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Voting
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Cast a vote for a candidate by their address
     */
    function vote(address _candidateAddress) public duringVoting {
        Voter storage currentVoter = voters[msg.sender];

        require(currentVoter.allowed == 1, "You are not allowed to vote");
        require(!currentVoter.voted, "You have already voted");
        require(candidates[_candidateAddress]._address != address(0), "Candidate does not exist");

        currentVoter.voted = true;
        currentVoter.vote = candidates[_candidateAddress].candidateId;

        candidates[_candidateAddress].voteCount++;

        emit VoteCasted(msg.sender, candidates[_candidateAddress].candidateId, candidates[_candidateAddress].voteCount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Results
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Get the winning candidate (most votes)
     */
    function getWinner() public view returns (Candidate memory winner) {
        require(block.timestamp > endTime || !electionCreated == false, "Election not ended yet");

        uint256 maxVotes = 0;
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            Candidate memory c = candidates[candidateAddresses[i]];
            if (c.voteCount > maxVotes) {
                maxVotes = c.voteCount;
                winner = c;
            }
        }
    }

    /**
     * @dev Get election details
     */
    function getElectionDetails() public view returns (Election memory) {
        return currentElection;
    }

    /**
     * @dev Get remaining voting time in seconds (0 if ended)
     */
    function getRemainingTime() public view returns (uint256) {
        if (!electionCreated || block.timestamp > endTime) return 0;
        return endTime - block.timestamp;
    }

    /**
     * @dev Check if voting is currently active
     */
    function isVotingActive() public view returns (bool) {
        return electionCreated && block.timestamp >= startTime && block.timestamp <= endTime;
    }

    /**
     * @dev Get contract owner
     */
    function getOwner() public view returns (address) {
        return owner;
    }
}
