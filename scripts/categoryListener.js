// Add event listener to the parent container (document or a specific parent element)

// Function to display tasks due today
function displayYourDueTodayTasks(id) {
  localStorage.setItem("listId", "DueToday");
  let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the template element
  console.log("1")
  // Hide add and delete buttons for due today tasks (optional)
  document.getElementById("addReminderButton").classList.remove("d-flex");
  document.getElementById("addReminderButton").style.display = "none";
  document.getElementById("deleteListButton").classList.remove("d-flex");
  document.getElementById("deleteListButton").style.display = "none";

  // Check if the user is logged in
  firebase.auth().onAuthStateChanged(user => {
    console.log("2")
    if (user) {
      console.log("3")
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of today
      const startOfDay = firebase.firestore.Timestamp.fromDate(today);

      // Set to the next day's start (exclusive upper bound)
      today.setHours(24, 0, 0, 0);
      const endOfDay = firebase.firestore.Timestamp.fromDate(today);
      let newStartOfDay = new Date(startOfDay.seconds * 1000)
      let formattedStartDate = newStartOfDay.toISOString().slice(0, 16)
      let newEndOfDay = new Date(endOfDay.seconds * 1000)
      let formattedEndDate = newEndOfDay.toISOString().slice(0, 16)
      // db.collection("servers/" + id + "/completed")
      //         .onSnapshot(
      //             (allReminders) => {
      // Query Firestore for tasks due today
      db.collection("users/" + user.uid + "/lists")
        //   .where("duetime", ">=", formattedStartDate)
        //   .where("duetime", "<", formattedEndDate)
        .onSnapshot(
          (allTasks) => {
            let numOfTasks = 0;
            document.getElementById("reminders-list").innerHTML = ""; // Clear existing tasks

            allTasks.forEach((doc) => {
              db.collection("users/" + user.uid + "/lists/" + doc.id + "/reminders").onSnapshot(
                (allReminders) => {
                  allReminders.forEach((reminder) => {
                    numOfTasks++;
                    console.log(numOfTasks);
                    // completedDueTime = reminder.data().duetime


                    // Retrieve data from Firestore
                    var taskText = reminder.data().reminder;
                    var taskPriority = reminder.data().priority;
                    var taskDueDate = reminder.data().duetime; // Firestore Timestamp converted to JavaScript Date

                    if (taskDueDate == null || taskDueDate < formattedStartDate || taskDueDate > formattedEndDate) {
                      return;
                    }
                    // Clone the reminder template and fill it with data

                    let newTask = reminderTemplate.content.cloneNode(true);

                    newTask.querySelector('.reminderText').innerHTML = taskText;
                    newTask.querySelector('.priorityText').innerHTML = "Priority: " + taskPriority;
                    newTask.querySelector('.timeText').innerHTML = "Due: " + taskDueDate;
                    newTask.querySelector('.reminderCheckbox').checked = false;
                    newTask.querySelector('.reminderCheckbox').addEventListener("click", () => completeReminder(doc.id, reminder.id)); // Handle unchecking the task

                    document.getElementById("reminders-list").appendChild(newTask); // Append the new task to the task list

                  });
                }
              )

            });
            // Update the task count
            document.getElementById("reminderCount").innerHTML = numOfTasks;
            console.log("Number of tasks: " + numOfTasks);
          },
          (error) => {
            console.log("Error getting tasks: ", error);
          }
        );

      console.log("Due today tasks have been loaded.");
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

function displayYourDueThisWeeksTasks(id) {
  localStorage.setItem("listId", "DueThisWeek");
  let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the template element
  console.log("1")
  // Hide add and delete buttons for due today tasks (optional)
  document.getElementById("addReminderButton").classList.remove("d-flex");
  document.getElementById("addReminderButton").style.display = "none";
  document.getElementById("deleteListButton").classList.remove("d-flex");
  document.getElementById("deleteListButton").style.display = "none";

  // Check if the user is logged in
  firebase.auth().onAuthStateChanged(user => {
    console.log("2")
    if (user) {
      console.log("3")
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of today
      const startOfDay = firebase.firestore.Timestamp.fromDate(today);

      // Set to the next day's start (exclusive upper bound)
      today.setHours(168, 0, 0, 0);
      const endOfWeekDay = firebase.firestore.Timestamp.fromDate(today);
      let newStartOfDay = new Date(startOfDay.seconds * 1000)
      let formattedStartDate = newStartOfDay.toISOString().slice(0, 16)
      let newEndOfWeekDay = new Date(endOfWeekDay.seconds * 1000)
      let formattedWeekEndDate = newEndOfWeekDay.toISOString().slice(0, 16)
      // db.collection("servers/" + id + "/completed")
      //         .onSnapshot(
      //             (allReminders) => {
      // Query Firestore for tasks due today
      db.collection("users/" + user.uid + "/lists")
        //   .where("duetime", ">=", formattedStartDate)
        //   .where("duetime", "<", formattedEndDate)
        .onSnapshot(
          (allTasks) => {
            var numOfTasks = 0;
            document.getElementById("reminders-list").innerHTML = ""; // Clear existing tasks

            allTasks.forEach((doc) => {
              db.collection("users/" + user.uid + "/lists/" + doc.id + "/reminders").onSnapshot(
                (allReminders) => {
                  allReminders.forEach((reminder) => {
                    // completedDueTime = reminder.data().duetime


                    // Retrieve data from Firestore
                    var taskText = reminder.data().reminder;
                    var taskPriority = reminder.data().priority;
                    var taskDueDate = reminder.data().duetime; // Firestore Timestamp converted to JavaScript Date

                    if (taskDueDate < formattedStartDate || taskDueDate > formattedWeekEndDate) {
                      return;
                    }
                    // Clone the reminder template and fill it with data
                    numOfTasks++;

                    let newTask = reminderTemplate.content.cloneNode(true);

                    newTask.querySelector('.reminderText').innerHTML = taskText;
                    newTask.querySelector('.priorityText').innerHTML = "Priority: " + taskPriority;
                    newTask.querySelector('.timeText').innerHTML = "Due: " + taskDueDate;
                    newTask.querySelector('.reminderCheckbox').checked = false;
                    newTask.querySelector('.reminderCheckbox').addEventListener("click", () => completeReminder(doc.id, reminder.id)); // Handle unchecking the task

                    document.getElementById("reminders-list").appendChild(newTask); // Append the new task to the task list

                  });
                }
              )

            });
            console.log("4")
            // Update the task count
            document.getElementById("reminderCount").innerHTML = numOfTasks;
            console.log(numOfTasks)
          },
          (error) => {
            console.log("Error getting tasks: ", error);
          }
        );

      console.log("Due today tasks have been loaded.");
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

function displayYourOverdueTasks(id) {
  localStorage.setItem("listId", "Overdue");
  let reminderTemplate = document.getElementById("reminderTemplate"); // Retrieve the template element
  console.log("1")
  // Hide add and delete buttons for due today tasks (optional)
  document.getElementById("addReminderButton").classList.remove("d-flex");
  document.getElementById("addReminderButton").style.display = "none";
  document.getElementById("deleteListButton").classList.remove("d-flex");
  document.getElementById("deleteListButton").style.display = "none";

  // Check if the user is logged in
  firebase.auth().onAuthStateChanged(user => {
    console.log("2")
    if (user) {
      console.log("3")
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of today
      const startOfDay = firebase.firestore.Timestamp.fromDate(today);

      let newStartOfDay = new Date(startOfDay.seconds * 1000)
      let formattedStartDate = newStartOfDay.toISOString().slice(0, 16)

      // db.collection("servers/" + id + "/completed")
      //         .onSnapshot(
      //             (allReminders) => {
      // Query Firestore for tasks due today
      db.collection("users/" + user.uid + "/lists")
        //   .where("duetime", ">=", formattedStartDate)
        //   .where("duetime", "<", formattedEndDate)
        .onSnapshot(
          (allTasks) => {
            var numOfTasks = 0;
            document.getElementById("reminders-list").innerHTML = ""; // Clear existing tasks

            allTasks.forEach((doc) => {
              db.collection("users/" + user.uid + "/lists/" + doc.id + "/reminders").onSnapshot(
                (allReminders) => {
                  allReminders.forEach((reminder) => {
                    // completedDueTime = reminder.data().duetime


                    // Retrieve data from Firestore
                    var taskText = reminder.data().reminder;
                    var taskPriority = reminder.data().priority;
                    var taskDueDate = reminder.data().duetime; // Firestore Timestamp converted to JavaScript Date

                    console.log(taskDueDate);
                    console.log(formattedStartDate);
                    if (taskDueDate > formattedStartDate) {
                      return;
                    }
                    // Clone the reminder template and fill it with data
                    numOfTasks++;

                    let newTask = reminderTemplate.content.cloneNode(true);

                    newTask.querySelector('.reminderText').innerHTML = taskText;
                    newTask.querySelector('.priorityText').innerHTML = "Priority: " + taskPriority;
                    newTask.querySelector('.timeText').innerHTML = "Due: " + taskDueDate;
                    newTask.querySelector('.reminderCheckbox').checked = false;
                    newTask.querySelector('.reminderCheckbox').addEventListener("click", () => completeReminder(doc.id, reminder.id)); // Handle unchecking the task

                    document.getElementById("reminders-list").appendChild(newTask); // Append the new task to the task list

                  });
                }
              )

            });
            console.log("4")
            // Update the task count
            document.getElementById("reminderCount").innerHTML = numOfTasks;
            console.log(numOfTasks)
          },
          (error) => {
            console.log("Error getting tasks: ", error);
          }
        );

      console.log("Due today tasks have been loaded.");
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

document.getElementById("dueThisWeek").addEventListener("click", displayYourDueThisWeeksTasks);

document.getElementById("dueToday").addEventListener("click", displayYourDueTodayTasks);

document.getElementById("overdue").addEventListener("click", displayYourOverdueTasks);
