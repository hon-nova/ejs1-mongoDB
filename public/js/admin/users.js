document.addEventListener('DOMContentLoaded',function(){

   const readUsers = async () => {
      try {
         const response = await fetch('http://localhost:3000/admin/users');  // Include protocol and full URL
         if (response.ok) {
            const users = await response.json();  // Get the JSON data
            console.log('Users fetched:', users);
      
            // Dynamically insert users into the HTML
            const tableBody = document.querySelector('tbody');
            users.forEach((user, index) => {
               const row = `<tr>
                           <th scope="row">${index + 1}</th>
                           <td>${user.username}</td>
                           <td>${user.email}</td>
                           </tr>`;
               tableBody.innerHTML += row;
            });
         } else {
            console.error('Failed to fetch users');
         }
         } catch (error) {
         console.error('Error:', error);
         }
   };   
   readUsers()    
   const onDelete = async(index)=>{}
   
   })
   