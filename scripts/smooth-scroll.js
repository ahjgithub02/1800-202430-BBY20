// Smooth scroll with an offset to account for the fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        // Special handling for the #top link
        if (targetId === 'top') {
            window.scrollTo({
                // Scrolls to very top of the page when clicking RemindMe Logo
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                // Adjust 65px offset based on navbar height
                top: targetElement.offsetTop - -20,
                behavior: 'smooth'
            });
        }
    });
});
