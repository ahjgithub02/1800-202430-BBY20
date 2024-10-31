//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCr-tFeRpREksBAuds5SV3hHJeDoBrTYjs",
    authDomain: "remindme-ce614.firebaseapp.com",
    projectId: "remindme-ce614",
    storageBucket: "remindme-ce614.appspot.com",
    messagingSenderId: "464351423320",
    appId: "1:464351423320:web:1c1f597bb2b5b1c455132d"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
