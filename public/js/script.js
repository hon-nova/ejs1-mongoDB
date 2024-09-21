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
      const response = await fetch('http://localhost:3000/admin/users', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log(`RESULT frontend::${result}`)
      // console.log(`result pushed backend message::${result.message}`)

      // Display the response message
      let msg=result.message
      let isSuccess = result.success
      msg = isSuccess ?  `
         <div class="alert alert-success">${msg} ${result.username} ${result.email}</div> `: `<div class="alert alert-danger">${msg}</div>`

      document.getElementById('responseMessage').innerHTML =msg

      const loginAuthentication =async()=>{
         try {
            const response = await fetch('http//localhost:3000/login')
            if(response.ok){
               let result = await response.json()
               console.log(`user input login::${result.message}`)
   
            }
         } catch(err){
            console.log(`Failed to login::${err}`)
            document.querySelector("#errorMessage").innerHTML=result.message
         }
        
      }
      
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