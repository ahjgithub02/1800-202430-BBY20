firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // No user is signed in, redirect to login page
        window.location.assign("login.html");
    }
});

document.getElementById("logoutButton").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
        // Successfully signed out
        window.location.assign("/html/index.html");
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});