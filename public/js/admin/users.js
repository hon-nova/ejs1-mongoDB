document.addEventListener('DOMContentLoaded',function(){

   const readUsers = async () => {
      try {
         const response = await fetch('http://localhost:3000/admin/users');  // Include protocol and full URL
         if (response.ok) {
            const users = await response.json();  // Get the JSON data
            console.log('Users fetched:', users);
   
            return users
         } else {
            console.error('Failed to fetch users');
            return []
         }
         } catch (error) {
         console.error('Error:', error);
         return []
         }
   };    
   readUsers() 

   let copyUsers=[]

   const getUsers = async () => {
      const users = await readUsers(); // Fetch users asynchronously
      copyUsers = [...users]; // Store fetched users in copyUsers array
      console.log('Users copied to copyUsers:', copyUsers);
      return copyUsers;
   };
   
   // Call getUsers to fetch and save users
   getUsers();
   
   const onDelete = async (userId) => {
      console.log('Delete function called with userId:', userId); 
      try {
          // Fetch all users
          const users = await readUsers();
          
          // Find the index of the user with the given _id
          const userIndexToDelete = users.findIndex(user => user._id === userId);
          
          if (userIndexToDelete !== -1) {
              console.log(`Found user to delete with _id: ${userId}`);
  
              // Send delete request to server
              const response = await fetch(`/admin/users/${userId}`, {
                  method: 'DELETE',
              });
  
              if (response.ok) {                 
                  // Optionally reload the page or remove the user from the DOM
                  const rowToDelete = document.querySelector(`#userRow-${userId}`)
                  if(rowToDelete){
                     rowToDelete.remove()
                  }
                  setTimeout(()=>{
                      alert('User deleted successfully');

                  },2000)
                  
              } else {
                  alert('Failed to delete user');
              }
          } else {
              console.log('User not found');
          }
      } catch (error) {
          console.error('Error deleting user:', error);
      }
  };
   
   })
   