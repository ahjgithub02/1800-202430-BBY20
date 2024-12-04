document.querySelectorAll(".toggle-div").forEach(button => {
    button.addEventListener("click", function() {
        console.log("i've been clicked!")
        document.querySelector(".child-main-container-4-1").classList.add("hidden");
        document.querySelector(".child-main-container-4-2").classList.remove("hidden");
    });
});

function toggleDivVisibility() {
    document.querySelector(".child-main-container-4-1").classList.add("hidden");
        document.querySelector(".child-main-container-4-2").classList.remove("hidden");
}