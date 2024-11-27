import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
getToken(messaging, {vapidKey: "BGUoMK-WsLxKhK5N9PdElZRRUTw2YQlWxaeQUil9D8_1_7NuC1ms3Fp1rsDHcZq6fiYY4zEzlznsHEvU8mxFuQc"});

// Request permission for notifications
function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // Get token
          getToken(messaging, { vapidKey: "BGUoMK-WsLxKhK5N9PdElZRRUTw2YQlWxaeQUil9D8_1_7NuC1ms3Fp1rsDHcZq6fiYY4zEzlznsHEvU8mxFuQc" })
            .then((currentToken) => {
              if (currentToken) {
                console.log("Registration token obtained:", currentToken);
                // Send token to the server or use it as needed
              } else {
                console.log("No registration token available.");
              }
            })
            .catch((err) => {
              console.error("Error while retrieving token:", err);
            });
        } else {
          console.log("Notification permission denied.");
        }
      })
      .catch((err) => {
        console.error("Error while requesting permission:", err);
      });
  }
requestPermission();