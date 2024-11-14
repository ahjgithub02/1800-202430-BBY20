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

function displayJoindServers() {
    let ServerTemplate = document.getElementById("serverDropTemplate"); // Retrieve the HTML template element.

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //find all servers where the owner is the logged in user
            db.collection("servers").where('ownerId', '==', user.uid).onSnapshot(
                (allOwnedServers) => {
                    document.getElementById("ownedServersDropdown").innerHTML = "";

                    // Iterate through each document in the QuerySnapshot
                    allOwnedServers.forEach((doc) => {
                        var serverName = doc.data().serverName;
                        var serverId = doc.id;

                        // Clone the template content
                        let newJoinedServer = ServerTemplate.content.cloneNode(true);

                        // Set the server name and ID in the new item
                        let dropdownItem = newJoinedServer.querySelector(".dropdown-item");
                        dropdownItem.innerHTML = serverName + " &#x1F451;";
                        dropdownItem.id = serverId;

                        // Append the new server item to the dropdown
                        document.getElementById("ownedServersDropdown").appendChild(newJoinedServer);

                        // Log document data for debugging
                        console.log(doc.id, " => ", doc.data());
                    });
                }
            );
            db.collection("users/" + user.uid + "/joinedServers")
                .onSnapshot(
                    (allJoinedServers) => {
                        document.getElementById("joinedServersDropdown").innerHTML = "";
                        // Iterate through each document in the QuerySnapshot
                        allJoinedServers.forEach((doc) => {
                            var serverName = doc.data().name;
                            var serverId = doc.data().id;

                            // Clone the template content
                            let newJoinedServer = ServerTemplate.content.cloneNode(true);

                            // Set the server name and ID in the new item
                            let dropdownItem = newJoinedServer.querySelector(".dropdown-item");
                            dropdownItem.innerHTML = serverName;
                            dropdownItem.id = serverId;

                            // Append the new server item to the dropdown
                            document.getElementById("joinedServersDropdown").appendChild(newJoinedServer);

                            // Log document data for debugging
                            console.log(doc.id, " => ", doc.data());
                        });

                        console.log("Servers have been loaded");
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