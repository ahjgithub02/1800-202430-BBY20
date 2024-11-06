var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            let userName = userDoc.data().name;
                            let userPhone = userDoc.data().phone;
                            let userSchool = userDoc.data().school;
                            let userAddress = userDoc.data().address;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                            }
                            if (userPhone != null) {
                                document.getElementById("phoneInput").value = userPhone;
                            }
                            if (userSchool != null) {
                                document.getElementById("schoolInput").value = userSchool;
                            }
                            if (userAddress != null) {
                                document.getElementById("addressInput").value = userAddress;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateUserInfo();

function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userPhone = document.getElementById('phoneInput').value;
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userAddress = document.getElementById('addressInput').value;       //get the value of the field with id="cityInput"

    //b) update user's document in Firestore
    currentUser.update({
                        name: userName,
                        phone: userPhone,
                        school: userSchool,
                        address: userAddress
                    })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })
                }