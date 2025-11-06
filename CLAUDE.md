# Reclaim Protocol Documentation - Complete Reference Guide

This document provides a comprehensive overview of the entire Reclaim Protocol documentation, covering all SDKs, integration methods, and technical details found in the `/content/docs` directory.

## 🎯 Overview

Reclaim Protocol is a privacy-preserving identity and data verification protocol that enables users to prove facts about their online activity without revealing sensitive information. The protocol supports **2500+ data sources** and provides SDKs for web, mobile, and blockchain platforms.

### Key Features
- **Zero-Knowledge Proofs**: Verify data without exposing credentials
- **Cross-Platform SDKs**: Web, Mobile (iOS/Android/React Native/Flutter), and 15+ blockchains
- **Privacy-First**: End-to-end encryption with no credential storage
- **Seamless UX**: App Clips/Instant Apps - no installation required

## 🔑 Getting Started

### 1. Create Application
1. Register at [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org)
2. Create new application with name, description, and logo
3. Copy `APP_ID` and `APP_SECRET` (⚠️ Secret shown only once)
4. Add providers to your application
5. Note down `PROVIDER_ID` for each provider

### 2. Core Concepts

#### **Proofs**
- Cryptographic evidence of user's online activity
- Generated through secure TLS communication
- Verifiable without revealing sensitive data

#### **Attestors**
- Opaque proxies between users and target servers
- Cannot decrypt user data (end-to-end TLS encryption)
- Verify and sign claims without accessing sensitive info

#### **Providers**
- Define what to verify and how
- Components: `loginUrl`, `requestData`, `responseMatches`, `responseRedactions`
- Create custom providers via DevTool

#### **Verifier Apps**
- Native mobile apps via App Clips (iOS) / Instant Apps (Android)
- No installation required - access via URL
- Handle proof generation seamlessly

## 🌐 Web SDK Integration

### Frontend (React/JS)

#### Method 1: `triggerReclaimFlow()` (Recommended)
```javascript
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

const handleVerification = async () => {
  const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
  
  // Auto-detects environment (extension/QR/mobile)
  await reclaimProofRequest.triggerReclaimFlow();
  
  await reclaimProofRequest.startSession({
    onSuccess: (proofs) => {
      console.log('Verification successful:', proofs);
    },
    onError: (error) => {
      console.error('Verification failed', error);
    }
  });
};
```

#### Method 2: Manual QR Code
```javascript
const requestUrl = await reclaimProofRequest.getRequestUrl();
// Display as QR code or link
```

### Backend Verification

#### Node.js/Express
```javascript
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

app.post('/request-proof', async (req, res) => {
  const request = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
  request.setCallbackUrl(`${BASE_URL}/receive-proofs`);
  
  const { requestUrl, statusUrl } = await request.createVerificationRequest();
  res.json({ requestUrl, statusUrl });
});

app.post('/receive-proofs', async (req, res) => {
  const { claimData } = req.body;
  const isValid = await ReclaimProofRequest.verifyProof(claimData);
  // Process verified data
});
```

#### Python/FastAPI
```python
from reclaim_python_sdk import ReclaimProofRequest

@app.post("/request-proof")
async def request_proof():
    request = ReclaimProofRequest(APP_ID, APP_SECRET, PROVIDER_ID)
    request.set_callback(f"{BASE_URL}/receive-proofs")
    
    request_url = await request.get_request_url()
    status_url = request.get_status_url()
    return {"requestUrl": request_url, "statusUrl": status_url}
```

## 📱 Mobile SDKs

### React Native

#### Installation (Expo)
```bash
npx expo install @reclaimprotocol/inapp-rn-sdk
```

Add to `app.json` plugins:
```json
"plugins": [
  "@reclaimprotocol/inapp-rn-sdk"
]
```

#### Usage
```javascript
import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';

const handleVerify = async () => {
  const sessionId = await ReclaimVerification.startVerification({
    applicationId: APP_ID,
    applicationSecret: APP_SECRET,
    providerId: PROVIDER_ID,
  });
  
  // Handle success/failure
};
```

### iOS (Swift)

#### Installation
```swift
// Swift Package Manager
.package(url: "https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git", from: "0.3.0")

// CocoaPods
pod 'ReclaimInAppSdk', '~> 0.3.0'
```

#### Performance Fix Required
Add to Xcode scheme environment variables:
- Key: `GODEBUG`
- Value: `asyncpreemptoff=1`

### Android (Kotlin)

#### Setup
```groovy
// settings.gradle
repositories {
    maven { url "https://reclaim-inapp-sdk.s3.ap-south-1.amazonaws.com/android/0.3.0/repo" }
}

// build.gradle
implementation "org.reclaimprotocol:inapp_sdk:0.3.0"
```

#### AndroidManifest.xml
```xml
<activity
    android:name="org.reclaimprotocol.inapp_sdk.ReclaimActivity"
    android:theme="@style/Theme.ReclaimInAppSdk.LaunchTheme"
    />
<meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_ID" 
    android:value="YOUR_APP_ID" />
<meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_SECRET" 
    android:value="YOUR_APP_SECRET" />
```

## ⛓️ Blockchain Integration

### Supported Networks
- **EVM**: Ethereum, Polygon, Arbitrum, Optimism, BSC, Base, etc.
- **Non-EVM**: Solana, Cosmos, NEAR, Polkadot, Sui, Cardano, Stellar, Mina, and more

### Solidity Example
```solidity
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Reclaim.sol";
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Addresses.sol";

contract Attestor {
    address public reclaimAddress;
    
    constructor() {
        reclaimAddress = Addresses.ETHEREUM; // Or other network
    }
    
    function verifyProof(Reclaim.Proof memory proof) public view {
        Reclaim(reclaimAddress).verifyProof(proof);
        // Extract context fields if needed
        string memory steamId = Reclaim(reclaimAddress)
            .extractFieldFromContext(proof.claimInfo.context, '"SteamId":"');
    }
}
```

## 🔐 zkFetch SDK

Generate proofs of HTTP responses with privacy preservation.

### Basic Usage
```javascript
import { ReclaimClient } from '@reclaimprotocol/zk-fetch';

const client = new ReclaimClient(APP_ID, APP_SECRET);

// Public endpoint
const proof = await client.zkFetch('https://api.example.com/data', {
  method: 'GET',
  headers: { accept: 'application/json' }
});

// Private endpoint with hidden auth
const proofPrivate = await client.zkFetch(
  'https://api.example.com/private',
  { method: 'GET' }, // Public options
  { headers: { apiKey: 'secret-key' } } // Private options (hidden)
);
```

### Advanced Features
```javascript
// Response matching and redaction
const proof = await client.zkFetch(url, publicOpts, {
  responseMatches: [{
    type: 'regex',
    value: '\\{"price":(?<price>[\\d\\.]+)\\}'
  }],
  responseRedactions: [{
    jsonPath: '$.sensitive_data'
  }]
});

// Verify and transform for blockchain
const isValid = await Reclaim.verifySignedProof(proof);
const onchainProof = Reclaim.transformForOnchain(proof);
```

## 🎨 OAuth Integration

### React OAuth SDK
```javascript
import { useReclaimAuth } from '@reclaimprotocol/reclaim-react-sdk';

function App() {
  const { user, loading, error, signIn, signOut } = useReclaimAuth();
  
  const handleAuth = async () => {
    await signIn({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      providers: ['google-login', 'github-login']
    });
  };
}
```

## 🤖 AI Agent Integration

Email-based verification with A2A protocol compatibility:

```javascript
// Send verification email
await agent.sendVerificationEmail({
  to: 'user@example.com',
  verificationType: 'google-login'
});

// Check status
const status = await agent.checkVerificationStatus(verificationId);
```

## 🛠️ Advanced Features

### Verification Options
```javascript
{
  canDeleteCookiesBeforeVerificationStarts: true,  // Clear session storage
  canUseAttestorAuthenticationRequest: false,       // Authentication request
  claimCreationType: 'standalone',                  // or 'meChain'
  canAutoSubmit: true,                             // Auto-submit proof
  isCloseButtonVisible: true                       // Show close button
}
```

### Provider Structure
```javascript
{
  loginUrl: 'https://example.com/login',
  requestData: [{
    url: 'https://api.example.com/user',
    method: 'GET',
    responseMatches: [{
      type: 'contains',
      value: '"email":"{{email}}"'
    }],
    responseRedactions: [{
      jsonPath: '$.password',
      regex: 'token=[^&]*'
    }]
  }]
}
```

## 🚨 Security Considerations

1. **Never expose APP_SECRET in frontend code**
2. **Always verify proofs server-side in production**
3. **Use environment variables for credentials**
4. **Implement proper error handling**
5. **Set appropriate webhook URLs for async flows**

## 📚 Resources

- **Developer Portal**: [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org)
- **Provider Explorer**: [2500+ providers](https://dev.reclaimprotocol.org/explore)
- **Telegram Support**: [t.me/protocolreclaim](https://t.me/protocolreclaim)
- **Technical Blog**: [blog.reclaimprotocol.org](https://blog.reclaimprotocol.org)
- **GitHub**: [github.com/reclaimprotocol](https://github.com/reclaimprotocol)
- **Security Analysis**: [ePrint 2024/733](https://eprint.iacr.org/2024/733)

## 🎯 Common Use Cases

1. **Identity Verification**: Education, employment, professional credentials
2. **Financial Data**: Credit scores, income verification, accredited investor status
3. **Loyalty/Reputation**: Shopping history, platform activity, gaming achievements
4. **On-chain Oracles**: Bringing web2 data to smart contracts
5. **Access Control**: Gated content based on off-chain activity

## 💡 Best Practices

1. **Development Flow**:
   - Start with frontend quickstart
   - Implement backend verification
   - Add error handling and retry logic
   - Test with multiple providers

2. **Production Checklist**:
   - ✅ Backend proof verification
   - ✅ Secure credential management
   - ✅ Webhook implementation
   - ✅ Error tracking
   - ✅ Rate limiting

3. **User Experience**:
   - Show clear verification status
   - Provide fallback options
   - Handle edge cases gracefully
   - Optimize for mobile experience

This documentation represents the complete Reclaim Protocol ecosystem as documented in the `/content/docs` directory. Each section provides entry points into specific implementation details while maintaining the overall context of the protocol's capabilities and best practices.