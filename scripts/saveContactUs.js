firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // No user is signed in, redirect to login page
        window.location.assign("/html/login.html");
    } else if (user && window.location.href === "https://remindme-ce614.web.app/index.html") {
        window.location.assign("/html/main.html");
    }
});

// Auto-fill name and email when the user is authenticated
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Retrieve user details
        const displayName = user.displayName || ""; // Use Firebase profile name
        const email = user.email || ""; // Use Firebase profile email

        // Autofill the form fields
        document.getElementById('nameInput').value = displayName;
        document.getElementById('emailInput').value = email;
    } else {
        console.log("No user is signed in.");
    }
});

function saveContactUs() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const subject = document.getElementById('subjectInput').value;
    const comments = document.getElementById('commentInput').value;
    const thankYouModal = new bootstrap.Modal(document.getElementById('thankyouModal'));
    const close = document.getElementById('closeThankyou');

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
                thankYouModal.show();
                close.addEventListener('click', function(e) {
                    thankYouModal.close();
                })
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            console.log("No user is signed in.");
        }
    });
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get the user's display name
            const displayName = user.displayName || "Guest";

            // Update the thank-you message with the user's name
            const thankYouMessage = document.querySelector('.card-title');
            thankYouMessage.textContent = `Thanks for submitting your comment, ${displayName}!`;
        } else {
            console.log("No user is signed in.");
        }
    });
}); 
