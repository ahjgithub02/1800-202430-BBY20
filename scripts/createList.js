document.addEventListener("DOMContentLoaded", () => {
    // Get modal and list container elements
    const createButton = document.getElementById("create-list");
    const listNameInput = document.getElementById("listName");
    const listDescriptionInput = document.getElementById("listDescription");
    const ownListContainer = document.getElementById("own-list"); 

    // Initialize Firebase and Firestore
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userListsCollection = db.collection("users/" + user.uid + "/lists");
  
        // Function to render a list button
        const renderListButton = (listData) => {
          // Skip rendering if the list button already exists
  
          const newListButton = document.createElement("button");
          newListButton.className = "own-list-items btn btn-link text-decoration-none w-100 text-start text-dark";
          newListButton.textContent = listData.name;
  
          // Append the button to the "Own List" section
          ownListContainer.insertBefore(newListButton, ownListContainer.children[2]);
        };
  
        // Function to load and render all user's lists
        const loadUserLists = async () => {
          try {
            const snapshot = await userListsCollection.get();
            snapshot.forEach((doc) => {
              renderListButton(doc.data(), doc.id);
            });
          } catch (error) {
            console.error("Error fetching user lists: ", error);
          }
        };
  
        // Load lists on page load without clearing existing ones
        await loadUserLists();
  
        // Add event listener to "Create" button for adding new lists
        createButton.addEventListener("click", async () => {
          const listName = listNameInput.value.trim();
          const listDescription = listDescriptionInput.value.trim();
  
          // Validate input
          if (listName === "") {
            alert("Please enter a name for the list.");
            return;
          }
  
          try {
            // Add the new list to Firestore
            await userListsCollection.add({
              name: listName,
              description: listDescription || "",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
  
            // Render the new list button
            renderListButton({ 
                name: listName, 
                description: listDescription });
  
            // Clear modal inputs
            listNameInput.value = "";
            listDescriptionInput.value = "";
  
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("newListModal"));
            modal.hide();

          } catch (error) {
            console.error("Error adding new list: ", error);
          }
        });
      } else {
        console.log("No user is logged in.");
      }
    });
  });
  