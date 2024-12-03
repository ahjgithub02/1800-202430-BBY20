function completeReminder(id, docId) {

    const personal = localStorage.getItem("personal");
    if (personal == "true") {
        console.log("It is a personal reminder");
        completeListReminder(id, docId);
    } else {
        console.log("It is a shared reminder")
        completeSharedListReminder(id, docId);
    }
}

// Copies checked reminder from user's personal list and moves it to the completed collection, removing it from the reminders list
function completeListReminder(listId, reminderId) {
    console.log(listId + ": " + reminderId);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reference to the reminder document
            const reminderDoc = db.doc("users/" + user.uid + "/lists/" + listId + "/reminders/" + reminderId);
            // Reference to the completed collection of the list
            const completedCollection = db.collection("users/" + user.uid + "/lists/" + listId + "/completed");

            // Gets the data of the reminder
            reminderDoc.get()
                .then((reminder) => {
                    if (reminder.exists) {
                        // Extract data
                        const reminderText = reminder.data().reminder;
                        const reminderPriority = reminder.data().priority;
                        const reminderDueTime = reminder.data().duetime;

                        // Add to completed collection
                        return completedCollection.add({
                            reminder: reminderText,
                            priority: reminderPriority,
                            duetime: reminderDueTime,
                            id: reminderId

                        });
                    } else {
                        console.log("Reminder does not exist.");
                    }
                })
                .then(() => {
                    console.log("Reminder moved to completed collection.");

                    reminderDoc.delete().then(() => {
                        console.log("Reminder successfully deleted from reminders collection!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch((error) => {
                    console.error("Error completing reminder: ", error);
                });
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

//Copies checked reminder from a shared list and moves it to the completed collection, removing it from the reminders list
function completeSharedListReminder(listId, reminderId) {
    console.log(listId + ": " + reminderId);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reference to the reminder document
            const reminderDoc = db.doc("servers/" + listId + "/reminders/" + reminderId);
            // Reference to the completed collection of the list
            const completedCollection = db.collection("servers/" + listId + "/completed");

            // Gets the data of the reminder
            reminderDoc.get()
                .then((reminder) => {
                    if (reminder.exists) {
                        // Extract data
                        const reminderText = reminder.data().reminder;
                        const reminderPriority = reminder.data().priority;
                        const reminderDueTime = reminder.data().duetime;

                        // Add to completed collection
                        return completedCollection.add({
                            reminder: reminderText,
                            priority: reminderPriority,
                            duetime: reminderDueTime,
                            id: reminderId

                        });
                    } else {
                        console.log("Reminder does not exist.");
                    }
                })
                .then(() => {
                    console.log("Reminder moved to completed collection.");

                    reminderDoc.delete().then(() => {
                        console.log("Reminder successfully deleted from reminders collection!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch((error) => {
                    console.error("Error completing reminder: ", error);
                });
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function displayCompletedReminders() {

    const id = localStorage.getItem("listId");
    const personal = localStorage.getItem("personal");
    if (personal == "true") {
        console.log("It is a personal reminder");
        displayPersonalCompletedReminders(id);
    } else {
        console.log("It is a shared reminder")
        displaySharedCompletedReminders(id);
    }
}

function displayPersonalCompletedReminders(id) {

    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable.
    document.getElementById("addReminderButton").classList.remove("d-flex");
    document.getElementById("addReminderButton").style.display = "none";

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users/" + user.uid + "/lists/" + id + "/completed")
                .onSnapshot(
                    (allReminders) => {
                        let numOfReminders = 0;
                        document.getElementById("reminders-list").innerHTML = ""; // Clear the list to avoid duplicates
                        allReminders.forEach((doc) => {
                            numOfReminders++;

                            var reminderText = doc.data().reminder;
                            var reminderPriority = doc.data().priority;
                            var reminderDueDate = doc.data().duetime;

                            let newreminder = reminderTemplate.content.cloneNode(true); // Clone the HTML template to create a new reminder (newreminder) that will be filled with Firestore data.

                            newreminder.querySelector('.reminderText').innerHTML = reminderText;
                            newreminder.querySelector('.form-check').id = doc.id;
                            newreminder.querySelector('.reminderCheckbox').checked = true;
                            newreminder.querySelector('.reminderCheckbox').addEventListener("click", () => undoCompletedReminder(id, doc.id));
                            newreminder.querySelector('.bt').remove();
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;
                            newreminder

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });
                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log("completed reminders have been loaded");


        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function displaySharedCompletedReminders(id) {

    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable.
    document.getElementById("addReminderButton").classList.remove("d-flex");
    document.getElementById("addReminderButton").style.display = "none";

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("servers/" + id + "/completed")
                .onSnapshot(
                    (allReminders) => {
                        let numOfReminders = 0;
                        document.getElementById("reminders-list").innerHTML = ""; // Clear the list to avoid duplicates
                        allReminders.forEach((doc) => {
                            numOfReminders++;

                            var reminderText = doc.data().reminder;
                            var reminderPriority = doc.data().priority;
                            var reminderDueDate = doc.data().duetime;

                            let newreminder = reminderTemplate.content.cloneNode(true); // Clone the HTML template to create a new reminder (newreminder) that will be filled with Firestore data.

                            newreminder.querySelector('.reminderText').innerHTML = reminderText;
                            newreminder.querySelector('.form-check').id = doc.id;
                            newreminder.querySelector('.reminderCheckbox').checked = true;
                            newreminder.querySelector('.reminderCheckbox').addEventListener("click", () => undoCompletedReminder(id, doc.id));
                            newreminder.querySelector('.bt').remove();
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });

                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log("completed reminders have been loaded");


        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function undoCompletedReminder(listId, reminderId) {
    console.log("undone the reminder with id: " + reminderId + "in list: " + listId);

    const id = localStorage.getItem("listId");
    const personal = localStorage.getItem("personal");
    if (personal == "true") {
        console.log("It is a personal reminder");

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Reference to the completed reminder document
                const completedReminderDoc = db.doc("users/" + user.uid + "/lists/" + listId + "/completed/" + reminderId);
                // Reference to the reminder collection of the list
                const reminderCollection = db.collection("users/" + user.uid + "/lists/" + listId + "/reminders");

                // Gets the data of the reminder
                completedReminderDoc.get()
                    .then((reminder) => {
                        if (reminder.exists) {
                            // Extract data
                            const reminderText = reminder.data().reminder;
                            const reminderPriority = reminder.data().priority;
                            const reminderDueTime = reminder.data().duetime;

                            // Add to completed collection
                            return reminderCollection.add({
                                reminder: reminderText,
                                priority: reminderPriority,
                                duetime: reminderDueTime,
                                id: reminderId

                            });
                        } else {
                            console.log("Reminder does not exist.");
                        }
                    })
                    .then(() => {
                        console.log("Reminder moved to completed collection.");

                        completedReminderDoc.delete().then(() => {
                            console.log("Reminder successfully deleted from reminders collection!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error completing reminder: ", error);
                    });
            } else {
                console.log("No user is logged in."); // Log a message when no user is logged in
            }
        });

    } else {
        console.log("It is a shared reminder")

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Reference to the completed reminder document
                const completedReminderDoc = db.doc("servers/" + listId + "/completed/" + reminderId);
                // Reference to the reminder collection of the list
                const reminderCollection = db.collection("servers/" + listId + "/reminders");

                // Gets the data of the reminder
                completedReminderDoc.get()
                    .then((reminder) => {
                        if (reminder.exists) {
                            // Extract data
                            const reminderText = reminder.data().reminder;
                            const reminderPriority = reminder.data().priority;
                            const reminderDueTime = reminder.data().duetime;

                            // Add to completed collection
                            return reminderCollection.add({
                                reminder: reminderText,
                                priority: reminderPriority,
                                duetime: reminderDueTime,
                                id: reminderId

                            });
                        } else {
                            console.log("Reminder does not exist.");
                        }
                    })
                    .then(() => {
                        console.log("Reminder moved to completed collection.");

                        completedReminderDoc.delete().then(() => {
                            console.log("Reminder successfully deleted from reminders collection!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error completing reminder: ", error);
                    });
            } else {
                console.log("No user is logged in."); // Log a message when no user is logged in
            }
        });
    }
}