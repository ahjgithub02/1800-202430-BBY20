

document.body.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('reminderCheckbox')) {
        const alertBox1 = document.getElementById('taskComplete');
        const alertBox2 = document.getElementById('taskUndoComplete');

        if (event.target.checked) {
            // Handle reminder complete checkbox
            alertBox1.classList.add('show'); // Show the alert
            setTimeout(() => {
                alertBox1.classList.add('hide'); // Fade out after 0.5 second
                setTimeout(() => {
                    alertBox1.classList.remove('show', 'hide'); // Reset classes
                }, 500); // Wait for fade-out to finish
            }, 500);
        } else if (!event.target.checked) {
            // Handle reminder undoComplete checkbox
            alertBox2.classList.add('show'); // Show the alert
            setTimeout(() => {
                alertBox2.classList.add('hide'); // Fade out after 0.5 second
                setTimeout(() => {
                    alertBox2.classList.remove('show', 'hide'); // Reset classes
                }, 500); // Wait for fade-out to finish
            }, 500);
        }
    }
});
