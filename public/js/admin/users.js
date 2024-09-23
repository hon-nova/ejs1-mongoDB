document.addEventListener("DOMContentLoaded", function () {

  fetch('/apijson/users')
    .then(response => response.json())
    .then(data => {
        const users = data.users;  // Get the users object from the API response
        users.forEach(user=>{
          console.log(`fronend each user::${user.email}`)
        })
        
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });

   document.querySelector("tbody").addEventListener("click", function (event) {
    if (event.target.closest(".delete-button")) {
      const userId = event.target.closest("tr").id.split("-")[1];
      onDelete(userId);
    } else if (event.target.closest(".update-button")) {
      const userId = event.target.closest("tr").id.split("-")[1];
      onUpdate(userId);
    }
  });

  const onDelete = async (userId) => {
    console.log('Delete function called with userId:', userId);
    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Optionally, remove the user row from the DOM
        console.log("Response status:", response.status);

        const rowToDelete = document.querySelector(`#userRow-${userId}`);
        if (rowToDelete) {
          rowToDelete.remove();
        }
        const msg = await response.json()
        alert(`User deleted successfully:: ${msg.message}`);
      } else {
         console.log("Response status:", response.status);

        const err = await response.json()
        alert(`Failed to delete user with error::${err.error}`);

      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
})
   




 

