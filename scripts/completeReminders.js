function completeReminder(reminderId) {
    console.log("Completed reminder with id: " + reminderId);
}

//this function currenly gets the parent div of the checkbox that is clicked and delets it.
//Instead it should move it (copy) to a collection called completed in firestore, inside of the shared list of personal list collection
function copyReminderDocument(reminderId) {
    const checkBox = document.getElementById(reminderId);
    console.log(reminderId);

    // Find its parent div
    const parentDiv = checkBox.parentNode;

    // Remove the parent div (which also removes the target element)
    parentDiv.remove();
}