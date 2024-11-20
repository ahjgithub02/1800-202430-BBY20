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

document.getElementById("toggleButton").addEventListener("click", function() {
    var textElement = document.getElementById("toggleText");
    if (textElement.style.display === "none") {
      textElement.style.display = "block"; // Show the text
    } else {
      textElement.style.display = "none"; // Hide the text
    }
  });