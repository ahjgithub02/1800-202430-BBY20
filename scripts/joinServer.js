// Check if inputted reminder is empty or whitespace
function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}
async function joinServer() {
    const serverCode = document.getElementById("serverCode").value;
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            if (!isEmpty(serverCode)) {
                console.log(serverCode);
                //Find server document in firestore where the key, code matches the serverCode
                const querySnapshot = await db.collection("servers").where('code', '==', serverCode).get();
                if (querySnapshot.empty) {
                    console.log("Code doesn't match a server");
                } else {
                    console.log("Found a match");
                    const docRefId = querySnapshot.docs[0];

                    const ifJoined = await db.collection("users/" + user.uid + "/joinedServers").where('id', '==', docRefId.id).get();

                    const ifOwner = docRefId.data().ownerId === user.uid;

                    if (!ifOwner) {
                        //check if user already in server
                        if (ifJoined.empty) {
                            db.collection("users/" + user.uid + "/joinedServers").add({
                                id: docRefId.id,
                                name: docRefId.data().serverName
                            })
                                .then(() => {
                                    console.log("Joined server!");
                                    //relocates to reminders page after joining server
                                    window.location.href = '../reminders/reminders.html';
                                })
                                .catch((error) => {
                                    console.error("Error joining server: ", error);
                                });
                        } else {
                            console.log("Already in server!");
                        }
                    } else {
                        console.log("You own the server!");
                    }
                }
            } else {
                alert("Please fill in the code.");
            }
        } else {
            console.log("Please sign in!");
        }
    })
}
document.querySelector("#joinServer").addEventListener("click", joinServer);