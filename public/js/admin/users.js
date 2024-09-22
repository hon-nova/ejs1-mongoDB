document.addEventListener("DOMContentLoaded", function () {
  const readUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/users"); // Include protocol and full URL
      if (response.ok) {
        const users = await response.json(); // Get the JSON data
        console.log("Users fetched:", users);
        
        
        return users;
      } else {
        console.error("Failed to fetch users");
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  readUsers();

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
});
