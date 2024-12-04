//This random code generated function is from https://sentry.io/answers/generate-random-string-characters-in-javascript/
function generateServerCode() {
    //characters that could be included in a servers code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    //randomly chooses 4 characters from chars to make up the server code
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function makeServer() {
    const serverName = document.getElementById("serverName").value;
    let serverCode = "";

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            if (serverName.trim() !== "") {
                console.log("Creating server...");
                let isUnique = false;

                //Runs generateServerCode until a unique code that is not used by another server is made 
                while (!isUnique) {
                    serverCode = generateServerCode();

                    // Check Firestore for the existence of the code (checks for documents that have a key, code that has value matching serverCode)
                    const querySnapshot = await db.collection("servers").where('code', '==', serverCode).get();
                    if (querySnapshot.empty) {
                        isUnique = true; // Code is unique if no documents match
                    }
                }

                // Add the server with the unique code
                db.collection("servers").add({
                    code: serverCode,
                    serverName: serverName,
                    ownerId: user.uid,
                    ownerName: user.displayName
                })
                    .then(() => {
                        console.log("Server created with code: ", serverCode);
                        localStorage.setItem('serverCode', serverCode);

                        window.location.href = '/html/main.html';
                    })
                    .catch((error) => {
                        console.error("Error adding server: ", error);
                    });

            } else {
                alert("Please fill in all input fields!");
            }
        } else {
            console.log("Please log in to make a server.");
        }
    });
}
document.querySelector("#create-list").addEventListener("click", makeServer);