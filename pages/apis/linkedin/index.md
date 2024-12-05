# X (Twitter) OAuth Integration

## Overview
Reclaim Protocol allows you to access LinkedIn user data through our OAuth integration. This guide will walk you through the setup process and available endpoints.

## Setup

### 1. Create Application
First, create a Reclaim OAuth App in the [Reclaim Devtool](https://dev.reclaimprotocol.org/new-application). During setup, you'll need to:
- Preview and configure your user experience
- Select LinkedIn as your oauth identity provider
![Dashboard Application Creation 1](/apis/linkedin/1.png)

- Select the data scopes you want to access
![Dashboard Application Creation 2](/apis/linkedin/2.png)

- Configure your OAuth callback URLs and allowed origins
![Dashboard Application Creation 3](/apis/linkedin/3.png)

- Get your client credentials (Client ID and Secret)

### 2. OAuth Integration

Choose the appropriate OAuth library based on your tech stack:
- [OAuth ReactJs](/oauth-react)
- [OAuth JS](/oauth-js)

Integrate Reclaim OAuth in your application using the library of choice and credentials obtained from the dashboard.

#### React Example
```tsx
import React from 'react';
import getReclaimAuth from 'identity-react';

const auth = getReclaimAuth(
  process.env.REACT_APP_RECLAIM_CLIENT_ID,
  process.env.REACT_APP_RECLAIM_CLIENT_SECRET,
  process.env.REACT_APP_RECLAIM_REDIRECT_URI
);

function App() {
  const [user, setUser] = React.useState(null);

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
          <pre>{JSON.stringify(user.data, null, 2)}</pre>
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
fetch('https://identity.reclaimprotocol.org/v1/linkedin/me', {
    method: 'GET',
    credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
```
This endpoint will return all the data a user has shared in the authentication phase.

### 4. API endpoints
```
/linkedin/username
```
Returns user username used in LinkedIn
```
"test-username"
```
---
```
/linkedin/experience
```
Returns a list of user past experiences
```
[
  {
    "jobTitle": "Software Engineer",
    "companyName": "Company 33",
    "startDate": "Jul 2024 -",
    "endDate": "Present", 
    "location": "",
    "description": "",
    "logoURL": "https://media.licdn.com/dms/image/v2/D560BAQEpPtlxuF-xOw/company-logo_100_100/company-logo_100_100/0/1667322297337/questbookapp_logo?e=1741219200&v=beta&t=SM5q75oaDxYbT5ca8Hx1DrDXllZE_vLBeYyNIHob10g"
  }
  {
    ...
  }
]
```
---
```
/linkedin/about
```
Returns the users about section
```
{
  "aboutText": "I am a software engineer"
}
```
---
```
/linkedin/education
```
Returns a list of user past education
```
[
  {
    "schoolName": "Harvard University",
    "degree": "2 Computer Engineering", 
    "years": "2021 - 2025",
    "logoUrl": "https://media.licdn.com/dms/image/v2/D4D0BAQGcw6iQA9QKow/company-logo_100_100/company-logo_100_100/0/1682320663093/innopolis_university_logo?e=1741219200&v=beta&t=QdGcb8Byalg8PN23VKmKDiPvxkHxv44QDbKcf55zQ6s",
    "description": "N/A"
  },
  ...
]
```
---
```
/linkedin/profile
```
Returns user profile data
```
{
    "fullName": "John Stevens",
    "headline": "Software Engineer at Company 33",
    "collegeFromHeroSection": "Harvard University",
    "geoLocation": "Boston, Massachusetts, United States",
    "backgroundImageUrl": "https://static.licdn.com/aero-v1/sc/h/55k1z8997gh8dwtihm11aajyq",
    "profilePictureUrl": "https://media.licdn.com/dms/image/v2/D4D03AQGu4gp1AqB5uw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1663932948098?e=2147483647&v=beta&t=cFZGnFqsW-7gV31RiAcIsCBvzAduIpeEyNr-pcEosik"
}
```
---
```
/linkedin/recommendation
```
Returns a list of user recommendations
```
[
  {
    "recommendationText": "John is a great software engineer",
    "recommendationFrom": "Jane Doe",
    "recommendationDate": "2024-01-01"
  }
]
```
---
```
/linkedin/skills
```
Returns a list of user skills
```
["Python", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git", "Docker", "Kubernetes"]
```
---
```
/linkedin/name
```
Returns user full name
```
"John Stevens"
```
---
```
/linkedin/connectionCount
```
Returns user connection count
```
"185 connections"
```
---
```
/linkedin/followersCount
```
Returns user followers count
```
"185 followers"
```