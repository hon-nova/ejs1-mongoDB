document.addEventListener('DOMContentLoaded',function(){
   document.querySelector("#userForm").addEventListener('submit',async function(e){
      e.preventDefault()
    
      let username=document.querySelector("#username").value
      let email=document.querySelector("#email").value
      let password=document.querySelector("#password").value
      let confirmPassword =document.querySelector("#confirmPassword").value      

      const userData = {
         username,email,password
      }
      // Send POST request to the backend
      const response = await fetch('http://localhost:3000/users', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log(`RESULT frontend::${result}`)

      // Display the response message
      document.getElementById('responseMessage').innerHTML = `
         <div class="alert alert-success">User data submitted: ${result.username} ${result.email}</div>
      `;
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
       
      readUsers();

      const onDelete = async(index)=>{}
       
      })
})