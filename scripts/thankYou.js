// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get the user's display name
            const displayName = user.displayName || "Guest";

            // Update the thank-you message with the user's name
            const thankYouMessage = document.querySelector('.card-title');
            thankYouMessage.textContent = `Thanks for submitting your comment, ${displayName}!`;
        } else {
            console.log("No user is signed in.");
        }
    });
});

const modal = document.getElementById('thankyouModal');
const close = document.getElementById('closeThankyou');
// Show modal said that submit succesfully
document.body.addEventListener('click', function(event) {
    if (event.target && event.target.ClassList.contains('submitFeedback')) {
        modal.classList.add('show');
        close.addEventListener('click', function(e) {
            modal.classList.remove('show');
        })
    }
})