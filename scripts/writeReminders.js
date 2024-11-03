//check if inputed reminder is empty or whiteespace
function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}

function writeReminder() {
    const reminderValue = document.getElementById("valueOfReminder").value;
    const reminderDueTime = document.getElementById("reminderDueTime").value;

    if (!isEmpty(reminderValue)) {
        //check if the user is logged in
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                var reminders = db.collection("users/" + user.uid + "/reminders");

                reminders.add({
                    reminder: reminderValue,
                    priority: "normal",
                    duetime: reminderDueTime
                })

            } else {
                console.log("No user is logged in."); // Log a message when no user is logged in
            }
        })
    }
    else {
        alert("Please fill in the fields!");
    }
}

const newReminderButton = document.querySelector("#addReminderButton");
newReminderButton.addEventListener("click", writeReminder);