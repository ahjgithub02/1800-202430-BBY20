function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = "Welcome, " + userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
var currentUser;

insertNameFromFirestore();

function handleSideBarButtons() {
    const CALCButton = document.getElementById("CLACButton");
    const RemindersButton = document.getElementById("remindersButton");
    const reminders = document.querySelectorAll(".reminders");
    const CLAC = document.getElementById("CLAC");
    const main = document.querySelector(".main");

    if (!CALCButton || !CLAC || !main) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            CALCButton.addEventListener('click', () => {
                reminders.forEach(reminder => {
                    reminder.classList.add("hidden");
                });
                main.style.marginLeft = '0%';
                CLAC.style.display = 'block';
            });

            RemindersButton.addEventListener('click', () => {
                reminders.forEach(reminder => {
                    reminder.classList.remove("hidden");
                });
                main.style.marginLeft = '4rem';
                CLAC.style.display = 'none';
            });
        }
    });
}
handleSideBarButtons();

