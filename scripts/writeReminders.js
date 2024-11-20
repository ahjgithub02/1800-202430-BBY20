//check if inputed reminder is empty or whiteespace
function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}

function writePersonalReminder() {
    const reminderValue = document.getElementById("modalTaskTitle").value;
    const reminderDueTime = document.getElementById("modalTaskDueTime").value;
    const reminderPriorityButtons = document.querySelectorAll('input[name="priority"]');

    let reminderPriority = "";

    reminderPriorityButtons.forEach(button => {
        if (button.checked) {
            reminderPriority = button.defaultValue;
        }
    });

    if (!isEmpty(reminderValue)) {
        //check if the user is logged in
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                var reminders = db.collection("users/" + user.uid + "/reminders");

                reminders.add({
                    reminder: reminderValue,
                    priority: reminderPriority,
                    duetime: reminderDueTime
                }).then(() => {
                    console.log("Reminder successfully added!");
                    // Close the modal after saving
                    let modal = bootstrap.Modal.getInstance('#taskModal');
                    modal.hide();
                }).catch((error) => {
                    console.error("Error adding reminder: ", error);
                });

            } else {
                console.log("No user is logged in."); // Log a message when no user is logged in
            }
        })
    }
    else {
        alert("Please fill in the fields!");
    }
}

function writeServerReminder(serverId) {
    const reminderValue = document.getElementById("modalTaskTitle").value;
    const reminderDueTime = document.getElementById("modalTaskDueTime").value;
    const reminderPriorityButtons = document.querySelectorAll('input[name="priority"]');

    console.log("The server id is " + serverId)

    let reminderPriority = "";

    reminderPriorityButtons.forEach(button => {
        if (button.checked) {
            reminderPriority = button.defaultValue;
        }
    });

    if (!isEmpty(reminderValue)) {
        //check if the user is logged in
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                var reminders = db.collection("servers/" + serverId + "/reminders");

                reminders.add({
                    reminder: reminderValue,
                    priority: reminderPriority,
                    duetime: reminderDueTime
                }).then(() => {
                    console.log("Reminder successfully added!");
                    // Close the modal after saving
                    let modal = bootstrap.Modal.getInstance('#taskModal');
                    modal.hide();
                }).catch((error) => {
                    console.error("Error adding reminder: ", error);
                });

            } else {
                console.log("No user is logged in."); // Log a message when no user is logged in
            }
        })
    }
    else {
        alert("Please fill in the fields!");
    }
}