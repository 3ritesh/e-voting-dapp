# E-Voting DApp Deployment Guide

This guide will walk you through the process of deploying your E-Voting Next.js DApp. 

Since GitHub CLI (`gh`) is not installed or authenticated on your machine, I cannot automatically create the repository for you. However, you can easily do it by following these steps.

## Step 1: Create a GitHub Repository and Push Your Code

1. Go to [GitHub](https://github.com/new) and log in to your account (`3ritesh`).
2. Create a new repository (e.g., named `e-voting-dapp`). You can leave it Public or Private. Do **NOT** initialize it with a README, .gitignore, or license.
3. Open your terminal in VS Code (or PowerShell) in the root of your project folder (`c:\Users\rk748\OneDrive\Desktop\E-Voting`).
4. Run the following commands to initialize Git and push your code:

```bash
git init
git add .
git commit -m "Initial commit of E-Voting DApp"
git branch -M main
git remote add origin https://github.com/3ritesh/e-voting-dapp.git
git push -u origin main
```

## Step 2: Deploying the Frontend (Next.js Application)

You mentioned you prefer to deploy on GitHub, but I've also included recommendations for Vercel and Netlify (which are generally much better suited for Next.js applications).

### Option A: Deploying on GitHub Pages (Your Preference)

GitHub Pages handles static websites, but Next.js requires a specific export process. I have created a GitHub Actions workflow for you in `.github/workflows/deploy.yml` that will automatically build and deploy your application to GitHub Pages whenever you push to the `main` branch.

**To enable GitHub Pages:**
1. Once your code is pushed to your GitHub repository, go to your repository's **Settings** tab.
2. On the left sidebar, click on **Pages**.
3. Under the **Build and deployment** section, select **GitHub Actions** as the source.
4. The workflow file (`.github/workflows/deploy.yml`) is already set up and should run automatically.
5. You can monitor the deployment progress in the **Actions** tab of your repository.

*Note: Since GitHub Pages hosts your site on a subpath (e.g., `https://3ritesh.github.io/e-voting-dapp`), some internal links or image paths might need adjustments if they don't use Next.js's built-in router and asset system properly.*

### Option B: Deploying on Vercel (Highly Recommended for Next.js)

Vercel is the company behind Next.js. It requires zero configuration and automatically handles all API routes, server-side rendering, and image optimization out of the box.

1. Go to [Vercel](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `e-voting-dapp` GitHub repository.
4. In the configuration page, you don't need to change anything (Framework Preset will automatically be `Next.js`).
5. Set any Environment Variables if required (e.g., your blockchain RPC URL or private keys for production).
6. Click **Deploy**. Vercel will give you a live URL in minutes.

### Option C: Deploying on Netlify

Netlify is another excellent alternative for deploying React and Next.js applications seamlessly.

1. Go to [Netlify](https://www.netlify.com/) and sign up with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize Netlify.
4. Select your `e-voting-dapp` repository.
5. In the build settings, Netlify will auto-detect Next.js (`npm run build`). 
6. Add your Environment Variables and click **Deploy Site**.

## Step 3: Deploying the Smart Contract (Backend)

Remember that your DApp relies on a Solidity smart contract. You must deploy your smart contract to a live testnet or mainnet (like Polygon Mumbai, Sepolia, or Ethereum Mainnet) for the deployed frontend to communicate with it.

1. Get testnet ETH or MATIC from a faucet.
2. Ensure you have your private key and API URL (Alchemy/Infura) in your `.env` file (never commit your `.env` file to GitHub).
3. Update your `hardhat.config.js` to include the testnet network.
4. Run your deployment script:
```bash
npx hardhat run scripts/deploy.js --network <network_name>
```
5. Once deployed, update your frontend application with the new live contract address, commit the changes, and push to GitHub so your site (Vercel/GitHub Pages) automatically rebuilds with the new address.
