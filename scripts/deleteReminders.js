function deleteReminder(element) {

    const personal = localStorage.getItem("personal");
    const listId = localStorage.getItem("listId");
    if (personal == "true") {
        deletePersonalReminder(listId, element.parentElement.id);
    } else {
        deleteSharedReminder(listId, element.parentElement.id);
    }
}

function deletePersonalReminder(listId, reminderId) {
    console.log(reminderId);

    console.log("It is a personal reminder: " + reminderId + "in list: " + listId);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reference to the reminder document
            const reminderDoc = db.doc("users/" + user.uid + "/lists/" + listId + "/reminders/" + reminderId);
            // Reference to the deleted collection of the list
            const deletedCollection = db.collection("users/" + user.uid + "/lists/" + listId + "/deleted");

            // Gets the data of the reminder
            reminderDoc.get()
                .then((reminder) => {
                    if (reminder.exists) {
                        // Extract data
                        const reminderText = reminder.data().reminder;
                        const reminderPriority = reminder.data().priority;
                        const reminderDueTime = reminder.data().duetime;
                        // const reminderCreator = reminder.data().creator;

                        // Add to deleted collection
                        return deletedCollection.add({
                            reminder: reminderText,
                            priority: reminderPriority,
                            duetime: reminderDueTime,
                            id: reminderId
                            // creator: reminderCreator

                        });
                    } else {
                        console.log("Reminder does not exist.");
                    }
                })
                .then(() => {
                    console.log("Reminder moved to deleted collection.");

                    reminderDoc.delete().then(() => {
                        console.log("Reminder successfully deleted from reminders collection!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch((error) => {
                    console.error("Error deleted reminder: ", error);
                });
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function deleteSharedReminder(listId, reminderId) {
    console.log("It is a shared reminder: " + reminderId);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reference to the reminder document
            const reminderDoc = db.doc("servers/" + listId + "/reminders/" + reminderId);
            // Reference to the deleted collection of the list
            const deletedCollection = db.collection("servers/" + listId + "/deleted");

            // Gets the data of the reminder
            reminderDoc.get()
                .then((reminder) => {
                    if (reminder.exists) {
                        // Extract data
                        const reminderText = reminder.data().reminder;
                        const reminderPriority = reminder.data().priority;
                        const reminderDueTime = reminder.data().duetime;
                        // const reminderCreator = reminder.data().creator;

                        // Add to deleted collection
                        return deletedCollection.add({
                            reminder: reminderText,
                            priority: reminderPriority,
                            duetime: reminderDueTime,
                            id: reminderId
                            // creator: reminderCreator

                        });
                    } else {
                        console.log("Reminder does not exist.");
                    }
                })
                .then(() => {
                    console.log("Reminder moved to deleted collection.");

                    reminderDoc.delete().then(() => {
                        console.log("Reminder successfully deleted from reminders collection!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch((error) => {
                    console.error("Error deleted reminder: ", error);
                });
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function displayDeletedReminders() {

    const id = localStorage.getItem("listId");
    const personal = localStorage.getItem("personal");
    if (personal == "true") {
        console.log("It is a personal reminder");
        displayPersonalDeletedReminders(id);
    } else {
        console.log("It is a shared reminder")
        displaySharedDeletedReminders(id);
    }
}

function displayPersonalDeletedReminders(id) {

    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable.
    document.getElementById("addReminderButton").classList.remove("d-flex");
    document.getElementById("addReminderButton").style.display = "none";

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users/" + user.uid + "/lists/" + id + "/deleted")
                .onSnapshot(
                    (allReminders) => {
                        let numOfReminders = 0;
                        document.getElementById("reminders-list").innerHTML = ""; // Clear the list to avoid duplicates
                        allReminders.forEach((doc) => {
                            numOfReminders++;

                            var reminderText = doc.data().reminder;
                            var reminderPriority = doc.data().priority;
                            var reminderDueDate = doc.data().duetime;
                            // var reminderCreator = doc.data().creator;

                            let newreminder = reminderTemplate.content.cloneNode(true); // Clone the HTML template to create a new reminder (newreminder) that will be filled with Firestore data.

                            newreminder.querySelector('.reminderText').innerHTML = reminderText;
                            newreminder.querySelector('.form-check').id = doc.id;
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;
                            // newreminder.querySelector('.reminderCreator').innerHTML = "Creator: " + reminderCreator;
                            newreminder.querySelector('.reminderCheckbox').disabled = true;
                            newreminder.querySelector('.bt').removeAttribute("onclick");
                            // newreminder.querySelector('.bt').setAttribute('onclick' , 'deleteReminderPermenant(this)');


                            const restoreButton = document.createElement('button');
                            restoreButton.className = 'bt plus-button reminderRestore';
                            restoreButton.setAttribute('onclick', 'undodeletedReminder(this)');
                            restoreButton.setAttribute('title', 'Restore reminder');

                            const icon = document.createElement('i');
                            icon.className = 'class="bi bi-arrow-clockwise';

                            restoreButton.appendChild(icon);
                            newreminder.querySelector('hr').remove();
                            newreminder.querySelector('.form-check').appendChild(restoreButton);
                            const hr = document.createElement('hr');
                            newreminder.appendChild(hr);


                            document.getElementById("reminders-list").appendChild(newreminder);
                        });
                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log("deleted reminders have been loaded");


        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function displaySharedDeletedReminders(id) {
    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable.
    document.getElementById("addReminderButton").classList.remove("d-flex");
    document.getElementById("addReminderButton").style.display = "none";

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("servers/" + id + "/deleted")
                .onSnapshot(
                    (allReminders) => {
                        let numOfReminders = 0;
                        document.getElementById("reminders-list").innerHTML = ""; // Clear the list to avoid duplicates
                        allReminders.forEach((doc) => {
                            numOfReminders++;

                            var reminderText = doc.data().reminder;
                            var reminderPriority = doc.data().priority;
                            var reminderDueDate = doc.data().duetime;
                            // var reminderCreator = doc.data().creator;

                            let newreminder = reminderTemplate.content.cloneNode(true); // Clone the HTML template to create a new reminder (newreminder) that will be filled with Firestore data.

                            newreminder.querySelector('.reminderText').innerHTML = reminderText;
                            newreminder.querySelector('.form-check').id = doc.id;
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;
                            // newreminder.querySelector('.reminderCreator').innerHTML = "Creator: " + reminderCreator;
                            newreminder.querySelector('.reminderCheckbox').disabled = true;
                            newreminder.querySelector('.bt').removeAttribute("onclick");
                            // newreminder.querySelector('.bt').setAttribute('onclick', 'deleteReminderPermenant(this)');

                            const restoreButton = document.createElement('button');
                            restoreButton.className = 'bt plus-button reminderRestore';
                            restoreButton.setAttribute('onclick', 'undodeletedReminder(this)');
                            restoreButton.setAttribute('title', 'Restore reminder');

                            const icon = document.createElement('i');
                            icon.className = 'class="bi bi-arrow-clockwise';

                            restoreButton.appendChild(icon);
                            newreminder.querySelector('hr').remove();
                            newreminder.querySelector('.form-check').appendChild(restoreButton);
                            const hr = document.createElement('hr');
                            newreminder.appendChild(hr);

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });

                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log("deleted reminders have been loaded");


        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function undodeletedReminder(element) {
    const listId = localStorage.getItem("listId");

    const reminderId = element.parentElement.id;

    console.log("undone the reminder with id: " + reminderId + " in list: " + listId);

    const personal = localStorage.getItem("personal");
    if (personal == "true") {
        console.log("It is a personal reminder");

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Reference to the deleted reminder document
                const deletedReminderDoc = db.doc("users/" + user.uid + "/lists/" + listId + "/deleted/" + reminderId);
                // Reference to the reminder collection of the list
                const reminderCollection = db.collection("users/" + user.uid + "/lists/" + listId + "/reminders");

                // Gets the data of the reminder
                deletedReminderDoc.get()
                    .then((reminder) => {
                        if (reminder.exists) {
                            // Extract data
                            const reminderText = reminder.data().reminder;
                            const reminderPriority = reminder.data().priority;
                            const reminderDueTime = reminder.data().duetime;
                            // const reminderCreator = reminder.data().creator;

                            // Add to deleted collection
                            return reminderCollection.add({
                                reminder: reminderText,
                                priority: reminderPriority,
                                duetime: reminderDueTime,
                                id: reminderId
                                // creator: reminderCreator

                            });
                        } else {
                            console.log("Reminder does not exist.");
                        }
                    })
                    .then(() => {
                        console.log("Reminder moved to deleted collection.");

                        deletedReminderDoc.delete().then(() => {
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
                // Reference to the deleted reminder document
                const deletedReminderDoc = db.doc("servers/" + listId + "/deleted/" + reminderId);
                // Reference to the reminder collection of the list
                const reminderCollection = db.collection("servers/" + listId + "/reminders");

                // Gets the data of the reminder
                deletedReminderDoc.get()
                    .then((reminder) => {
                        if (reminder.exists) {
                            // Extract data
                            const reminderText = reminder.data().reminder;
                            const reminderPriority = reminder.data().priority;
                            const reminderDueTime = reminder.data().duetime;
                            // const reminderCreator = reminder.data().creator;

                            // Add to deleted collection
                            return reminderCollection.add({
                                reminder: reminderText,
                                priority: reminderPriority,
                                duetime: reminderDueTime,
                                id: reminderId
                                // creator: reminderCreator

                            });
                        } else {
                            console.log("Reminder does not exist.");
                        }
                    })
                    .then(() => {
                        console.log("Reminder moved to deleted collection.");

                        deletedReminderDoc.delete().then(() => {
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

function deleteReminderPermenant(element) {
    const listId = localStorage.getItem("listId");

    const reminderId = element.parentElement.id;

    console.log("Deleted the reminder with id: " + reminderId + " in list: " + listId + " from database.");

    const personal = localStorage.getItem("personal");

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log("No user is logged in.");
            return;
        }

        const dbPath = personal === "true"
            ? "users/" + user.uid + "/lists/" + listId + "/deleted/" + reminderId
            : "servers/" + listId + "/deleted/" + reminderId;

        db.doc(dbPath)
            .delete()
            .then(() => {
                console.log("Reminder successfully deleted from database!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    });
}

function deleteListPermenant() {
    const listId = localStorage.getItem("listId");
    const personal = localStorage.getItem("personal");

    if (listId === "DueToday" || listId === "DueThisWeek" || listId === "Overdue") {
        console.error("Non deletable list.");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log("No user is logged in.");
            return;
        }
        var dbPath = "";

        if (personal === "false") {
            const dbPath = "servers/" + listId;
            db.doc(dbPath).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data(); // Retrieve the document's data

                        if (data.ownerId !== user.uid) {
                            console.log("The ownerId does not match the user's uid.");

                            // Fetch joinedServersArray from the user's document
                            const userDocPath = "users/" + user.uid;
                            db.doc(userDocPath).get()
                                .then((userDoc) => {
                                    if (userDoc.exists) {
                                        const userData = userDoc.data();
                                        const joinedServersArray = userData.joinedServersArray;

                                        if (Array.isArray(joinedServersArray)) {
                                            console.log("Joined Servers Array:", joinedServersArray);

                                            // Remove the element locally
                                            const updatedArray = joinedServersArray.filter(item => item !== listId);

                                            // Update Firestore with the modified array
                                            db.doc(userDocPath).update({
                                                joinedServersArray: updatedArray
                                            })
                                                .then(() => {
                                                    console.log(`Successfully removed ${listId} from joinedServersArray.`);
                                                    document.location.href = "./main.html"; // Redirect after the update
                                                })
                                                .catch((error) => {
                                                    console.error("Error updating document:", error);
                                                });

                                        } else {
                                            console.log("No joinedServersArray found or it is not an array.");
                                        }

                                    } else {
                                        console.log("User document does not exist.");
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error fetching user document:", error);
                                });
                        } else {
                            console.log("The ownerId matches the user's uid.");
                            db.doc(dbPath)
                                .delete()
                                .then(() => {
                                    document.location.href = "./main.html";
                                })
                                .catch((error) => {
                                    console.error("Error deleting list: ", error);
                                });
                        }
                    } else {
                        console.log("Document does not exist.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching document:", error);
                });
        } else {
            const dbPath = "users/" + user.uid + "/lists/" + listId;
            db.doc(dbPath)
                .delete()
                .then(() => {
                    document.location.href = "./main.html";
                })
                .catch((error) => {
                    console.error("Error deleting list: ", error);
                });
        }

    });
    console.log("Deleted the list with id: " + listId + " from database.");
}

// Get modal and buttons
const modal = document.getElementById('confirmationModal');
const cancelDeleteButton = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// Close the modal when the cancel button is clicked
cancelDeleteButton.addEventListener('click', function () {
    modal.classList.remove('show');
});

document.body.addEventListener('click', function (event) {
    // Handle reminder delete checkbox
    if (event.target && event.target.classList.contains('reminderDelete')) {
        const alertBox = document.getElementById('taskDelete');
        const parent = event.target.parentElement;
        const hasRestoreButton = parent.querySelector('.reminderRestore') != null;

        // Handle reminder delete permanently checkbox
        if (hasRestoreButton) {
            const confirmDeleteButton = document.getElementById('confirmDelete');
            const alertBox = document.getElementById('taskDeletePermanent');
            modal.classList.add('show');
            confirmDeleteButton.addEventListener('click', function (e) {
                deleteReminderPermenant(event.target);
                modal.classList.remove('show');

                alertBox.classList.add('show'); // Show the alert
                setTimeout(() => {
                    alertBox.classList.add('hide'); // Fade out after 0.5 second
                    setTimeout(() => {
                        alertBox.classList.remove('show', 'hide'); // Reset classes
                    }, 500); // Wait for fade-out to finish
                }, 500);
            });

        } else {
            alertBox.classList.add('show'); // Show the alert
            setTimeout(() => {
                alertBox.classList.add('hide'); // Fade out after 0.5 second
                setTimeout(() => {
                    alertBox.classList.remove('show', 'hide'); // Reset classes
                }, 500); // Wait for fade-out to finish
            }, 500);
        }
    }
    // Handle reminder restore checkbox
    else if (event.target && event.target.classList.contains('reminderRestore')) {
        const alertBox = document.getElementById('taskRestore');
        alertBox.classList.add('show'); // Show the alert
        setTimeout(() => {
            alertBox.classList.add('hide'); // Fade out after 0.5 second
            setTimeout(() => {
                alertBox.classList.remove('show', 'hide'); // Reset classes
            }, 500); // Wait for fade-out to finish
        }, 500);
    }
});
