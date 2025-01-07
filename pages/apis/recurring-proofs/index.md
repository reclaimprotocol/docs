# Recurring Proofs with Push Notifications

## Overview

Reclaim Protocol allows you to streamline and automate proof verification processes by leveraging its SDK and notification system. This guide will walk you through the process of implementing recurring proofs and utilizing available endpoints to enhance user interactions.

## How To Start?

### 1. **Marking an Application as Recurrent**

In [Reclaim Developer Portal](https://dev.reclaimprotocol.org), when creating a new application, you can enable the **Recurring Proofs** feature by toggling the switch labeled "Recurring Proofs." This setting ensures the backend tracks applications designed for recurring proof verification.

---

### 2. **Generating a New Proof**

When generating a proof using the Reclaim SDK, follow these steps to access the session status:

### Example Code:

```jsx
const status = reclaimProofRequest.getStatusUrl();
```

The `getStatusUrl()` method retrieves the session status URL. In the session status response, you will find the following key information:

```json
{
  "fcmToken": "e613e****a00b"
}
```

### Save the `fcmToken`

You must securely save the `fcmToken` in your preferred storage method. This token is essential for sending notifications to users to renew their proofs.

---

### 3. **Sending Notifications to Users**

To notify users about renewing their proof, use the following process:

### POST Endpoint:

```
POST https://api.reclaimprotocol.org/api/push/<notificationId>

```

Replace `<notificationId>` with the `fcmToken` you obtained earlier.

### Request Body:

```json
{
  "appId": "0xD2****8F60D5",
  "providerId": "f9f38****9762",
  "appSecret": "0x0f2*****907d714"
}
```

This payload includes:

- `appId`: The unique identifier for your application.
- `providerId`: The identifier of the provider for which proof is being requested.
- `appSecret`: A secure secret key linked to your application.

### Example Response:

When the notification is sent successfully, you will receive the following response:

```json
{
  "message": "Notification sent successfully",
  "fcmResponse": "projects/reclaim-mobile-fcm-686b1/messages/0:1736260790660448%89c2ac2a89c2ac2a",
  "statusUrl": "https://api.reclaimprotocol.org/api/sdk/session/4ae879f8-77f1-4d2f-9f8c-783e8e4419bd",
  "isSuccess": true
}
```

- `message`: Confirms the notification has been sent.
- `fcmResponse`: Provides details about the Firebase message sent.
- `statusUrl`: A URL to monitor the user's progress.
- `isSuccess`: Indicates whether the operation was successful.

---

### 4. **User Interaction with Notifications**

The user experience for proof notifications is straightforward:

1. **Receive Notification:** The user receives a notification on their device with the following details:
   - **Title:** `"<application name> is requesting a proof of <provider name>"`
   - **Body:** `"Tap to open the app and regenerate your proof."`
2. **Tap to Renew Proof:**
   - Upon tapping the notification, the app (via App Clip or Instant App) opens automatically.
   - The proof regeneration process completes without requiring any further user action.

---

### Summary

The recurring proofs feature is designed to streamline proof verification for both developers and users. By leveraging Firebase Cloud Messaging and the Reclaim SDK, developers can automate proof renewal notifications while ensuring a seamless user experience.
