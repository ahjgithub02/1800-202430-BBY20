firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // No user is signed in, redirect to login page
        window.location.assign("/html/login.html");
    } else if (user && window.location.href === "/index.html") {
        window.location.assign("/html/main.html");
    }
});

document.getElementById("logoutButton").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
        // Successfully signed out
        window.location.assign("/index.html");
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});

