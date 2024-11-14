function insertServerFromFireStore() {
    let serverTemplate = document.getElementById("serverTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            if (document.getElementById("owned").innerHTML = ""); 
            db.collection("servers").where('ownerId', '==', user.uid).onSnapshot(
                (allOwnedServers) => {
                    allOwnedServers.forEach((doc) => {
                        var serverCode = doc.data().code;
                        var serverName = doc.data().serverName;
                        var serverDescription = doc.data().description;

                        let newServer = serverTemplate.content.cloneNode(true);

                        newServer.querySelector('.serverCode').innerHTML = serverCode;
                        newServer.querySelector('.serverName').innerHTML = serverName;
                        newServer.querySelector('.serverDescription').innerHTML = serverDescription;

                        document.getElementById("owned").appendChild(newServer);

                        console.log("Server loaded:", doc.id, doc.data());
                    });
                },
                (error) => {
                    console.error("Error getting documents for server:", error);
                }

            );
        } else {
            console.log("No user is logged in.");
        }
    });
}

document.querySelector("#list_owned").addEventListener("click", function (e) {
    document.getElementById("owned-container").style.display = "unset";
    insertServerFromFireStore();
})

document.querySelector("#list_joined").addEventListener("click", function () {
    document.getElementById("owned").innerHTML = "";
    document.getElementById("owned-container").style.display = "none";
});
