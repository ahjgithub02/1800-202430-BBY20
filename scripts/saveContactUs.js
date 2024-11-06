function saveContactUs() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const subject = document.getElementById('subjectInput').value;
    const comments = document.getElementById('commentInput').value;

    // Assuming the user is authenticated and `currentUser` is defined
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const currentUser = db.collection("contacts").doc(user.uid);
            
            currentUser.set({
                name: name,
                email: email,
                subject: subject,
                comments: comments
            })
            .then(() => {
                console.log("Document successfully written!");
                window.location.href = './thankYou.html';
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            console.log("No user is signed in.");
        }
    });
}

