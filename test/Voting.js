const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
    let VotingContract, voting, owner, addr1, addr2, addr3;

    // ─── Helpers ────────────────────────────────────────────────────────────────
    const now = () => Math.floor(Date.now() / 1000);
    const future = (secs) => now() + secs;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        VotingContract = await ethers.getContractFactory("VotingContract");
        voting = await VotingContract.deploy();
        await voting.deployed();
    });

    // ─── Deployment ─────────────────────────────────────────────────────────────
    describe("Deployment", function () {
        it("Should set the owner correctly", async function () {
            expect(await voting.getOwner()).to.equal(owner.address);
        });

        it("Should have no election created initially", async function () {
            expect(await voting.electionCreated()).to.equal(false);
        });
    });

    // ─── Election Creation ───────────────────────────────────────────────────────
    describe("Election Creation", function () {
        it("Owner can create an election", async function () {
            const start = future(60);
            const end = future(3600);

            await expect(
                voting.createElection("General Election", "Govt of India", start, end)
            ).to.emit(voting, "ElectionCreated");

            const election = await voting.getElectionDetails();
            expect(election.electionTitle).to.equal("General Election");
            expect(election.organizationTitle).to.equal("Govt of India");
            expect(await voting.electionCreated()).to.equal(true);
        });

        it("Non-owner cannot create an election", async function () {
            await expect(
                voting.connect(addr1).createElection("Fake Election", "Nobody", future(10), future(100))
            ).to.be.revertedWith("Only owner can call this function");
        });

        it("Cannot create election with end time before start time", async function () {
            await expect(
                voting.createElection("Bad Election", "Org", future(100), future(10))
            ).to.be.revertedWith("End time must be after start time");
        });
    });

    // ─── Candidate Registration ──────────────────────────────────────────────────
    describe("Candidate Registration", function () {
        beforeEach(async function () {
            await voting.createElection("Test Election", "Test Org", future(60), future(3600));
        });

        it("Owner can register a candidate", async function () {
            await expect(
                voting.registerCandidate(addr1.address, "30", "Alice", "alice.jpg", "ipfs://alice")
            ).to.emit(voting, "CandidateCreated");

            const candidate = await voting.getCandidate(addr1.address);
            expect(candidate.name).to.equal("Alice");
            expect(candidate.age).to.equal("30");
            expect(candidate._address).to.equal(addr1.address);
            expect(candidate.voteCount).to.equal(0);
            expect(await voting.candidateCount()).to.equal(1);
        });

        it("Cannot register same candidate twice", async function () {
            await voting.registerCandidate(addr1.address, "30", "Alice", "alice.jpg", "ipfs://alice");
            await expect(
                voting.registerCandidate(addr1.address, "30", "Alice Duplicate", "img.jpg", "ipfs://dup")
            ).to.be.revertedWith("Candidate already registered");
        });

        it("Non-owner cannot register a candidate", async function () {
            await expect(
                voting.connect(addr1).registerCandidate(addr2.address, "25", "Bob", "bob.jpg", "ipfs://bob")
            ).to.be.revertedWith("Only owner can call this function");
        });

        it("Can retrieve all candidates", async function () {
            await voting.registerCandidate(addr1.address, "30", "Alice", "alice.jpg", "ipfs://alice");
            await voting.registerCandidate(addr2.address, "35", "Bob", "bob.jpg", "ipfs://bob");

            const allCandidates = await voting.getAllCandidates();
            expect(allCandidates.length).to.equal(2);
            expect(allCandidates[0].name).to.equal("Alice");
            expect(allCandidates[1].name).to.equal("Bob");
        });
    });

    // ─── Voter Registration ──────────────────────────────────────────────────────
    describe("Voter Registration", function () {
        it("Owner can whitelist a voter", async function () {
            await expect(
                voting.giveVoterRight(addr1.address, "Alice Voter", "alice.jpg", "ipfs://voter-alice")
            ).to.emit(voting, "VoterCreated");

            const voter = await voting.getVoter(addr1.address);
            expect(voter.name).to.equal("Alice Voter");
            expect(voter.allowed).to.equal(1);
            expect(voter.voted).to.equal(false);
        });

        it("Cannot whitelist same voter twice", async function () {
            await voting.giveVoterRight(addr1.address, "Alice Voter", "img.jpg", "ipfs://v1");
            await expect(
                voting.giveVoterRight(addr1.address, "Alice Duplicate", "img.jpg", "ipfs://v2")
            ).to.be.revertedWith("Voter already registered");
        });

        it("Non-owner cannot whitelist a voter", async function () {
            await expect(
                voting.connect(addr1).giveVoterRight(addr2.address, "Bob", "bob.jpg", "ipfs://bob")
            ).to.be.revertedWith("Only owner can call this function");
        });

        it("Can retrieve all voters", async function () {
            await voting.giveVoterRight(addr1.address, "Alice", "a.jpg", "ipfs://a");
            await voting.giveVoterRight(addr2.address, "Bob", "b.jpg", "ipfs://b");

            const allVoters = await voting.getAllVoters();
            expect(allVoters.length).to.equal(2);
        });
    });

    // ─── Voting ──────────────────────────────────────────────────────────────────
    describe("Voting", function () {
        beforeEach(async function () {
            // Create election starting NOW (block.timestamp approx)
            const start = now() - 5;          // started 5 seconds ago
            const end = future(3600);          // ends in 1 hour

            await voting.createElection("Live Election", "Test Org", start, end);
            await voting.registerCandidate(addr1.address, "30", "Alice", "alice.jpg", "ipfs://alice");
            await voting.giveVoterRight(addr2.address, "Bob Voter", "bob.jpg", "ipfs://bob");
        });

        it("Whitelisted voter can cast a vote", async function () {
            await expect(voting.connect(addr2).vote(addr1.address))
                .to.emit(voting, "VoteCasted");

            const candidate = await voting.getCandidate(addr1.address);
            expect(candidate.voteCount).to.equal(1);

            const voter = await voting.getVoter(addr2.address);
            expect(voter.voted).to.equal(true);
        });

        it("Voter cannot vote twice", async function () {
            await voting.connect(addr2).vote(addr1.address);
            await expect(voting.connect(addr2).vote(addr1.address))
                .to.be.revertedWith("You have already voted");
        });

        it("Non-whitelisted address cannot vote", async function () {
            // addr3 is not whitelisted
            await expect(voting.connect(addr3).vote(addr1.address))
                .to.be.revertedWith("You are not allowed to vote");
        });

        it("Cannot vote for non-existent candidate", async function () {
            await expect(voting.connect(addr2).vote(addr3.address))
                .to.be.revertedWith("Candidate does not exist");
        });
    });

    // ─── Status Helper ───────────────────────────────────────────────────────────
    describe("Status Helpers", function () {
        it("isVotingActive returns false before election created", async function () {
            expect(await voting.isVotingActive()).to.equal(false);
        });

        it("getRemainingTime returns 0 when no election", async function () {
            expect(await voting.getRemainingTime()).to.equal(0);
        });

        it("isVotingActive returns true during active period", async function () {
            const start = now() - 10;
            const end = future(3600);
            await voting.createElection("Active", "Org", start, end);
            expect(await voting.isVotingActive()).to.equal(true);
        });
    });
});
