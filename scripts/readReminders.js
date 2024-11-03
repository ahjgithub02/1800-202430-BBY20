function readReminders() {
    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable. 

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users/" + user.uid + "/reminders")
                .onSnapshot(
                    (allReminders) => {
                        document.getElementById("reminders-list").innerHTML = ""; // Clear the list to avoid duplicates
                        allReminders.forEach((doc) => {
                            var reminderText = doc.data().reminder;
                            var reminderPriority = doc.data().priority;
                            var reminderDueDate = doc.data().duetime;

                            let newreminder = reminderTemplate.content.cloneNode(true); // Clone the HTML template to create a new reminder (newreminder) that will be filled with Firestore data.

                            newreminder.querySelector('.reminderText').innerHTML = reminderText;
                            newreminder.querySelector('.reminderCheckbox').id = doc.id;
                            newreminder.querySelector('.priorityText').innerHTML = reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = reminderDueDate;

                            document.getElementById("reminders-list").appendChild(newreminder);

                            console.log(doc.id, " => ", doc.data());
                            console.log("Reminders have been loaded");
                        });
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });

}