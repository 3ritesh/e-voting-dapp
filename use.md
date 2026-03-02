# 🗳️ How to Use — E-Voting Blockchain DApp

> Make sure you have completed the [setup guide](./setup.md) before proceeding.

---

## Roles

| Role | Description |
|---|---|
| **Owner** | The wallet that deployed the contract. Can create elections, register candidates, and whitelist voters. |
| **Voter** | Any wallet address that has been whitelisted by the owner. Can cast one vote. |
| **Public** | Anyone can view candidates, voter list, and results without a wallet. |

---

## 🔑 Owner Workflow

### 1. Create an Election

1. Go to **`/allowed-voters`** → click the **Election** tab
2. Fill in:
   - **Election Name** (e.g., `General Election 2024`)
   - **Start Time** — date & time when voting opens
   - **End Time** — date & time when voting closes
3. Click **Create Election**

---

### 2. Register Candidates

1. Go to **`/candidate-regisration`**
2. Fill in candidate details:
   - Name, Age, Party, Website URL
   - Upload a candidate photo
3. Click **Register Candidate**
4. Confirm the MetaMask transaction
5. Repeat for each candidate

---

### 3. Whitelist Voters

1. Go to **`/allowed-voters`** → click the **Add Voter** tab
2. Fill in:
   - Voter's **wallet address**
   - Voter's **name**
   - Upload voter photo
3. Click **Add Voter**
4. Confirm the MetaMask transaction
5. Repeat for each voter

---

## 🗳️ Voter Workflow

### 1. Connect Wallet

1. Open **`http://localhost:3000`**
2. Click **Connect Wallet** in the top-right corner
3. Approve connection in MetaMask

> ⚠️ Make sure MetaMask is set to the **Hardhat Local** network (Chain ID: 31337)

### 2. Cast Your Vote

1. The home page shows all registered candidates with their vote counts
2. Find your preferred candidate and click **Vote**
3. Confirm the transaction in MetaMask
4. Your vote is recorded on the blockchain — it cannot be changed

---

## 📊 Viewing Results

### During the Election
- Home page (`/`) shows live vote counts and a progress bar for each candidate
- Voter list (`/voterList`) shows who has voted

### After the Election Ends
- The **winner is automatically highlighted** on the home page with a 🏆 banner
- Final vote counts are visible for all candidates

---

## 📋 Page Reference

| Page | URL | Access |
|---|---|---|
| Home / Voting | `/` | Everyone |
| Voter List | `/voterList` | Everyone |
| Whitelist Voters + Election | `/allowed-voters` | Owner only |
| Register Candidates | `/candidate-regisration` | Owner only |

---

## ⚠️ Important Rules

- Each voter can only vote **once** — double voting is blocked by the smart contract
- Only **whitelisted** addresses can vote
- Only the **owner** (deployer wallet) can manage the election
- Votes are **permanent** on the blockchain — they cannot be undone
- The election must be **active** (between start and end time) to accept votes
