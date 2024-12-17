# X (Twitter) OAuth Integration

## Overview
Reclaim Protocol allows you to access X (formerly Twitter) user data through our OAuth integration. This guide will walk you through the setup process and available endpoints.

## Setup

### 1. Create Application
First, create a Reclaim OAuth App in the [Reclaim Devtool](https://dev.reclaimprotocol.org/new-application). During setup, you'll need to:
- Preview and configure your user experience
- Select X as your oauth identity provider
![Dashboard Application Creation 1](/apis/x/1.png)

- Select the data scopes you want to access
![Dashboard Application Creation 2](/apis/x/2.png)

- Configure your OAuth callback URLs and allowed origins
![Dashboard Application Creation 3](/apis/x/3.png)

- Get your client credentials (Client ID and Secret)

### 2. OAuth Integration

Choose the appropriate OAuth library based on your tech stack:
- [OAuth ReactJs](/oauth-react)
- [OAuth JS](/oauth-js)

Integrate Reclaim OAuth in your application using the library of choice and credentials obtained from the dashboard.

#### React Example
```tsx
import React from 'react';
import getReclaimAuth, { ReclaimUser } from 'identity-react';

const auth = getReclaimAuth(
  process.env.REACT_APP_RECLAIM_CLIENT_ID,
  process.env.REACT_APP_RECLAIM_CLIENT_SECRET,
  process.env.REACT_APP_RECLAIM_REDIRECT_URI
);

function App() {
  const [user, setUser] = React.useState<ReclaimUser | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await auth.signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div>
      {user ? (
      <div>
        <p>Welcome, {user.id}!</p>
        <pre>{JSON.stringify(user.userData, null, 2)}</pre>
        <pre>{JSON.stringify(user.additionalData, null, 2)}</pre>
      </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

### 3. API integration
When the user is authenticated you can access user data using API endpoints.
For example:
```tsx
fetch('https://identity.reclaimprotocol.org/api/v1/production/oauth/x/me', {
    method: 'GET',
    credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
```
This endpoint will return all the data a user has shared in the authentication phase.

### 4. API endpoints
```
/x/email
```
Returns user email used in X
```
"test@gmail.com"
```
---
```
/x/tweets
```
Returns a list of the users last 10 tweets
```
[
  {
    "id": "727848983297703936",
    "text": "tweet text example",
    "createdAt": "Wed May 04 13:14:55 +0000 2016", 
    "userName": "user name example"
  },
  {
    ...
  }
]
```
---
```
/x/user
```
Returns user profile data
```
{
  "name": "John Stevens",
  "screenName": "John Stevens", 
  "profileImage": "https://pbs.twimg.com/profile_images/1862853120600031232/L601BxP6_normal.jpg",
  "bio": "",
  "followersCount": 2,
  "followingCount": 69,
  "tweetCount": 3
}
```