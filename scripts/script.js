// Function to handle checkbox change event and show the notification
function notifyTaskCompletion(event) {
    const checkbox = event.target;

    if (checkbox.checked) {
        console.log("Task completed!");

        const toast = new bootstrap.Toast(document.getElementById('taskNotification'));
        toast.show();
    }
}

// Add the event listeners to the checkboxes
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('click', notifyTaskCompletion);
});