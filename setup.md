# 🛠️ Setup Guide — E-Voting Blockchain DApp

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | v18+ recommended | [nodejs.org](https://nodejs.org) |
| MetaMask | Latest | [metamask.io](https://metamask.io) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

## Step 1 — Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

---

## Step 2 — Compile the Smart Contract

```bash
npx hardhat compile
```

✅ Expected output: `Compiled 1 Solidity file successfully`

---

## Step 3 — Run Unit Tests

```bash
npx hardhat test test/Voting.js
```

✅ Expected output: `20 passing`

---

## Step 4 — Start Local Blockchain

Open a **dedicated terminal** and keep it running throughout development:

```bash
npx hardhat node
```

This will:
- Start a local Ethereum node at `http://127.0.0.1:8545`
- Print **20 test accounts** each with `10,000 ETH`
- Print the **private keys** for each account

> ⚠️ **Copy Account #0's private key** — this is the contract owner.

---

## Step 5 — Deploy the Contract

In a **new terminal** (keep the node running in the previous one):

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This automatically writes the contract **address + ABI** to `context/constants.js`. No manual copy needed.

---

## Step 6 — Configure MetaMask

1. Open MetaMask → click the network dropdown → **Add Network**
2. Fill in:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Click **Save**
4. Go to **Import Account** → paste **Account #0's private key** from Step 4
   - This account is the **contract owner** (can register candidates & voters)

---

## Step 7 — Run the Frontend

```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

> If port 3000 is busy, Next.js will use `3001`, `3002`, etc. Check the terminal output.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npx` not recognized | Add Node.js to PATH: `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH` |
| `Nothing to compile` | ✅ This is fine — contract is already compiled |
| MetaMask wrong network | Switch to **Hardhat Local** in MetaMask network dropdown |
| `context/constants.js` is empty | Re-run `npx hardhat run scripts/deploy.js --network localhost` |
| Port already in use | Check terminal for the actual port number (e.g., 3001) |
