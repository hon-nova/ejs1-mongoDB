document.addEventListener("DOMContentLoaded", function () {

  fetch('/apijson/users')
    .then(response => response.json())
    .then(data => {
        const users = data.users;  
      /** for update functionality */
      document.querySelectorAll('.update-button').forEach((button, index) => {
         button.addEventListener('click', () => {
             // Get the email from the user's row
             const currentEmail = document.querySelector(`#userRow-${users[index]._id} td:nth-child(3)`).innerText;
             console.log(`currentEmail::${currentEmail}`)
             document.getElementById('current-email').value = currentEmail;
            
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
      console.log(`userId frontend::${userId}`)
      const updateForm = document.querySelector('#update-form');

      updateForm.addEventListener('submit', async (event) => {
          event.preventDefault();
   
          const newEmail = document.querySelector('#new-email').value; 
          console.log(`newEmail frontend::${newEmail}`);
      
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
      
   const currentEmail = document.querySelector(`#userRow-${userId} td:nth-child(3)`).innerText;
   document.querySelector('#current-email').value = currentEmail;
   // You could also clear the new-email input if needed
   document.querySelector('#new-email').value = '';
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
   




 

