
const firebaseConfig = {
    apiKey: "AIzaSyCr-tFeRpREksBAuds5SV3hHJeDoBrTYjs",
    authDomain: "remindme-ce614.firebaseapp.com",
    projectId: "remindme-ce614",
    storageBucket: "remindme-ce614.firebasestorage.app",
    messagingSenderId: "464351423320",
    appId: "1:464351423320:web:af0ee3b8ab0070cc55132d"
  };
  
//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
var currentUser;

insertNameFromFirestore();