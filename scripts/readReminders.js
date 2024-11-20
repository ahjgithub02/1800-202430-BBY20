function readPersonalReminders() {
    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable. 

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users/" + user.uid + "/reminders")
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
                            newreminder.querySelector('.reminderCheckbox').id = doc.id;
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });
                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                        document.getElementById("server-name").innerHTML = "Personal";
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            document.getElementById("addReminder").addEventListener('click', writePersonalReminder);
            console.log("Reminders have been loaded");
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });

}

function displayJoindServers() {
    let ServerTemplate = document.getElementById("serverDropTemplate"); // Retrieve the HTML template element.

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            //find all servers where the owner is the logged in user
            await db.collection("servers").where('ownerId', '==', user.uid).onSnapshot(
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

                        
                        dropdownItem.addEventListener('click', () => readServerReminders(dropdownItem.id, dropdownItem.innerHTML));

                    });
                    console.log("Owned servers loaded");
                }
            );
            await db.doc("users/" + user.uid)
                .onSnapshot(
                    (doc) => {
                        document.getElementById("joinedServersDropdown").innerHTML = "";
                        // Iterate through each document in the QuerySnapshot
                        const joinedServersArray = doc.data().joinedServersArray;

                        //iterates for every item(server Id) in the joinedServersArray
                        joinedServersArray.forEach(async (doc) => {
                            //gets the document of the server using its id in the array
                            await db.doc("servers/" + doc).get().then(server => {
                                var serverName = server.data().serverName;
                                var serverId = server.id;

                                // Clone the template content
                                let newJoinedServer = ServerTemplate.content.cloneNode(true);

                                // Set the server name and ID in the new item
                                let dropdownItem = newJoinedServer.querySelector(".dropdown-item");
                                dropdownItem.innerHTML = serverName;
                                dropdownItem.id = serverId;

                                // Append the new server item to the dropdown
                                document.getElementById("joinedServersDropdown").appendChild(newJoinedServer);

                                dropdownItem.addEventListener('click', () => readServerReminders(dropdownItem.id, dropdownItem.innerHTML));

                            }).catch(error => {
                                console.error("Error fetching user document: ", error);
                            });
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

function readServerReminders(serverId, serverName) {
    let addReminderButton = document.getElementById("addReminder");

    // Remove all event listeners by replacing the element with its clone
    let newAddReminderButton = addReminderButton.cloneNode(true);
    addReminderButton.parentNode.replaceChild(newAddReminderButton, addReminderButton);

    // Update reference to the new button
    addReminderButton = newAddReminderButton;

    // Add the event listener with a reference to the serverId
    addReminderButton.addEventListener('click', () => writeServerReminder(serverId));
    
    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable. 

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("servers/" + serverId + "/reminders")
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
                            newreminder.querySelector('.reminderCheckbox').id = doc.id;
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
            console.log(serverName + " reminders have been loaded");
            document.getElementById("server-name").innerHTML = serverName;

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}
