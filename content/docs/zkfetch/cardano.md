---
title: Cardano 
description: Guide for using zkFetch with Cardano blockchain data and services
---

# Cardano zkFetch Integration

## Overview

zkFetch for Cardano enables developers to fetch data from external APIs with cryptographic proof of execution, storing verifiable proofs on the Cardano blockchain. This integration allows for trustless data verification without revealing sensitive information like API keys or private parameters.

### Key Features

- **Zero-Knowledge Proofs**: Generate proofs of API execution without revealing private data
- **Cardano Integration**: Store proof identifiers and extracted data on Cardano blockchain
- **Testnet Support**: Full Preprod testnet compatibility for development and testing
- **Metadata Storage**: Leverage Cardano's transaction metadata for proof storage

### System Architecture

![zkFetch Cardano Architecture](/assets/cardano_architecture.svg)

### Workflow Architecture

1. **Proof Generation Phase**
    - Client initiates zkFetch request with public and private parameters
    - Reclaim Protocol executes API call through witness network
    - Zero-knowledge proof is generated containing response data
    - Proof includes extracted parameters while hiding sensitive data
2. **Cardano Integration Phase**
    - Proof identifier and extracted data are prepared for on-chain storage
    - Transaction is constructed with proof data in metadata
    - Transaction is submitted to Cardano network (Preprod/Mainnet)
    - Proof becomes permanently verifiable on-chain
3. **Verification Phase**
    - Third parties can verify proofs using Reclaim SDK
    - On-chain data provides immutable record of proof existence
    - Extracted parameters are publicly accessible via transaction metadata

## Quickstart

If you prefer to quickly try the integration, this section is for you. First, make sure you have [Node.js](https://nodejs.org/en) and [Deno](https://docs.deno.com/runtime/getting_started/installation/) installed.

### Step 1: Clone repository and install packages:

```sh
git clone https://github.com/reclaimprotocol/zkfetch-cardano-example.git
cd zkfetch-cardano-example
npm i
```

### Step 2: Create a wallet and fund it:

```sh
deno run -A --unstable createWallet.ts
```

Details will be written to `addressDetails.json`, you can get Preprod funds from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet).

### Step 3: Request a proof with zkFetch:

```sh
node requestProof.js
```

The proof will be written to `proof.json`.

### Step 4: Send transaction to Preprod:

```sh
deno run -A --unstable --node-modules-dir=manual sendTransaction.ts
```

Proof identifier and extracted parameters will be included in the transaction's [metadata](https://preprod.cexplorer.io/tx/c36ba27f9124ec345b3a54bde3212aef834f91e203d2c8bf32a2f1f474ac5b4f/metadata#data).

You can skip the guide below and head directly to the repository's comprehensive [README](https://github.com/reclaimprotocol/zkfetch-cardano-example?tab=readme-ov-file#zkfetch-cardano-example).

## Testing

Run all tests with:

```sh
npm run test:all
```

Also, you can test wallet creation separately with:

```sh
npm run test:deno
```

Or proof requesting with:

```sh
npm run test:node
```

## Prerequisites and Setup

### System Requirements

- **Node.js**: Version 16+
- **Deno**: Latest stable version
- **Cardano Wallet**: For transaction signing and ADA funds
- **API Access**: Reclaim Protocol credentials and Blockfrost API key

### Environment Setup

1. **Install Dependencies**
    
    ```bash
    
    # Install Node.js dependencies
    npm install @reclaimprotocol/zk-fetch @reclaimprotocol/js-sdk
    
    # Install Deno (if not already installed)
    curl -fsSL https://deno.land/install.sh | sh
    
    ```
    
2. **Configure Environment Variables**
    
    ```bash
    # .env file
    RECLAIM_APP_ID=your_application_id
    RECLAIM_APP_SECRET=your_application_secret
    BLOCKFROST_API_KEY=your_blockfrost_key
    CARDANO_NETWORK=preprod# or mainnet
    
    ```
    
3. **Obtain Credentials**
    - **Reclaim Protocol**: Register at [Reclaim Developer Portal](https://dev.reclaimprotocol.org/)
    - **Blockfrost**: Get API key from [Blockfrost.io](https://blockfrost.io/)

## Deployment Guide

### Step 1: Wallet Creation and Funding

Create a Cardano wallet for transaction signing:

```tsx
// createWallet.ts
import { generateMnemonic, Wallet } from '@cardano-sdk/wallet';
import * as fs from 'fs';

async function createWallet() {
  const mnemonic = generateMnemonic();
  const wallet = await Wallet.createFromMnemonic(mnemonic);

  const addressDetails = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: mnemonic
  };

  fs.writeFileSync('addressDetails.json', JSON.stringify(addressDetails, null, 2));
  console.log('Wallet created successfully');
  console.log('Address:', wallet.address);
}

createWallet();

```

Fund the wallet using the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet).

### Step 2: Configure zkFetch Client

```jsx
// config.js
const { ReclaimClient } = require('@reclaimprotocol/zk-fetch');

const client = new ReclaimClient(
  process.env.RECLAIM_APP_ID,
  process.env.RECLAIM_APP_SECRET
);

module.exports = { client };

```

### Step 3: Deploy to Cardano Network

The deployment involves setting up your application to interact with both the Reclaim Protocol and Cardano network simultaneously.

## Integration Steps

### 1. Initialize zkFetch Integration

```jsx

const { ReclaimClient } = require('@reclaimprotocol/zk-fetch');
const client = new ReclaimClient('APP_ID', 'APP_SECRET');

```

### 2. Configure API Request

```jsx
// Public parameters (visible in proof)
const publicOptions = {
  method: 'GET',
  headers: {
    'accept': 'application/json'
  },
  responseMatches: [{
    type: 'regex',
    value: '"ada":{"usd":(?<price>.*?)}'
  }]
};

// Private parameters (hidden from verifiers)
const privateOptions = {
  headers: {
    'authorization': 'Bearer YOUR_API_KEY'
  },
  responseRedactions: [{
    jsonPath: '$.sensitive_data'
  }]
};

```

### 3. Execute zkFetch Request

```jsx

async function requestProof() {
  try {
    const proof = await client.zkFetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd',
      publicOptions,
      privateOptions
    );

// Save proof for Cardano transaction
    fs.writeFileSync('proof.json', JSON.stringify(proof, null, 2));
    return proof;
  } catch (error) {
    console.error('Proof generation failed:', error);
    throw error;
  }
}

```

### 4. Prepare Transaction for Cardano

```tsx

import { Transaction, TransactionBuilder } from '@cardano-sdk/core';
import { Blockfrost } from '@cardano-sdk/blockfrost';

async function prepareTransaction(proof: any, walletAddress: string) {
  const blockfrost = new Blockfrost({
    projectId: process.env.BLOCKFROST_API_KEY,
    network: 'preprod'
  
  const metadata = {
    674: {// Registered metadata label for zkFetch
      proof_id: proof.identifier,
      extracted_data: proof.extractedParameterValues,
      timestamp: proof.claimData.timestampS,
      provider: proof.claimData.provider
    }
  };

  const txBuilder = new TransactionBuilder();
  return txBuilder
    .setMetadata(metadata)
    .payToAddress(walletAddress, { lovelace: 1000000n })// Min ADA
    .build();
}

```

### 5. Submit Transaction to Cardano

```tsx

async function submitTransaction(signedTx: Transaction) {
  const blockfrost = new Blockfrost({
    projectId: process.env.BLOCKFROST_API_KEY,
    network: 'preprod'
  });

  try {
    const txHash = await blockfrost.transactionSubmit(signedTx);
    console.log('Transaction submitted:', txHash);
    return txHash;
  } catch (error) {
    console.error('Transaction submission failed:', error);
    throw error;
  }
}

```

## zkFetch Module Interactions

### Core Modules

### 1. Proof Generation Module

```jsx

class ProofGenerator {
  constructor(appId, appSecret) {
    this.client = new ReclaimClient(appId, appSecret);
  }

  async generateProof(url, publicOptions, privateOptions = {}) {
    const proof = await this.client.zkFetch(url, publicOptions, privateOptions);
    return this.validateProof(proof);
  }

  validateProof(proof) {
    if (!proof.identifier || !proof.signatures) {
      throw new Error('Invalid proof structure');
    }
    return proof;
  }
}

```

### 2. Cardano Integration Module

```tsx

class CardanoIntegrator {
  constructor(blockfrostKey: string, network: string = 'preprod') {
    this.blockfrost = new Blockfrost({
      projectId: blockfrostKey,
      network: network
    });
  }

  async storeProof(proof: any, wallet: Wallet): Promise<string> {
    const transaction = await this.buildTransaction(proof, wallet.address);
    const signedTx = await wallet.signTransaction(transaction);
    return await this.submitTransaction(signedTx);
  }

  private async buildTransaction(proof: any, address: string) {
// Transaction building logic
    return transaction;
  }
}

```

### 3. Verification Module

```jsx

class ProofVerifier {
  static async verifyProof(proof) {
    const { Reclaim } = require('@reclaimprotocol/js-sdk');
    return await Reclaim.verifySignedProof(proof);
  }

  static async verifyOnChain(txHash, expectedProofId) {
// Fetch transaction metadata from Cardano
    const metadata = await this.getTransactionMetadata(txHash);
    return metadata['674']?.proof_id === expectedProofId;
  }
}

```

### Module Integration Flow

```jsx

// Complete integration example
async function completeZkFetchFlow() {
// 1. Generate proof
  const proofGen = new ProofGenerator(APP_ID, APP_SECRET);
  const proof = await proofGen.generateProof(API_URL, publicOptions, privateOptions);

// 2. Verify proof locally
  const isValid = await ProofVerifier.verifyProof(proof);
  if (!isValid) throw new Error('Proof verification failed');

// 3. Store on Cardano
  const cardano = new CardanoIntegrator(BLOCKFROST_KEY);
  const txHash = await cardano.storeProof(proof, wallet);

// 4. Verify on-chain storage
  const onChainValid = await ProofVerifier.verifyOnChain(txHash, proof.identifier);

  return { proof, txHash, verified: onChainValid };
}

```

## API Reference

### ReclaimClient Methods

### `zkFetch(url, publicOptions, privateOptions?, retries?, retryInterval?)`

Executes a verified fetch request with zero-knowledge proof generation.

**Parameters:**

- `url` (string): Target API endpoint
- `publicOptions` (object): Request parameters visible in proof
- `privateOptions` (object): Hidden request parameters
- `retries` (number): Number of retry attempts (default: 1)
- `retryInterval` (number): Retry delay in milliseconds (default: 1000)

**Returns:** Promise<ProofObject>

### Public Options Structure

```jsx

{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: { [key: string]: string },
  body?: string,
  geoLocation?: string,// ISO country code
  responseMatches?: [{
    type: 'contains' | 'regex',
    value: string
  }]
}

```

### Private Options Structure

```jsx

{
  headers?: { [key: string]: string },
  cookieStr?: string,
  paramValues?: { [key: string]: string },
  responseRedactions?: [{
    jsonPath?: string,
    xPath?: string,
    regex?: string
  }]
}

```

### Cardano Integration Methods

### Transaction Metadata Schema

```json

{
  "674": {
    "proof_id": "string",
    "extracted_data": "object",
    "timestamp": "number",
    "provider": "string",
    "verification_url": "string"
  }
}

```

## Example Implementations

### Basic Price Oracle

```jsx
// priceOracle.js
async function createPriceOracle(symbol) {
  const proof = await client.zkFetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`,
    {
      method: 'GET',
      responseMatches: [{
        type: 'regex',
        value: `"${symbol}":{"usd":(?<price>.*?)}`
      }]
    }
  );

  const txHash = await storeOnCardano(proof);
  return { price: proof.extractedParameterValues.price, txHash };
}

```

### Sports Data Integration

```jsx
// sportsData.js
async function fetchMatchScore() {
  const proof = await client.zkFetch(
    "https://www.goal.com/en-in/live-scores",
    {
      method: "GET",
      responseMatches: [{
        type: "regex",
        value: '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>'
      }]
    },
    {
      responseRedactions: [{
        regex: '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>'
      }]
    }
  );

  return proof;
}

```

### Authentication-Required API

```jsx
// privateApi.js
async function fetchPrivateData(apiKey) {
  const proof = await client.zkFetch(
    'https://api.example.com/private-data',
    {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    },
    {
      headers: {
        'authorization': `Bearer ${apiKey}`
      }
    }
  );

  return proof;
}

```

## Troubleshooting

### Common Issues

### 1. Proof Generation Failures

**Problem**: zkFetch request fails with timeout or network errors
**Solution**:

- Increase retry attempts and interval
- Verify API endpoint accessibility
- Check response matching patterns

```jsx
// Robust proof generation
const proof = await client.zkFetch(
  url,
  publicOptions,
  privateOptions,
  5,// 5 retries
  5000// 5 second intervals
);

```

### 2. Transaction Submission Errors

**Problem**: Cardano transaction fails to submit
**Solution**:

- Verify wallet has sufficient ADA balance
- Check transaction size limits
- Validate metadata structure

### 3. Proof Verification Failures

**Problem**: Proof verification returns false
**Solution**:

- Ensure proof object is complete
- Check witness signatures
- Verify timestamp validity

### Debug Mode

Enable detailed logging for troubleshooting:

```jsx
// Enable debug logging
process.env.DEBUG = 'zkfetch:*';

// Or use console logging
const proof = await client.zkFetch(url, options).catch(error => {
  console.error('zkFetch Error:', error);
  throw error;
});

```

## Security Considerations

### Best Practices

1. **Private Key Management**
    - Never expose wallet private keys in code
    - Use environment variables for sensitive data
    - Implement proper key rotation for production
2. **API Key Protection**
    - Store API keys in privateOptions only
    - Regularly rotate API credentials
    - Monitor API usage for anomalies
3. **Proof Validation**
    - Always verify proofs before trusting data
    - Implement additional business logic validation
    - Check proof timestamps for freshness
4. **Network Security**
    - Use HTTPS endpoints only
    - Validate SSL certificates
    - Implement rate limiting

For additional support and updates, refer to:

- [Reclaim Protocol Documentation](https://docs.reclaimprotocol.org/)
- [Cardano Developer Resources](https://developers.cardano.org/)
- [zkFetch GitHub Repository](https://github.com/reclaimprotocol/zkfetch-cardano-example) 