document.querySelectorAll(".toggle-div").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelector(".child-main-container-4-1").classList.add("hidden");
        document.querySelector(".child-main-container-4-2").classList.remove("hidden");
        document.querySelector(".select-a-list-message").classList.add("hidden");
        document.querySelector(".go-back-mobile-layout").classList.remove("hidden");
    });
});

function toggleDivVisibility() {
    document.querySelector(".child-main-container-4-1").classList.add("hidden");
    document.querySelector(".child-main-container-4-2").classList.remove("hidden");
    document.querySelector(".select-a-list-message").classList.add("hidden");
    document.querySelector(".go-back-mobile-layout").classList.remove("hidden");
}

function hideChildContainers() {
    const childContainers = document.querySelectorAll(".child-main-container-4-1");
    const childContainers2 = document.querySelectorAll(".child-main-container-4-2");
    // window.location.href = './main.html';

    childContainers.forEach(container => {
        container.style.display = "none";
    });

    childContainers2.forEach(container => {
        container.style.display = "";
    });

}

function showChildContainers() {
    const childContainers = document.querySelectorAll(".child-main-container-4-1");
    childContainers.forEach(container => {
        container.style.display = "";
    });
}

document.querySelector(".go-back-button").addEventListener("event", function() {
    document.querySelector(".select-a-list-message").classList.remove("hidden");
    document.querySelector(".go-back-mobile-layout").classList.add("hidden");

});
