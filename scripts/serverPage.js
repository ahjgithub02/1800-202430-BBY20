function insertOwnedServerFromFireStore() {
    let ownedServersTemplate = document.getElementById("ownedServersTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            if (document.getElementById("owned").innerHTML = "");
            db.collection("servers").where('ownerId', '==', user.uid).onSnapshot(
                (allOwnedServers) => {
                    allOwnedServers.forEach((doc) => {
                        var serverCode = doc.data().code;
                        var serverName = doc.data().serverName;
                        var serverDescription = doc.data().description;

                        let newServer = ownedServersTemplate.content.cloneNode(true);

                        newServer.querySelector('.serverCode').innerHTML = serverCode;
                        newServer.querySelector('.serverName').innerHTML = serverName;
                        newServer.querySelector('.serverDescription').innerHTML = serverDescription;

                        document.getElementById("owned").appendChild(newServer);

                    });
                },
                (error) => {
                    console.error("Error getting documents for server:", error);
                }

            );
            console.log("Owned servers loaded");
        } else {
            console.log("No user is logged in.");
        }
    });
}

function insertJoinedServersFromFirestore() {
    let joinedServersTemplate = document.getElementById("joinedServersTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.doc("users/" + user.uid)
                .onSnapshot(
                    (doc) => {
                        document.getElementById("joined").innerHTML = "";
                        // Iterate through each document in the QuerySnapshot
                        const joinedServersArray = doc.data().joinedServersArray;

                        //iterates for every item(server Id) in the joinedServersArray
                        joinedServersArray.forEach(async (serverId) => {
                            //gets the document of the server using its id in the array
                            await db.doc("servers/" + serverId).get().then(server => {

                                var serverCode = server.data().code;
                                var serverName = server.data().serverName;
                                var serverDescription = server.data().description;

                                let newServer = joinedServersTemplate.content.cloneNode(true);

                                newServer.querySelector('.serverCode').innerHTML = serverCode;
                                newServer.querySelector('.serverName').innerHTML = serverName;
                                newServer.querySelector('.serverDescription').innerHTML = serverDescription;

                                document.getElementById("joined").appendChild(newServer);

                            }).catch(error => {
                                console.error("Error fetching user document: ", error);
                            });
                        });

                    },
                    (error) => {
                        console.log("Error getting documents: ", error);
                    }
                );
                console.log("Joined servers loaded");
        }
    });
}