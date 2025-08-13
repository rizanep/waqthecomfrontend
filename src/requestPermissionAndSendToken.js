// requestPermissionAndSendToken.js

import { messaging, getToken } from "./firebase-config";

// Replace with your VAPID key (Web Push Certificates → Key pair → Public key)
const VAPID_KEY = "YOUR_VAPID_KEY";

export const requestNotificationPermission = async (authToken) => {
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (token) {
      console.log("FCM token:", token);

      // Send token to your backend
      await fetch("http://127.0.0.1:8000/fcm-devices/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,  // Your JWT token here
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registration_token: token }),
      });

      console.log("Token sent to backend");
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }   
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};
