function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
insertNameFromFirestore();

function insertAddressFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                let userAddress = userDoc.data().address;
                console.log(userAddress);
                document.getElementById("address-goes-here").innerText = userAddress;
            })
        }   else {
            console.log("No user is logged in.");
        }
    })
}

insertAddressFromFirestore();

function insertPhoneNumberFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                let userPhone = userDoc.data().phone;
                console.log(userPhone);
                document.getElementById("phone-number-goes-here").innerText = userPhone;
            })
        }   else {
            console.log("No user is logged in.");
        }
    })
}

insertPhoneNumberFromFirestore();

function insertSchoolFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                let userSchool = userDoc.data().school;
                console.log(userSchool);
                document.getElementById("school-goes-here").innerText = userSchool;
            })
        }   else {
            console.log("No user is logged in.");
        }
    })
}

insertSchoolFromFirestore();

function insertEmailFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                let userEmail = userDoc.data().email;
                console.log(userEmail);
                document.getElementById("email-goes-here").innerText = userEmail;
            })
        }   else {
            console.log("No user is logged in.");
        }
    })
}

insertEmailFromFirestore();