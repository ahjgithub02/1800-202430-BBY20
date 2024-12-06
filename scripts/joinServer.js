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
                    console.log("Code doesn't match a list");
                    alert("Code doesn't match a list");
                } else {
                    console.log("Found a match");
                    const docRefId = querySnapshot.docs[0];
                    let ifJoined = false;

                    await db.doc("users/" + user.uid).get().then(doc => {
                        if (doc.exists) {
                            const joinedServersArray = doc.data().joinedServersArray;

                            if (joinedServersArray && joinedServersArray.includes(docRefId.id)) { 
                                ifJoined = true;
                            }
                        } else {
                            console.error("User document not found");
                        }
                    }).catch(error => {
                        console.error("Error fetching user document: ", error);
                    });



                    const ifOwner = docRefId.data().ownerId === user.uid;

                    if (!ifOwner) {
                        //check if user already in server
                        if (!ifJoined) {
                            db.doc("users/" + user.uid).set({
                                joinedServersArray: firebase.firestore.FieldValue.arrayUnion(docRefId.id)

                            }, {
                                merge: true
                            })
                                .then(() => {
                                    console.log("Joined list!");
                                    //relocates to reminders page after joining list
                                    window.location.href = '/html/main.html';
                                })
                                .catch((error) => {
                                    console.error("Error joining list: ", error);
                                });
                        } else {
                            console.log("Already in list!");
                            alert("Already in list!");
                        }
                    } else {
                        console.log("You own the list!");
                        alert("You own the list!");
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