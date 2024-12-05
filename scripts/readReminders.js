function readReminder() {
    document.getElementById("addReminderButton").classList.remove("d-flex");
    document.getElementById("addReminderButton").style.display = "none";
    document.getElementById("deleteListButton").classList.remove("d-flex");
    document.getElementById("deleteListButton").style.display = "none";
    
    const p = document.createElement("h3");
    p.innerHTML =  "Select a list!";
    document.getElementById("reminders-list").appendChild(p);
}

function displayJoindServers() {
    let ServerTemplate = document.getElementById("serverDropTemplate"); // Retrieve the HTML template element.

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            //find all servers where the owner is the logged in user
            await db.collection("servers").where('ownerId', '==', user.uid).onSnapshot(
                (allOwnedServers) => {
                    document.getElementById("ownedServersLists").innerHTML = "";
                    let numOfLists = 0;

                    // Iterate through each document in the QuerySnapshot
                    allOwnedServers.forEach((doc) => {
                        var serverName = doc.data().serverName;
                        var serverId = doc.id;
                        numOfLists++;

                        // Clone the template content
                        let newJoinedServer = ServerTemplate.content.cloneNode(true);

                        // Set the server name and ID in the new item
                        let dropdownItem = newJoinedServer.querySelector(".dropdown-item");
                        dropdownItem.innerHTML = serverName + " &#x1F451;";
                        dropdownItem.id = serverId;

                        // Append the new server item to the dropdown
                        document.getElementById("ownedServersLists").appendChild(newJoinedServer);


                        dropdownItem.addEventListener('click', () => readServerReminders(dropdownItem.id, dropdownItem.innerHTML));

                    });
                    console.log("Owned servers loaded");
                    document.getElementById("owned-list-counter").innerHTML = numOfLists;
                }
            );
            await db.doc("users/" + user.uid)
                .onSnapshot(
                    (doc) => {
                        document.getElementById("joinedServersDropdown").innerHTML = "";
                        // Iterate through each document in the QuerySnapshot
                        const joinedServersArray = doc.data().joinedServersArray;
                        var serverId;
                        let numOfLists = 0;
                        

                        if (joinedServersArray) {
                            //iterates for every item(server Id) in the joinedServersArray
                            joinedServersArray.forEach(async (doc) => {
                                numOfLists++;
                                //gets the document of the server using its id in the array
                                await db.doc("servers/" + doc).get().then(server => {
                                    var serverName = server.data().serverName;
                                    serverId = server.id;
                                    

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
                        }

                        document.getElementById("joined-list-counter").innerHTML = numOfLists;
                        console.log("Servers have been loaded");
                        localStorage.setItem("personal", "true");
                        localStorage.setItem("listId", serverId);
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

    const deleteListButton = document.getElementById("delete-list-button");
    deleteListButton.classList.remove("hidden");

    let addReminderButton = document.getElementById("addReminder");

    // Remove all event listeners by replacing the element with its clone
    let newAddReminderButton = addReminderButton.cloneNode(true);
    addReminderButton.parentNode.replaceChild(newAddReminderButton, addReminderButton);

    // Update reference to the new button
    addReminderButton = newAddReminderButton;

    // Add the event listener with a reference to the serverId
    addReminderButton.addEventListener('click', () => writeServerReminder(serverId));

    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable. 
    document.getElementById("addReminderButton").classList.add("d-flex");

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("servers/" + serverId + "/reminders")
                .orderBy("duetime", "desc")
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
                            newreminder.querySelector('.reminderCheckbox').addEventListener("click", () => completeReminder(serverId, doc.id));
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;
                            // newreminder.querySelector('.reminderCreator').innerHTML = "Creator: " + reminderCreator;

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });
                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log(serverName + " reminders have been loaded");
            localStorage.setItem("listId", serverId);
            localStorage.setItem("personal", "false");
            

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

function readOwnListReminders(listId, serverName) {
    const deleteListButton = document.getElementById("delete-list-button");
    deleteListButton.classList.remove("hidden");
    let addReminderButton = document.getElementById("addReminder");
    console.log("list id: " + listId);
    

    // Remove all event listeners by replacing the element with its clone
    let newAddReminderButton = addReminderButton.cloneNode(true);
    addReminderButton.parentNode.replaceChild(newAddReminderButton, addReminderButton);

    // Update reference to the new button
    addReminderButton = newAddReminderButton;

    // Add the event listener with a reference to the listId
    addReminderButton.addEventListener('click', () => writeOwnListReminder(listId));

    let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the HTML element with the ID "remindersTemplate" and store it in the cardTemplate variable. 
    document.getElementById("addReminderButton").classList.add("d-flex");

    //check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users/" + user.uid + "/lists/" + listId + "/reminders")
                .orderBy("duetime", "desc")
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
                            newreminder.querySelector('.reminderCheckbox').addEventListener("click", () => completeReminder(listId, doc.id));
                            newreminder.querySelector('.priorityText').innerHTML = "Priority: " + reminderPriority;
                            newreminder.querySelector('.timeText').innerHTML = "Due: " + reminderDueDate;
                            // newreminder.querySelector('.reminderCreator').innerHTML = "Creator: " + reminderCreator;

                            document.getElementById("reminders-list").appendChild(newreminder);
                        });
                        document.getElementById("reminderCount").innerHTML = numOfReminders;
                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
            console.log(serverName + " reminders have been loaded");
            localStorage.setItem("listId", listId);
            localStorage.setItem("personal", "true");

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}