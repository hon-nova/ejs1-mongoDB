document.addEventListener("DOMContentLoaded", function () {

  fetch('/apijson/users')
    .then(response => response.json())
    .then(data => {
        const users = data.users;  // Get the users object from the API response
      //   users.forEach(user=>{
      //     console.log(`fronend each user::${user.email}`)
      //   })
      /** for update functionality */
      document.querySelectorAll('.update-button').forEach((button, index) => {
         button.addEventListener('click', () => {
             // Get the email from the user's row
             const currentEmail = document.querySelector(`#userRow-${users[index]._id} td:nth-child(3)`).innerText;
             console.log(`currentEmail::${currentEmail}`)
             
             // Set the form's current email field with the clicked user's email
             document.getElementById('current-email').value = currentEmail;
             
             // Store the userId for form submission
             document.getElementById('update-form').dataset.userId = users[index]._id;
         });
     });
        
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
  const onUpdate = async(userId)=>{
   document.getElementById('update-form').addEventListener('submit', async (event) => {
      event.preventDefault();  // Prevent the form from refreshing the page
  
      // const userId = event.target.dataset.userId;  // Get the userId from the data attribute
      const newEmail = document.querySelector('#new-email').value;  // Get the new email from the form
  
      try {
          const response = await fetch(`/admin/users/${userId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: newEmail })  // Send the new email to the server
          });
  
          if (response.ok) {
              alert('Email updated successfully!');
              // Update the email in the table without refreshing the page
              document.querySelector(`#userRow-${userId} td:nth-child(3)`).innerText = newEmail;
          } else {
              alert('Failed to update email.');
          }
      } catch (error) {
          alert('Error occurred while updating email.');
      }
  });
  }
  
})
   




 

