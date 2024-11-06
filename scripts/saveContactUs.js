var currentUser; //points to the document of the user who is logged in

function emailCommentInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("contacts").doc(user.uid);
            currentUser.get()
                .then(userDoc => {
                    if (userDoc.exists) { // Ensure the document exists
                        let emailAddress = userDoc.data().email;
                        let subjectLine = userDoc.data().subject;
                        let comments = userDoc.data().comment;

                        // Populate the form fields if data exists
                        if (emailAddress != null) {
                            document.getElementById("emailInput").value = emailAddress;
                        }
                        if (subjectLine != null) {
                            document.getElementById("subjectInput").value = subjectLine;
                        }
                        if (comments != null) {
                            document.getElementById("commentInput").value = comments;
                        }
                    } else {
                        console.log("No document found for this user");
                    }
                })
                .catch(error => {
                    console.error("Error fetching document:", error);
                });
        } else {
            console.log("No user is signed in.");
        }
    });
}


// Call this function to populate the form with data when the page loads
emailCommentInfo();

// Function to save updated data to Firestore
function saveContactUs() {
    let emailAddress = document.getElementById('emailInput').value;
    let subjectLine = document.getElementById('subjectLineInput').value;
    let comments = document.getElementById('commentInput').value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const currentUserDocRef = db.collection("contacts").doc(user.uid); // Reference to the user document

            // Try to fetch the document first
            currentUserDocRef.get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        // Document exists, update it
                        currentUserDocRef.update({
                            email: emailAddress,
                            subject: subjectLine,
                            comments: comments
                        })
                        .then(() => {
                            console.log("Document successfully updated!");
                            window.location.href = './thankYou.html'; // Redirect after successful update
                        })
                        .catch(error => {
                            console.error("Error updating document:", error);
                        });
                    } else {
                        // Document doesn't exist, create it
                        currentUserDocRef.set({
                            email: emailAddress,
                            subject: subjectLine,
                            comments: comments
                        })
                        .then(() => {
                            console.log("Document successfully created!");
                            window.location.href = './thankYou.html'; // Redirect after successful creation
                        })
                        .catch(error => {
                            console.error("Error creating document:", error);
                        });
                    }
                })
                .catch(error => {
                    console.error("Error checking document:", error);
                });
        } else {
            console.log("No user is signed in.");
        }
    });
}


