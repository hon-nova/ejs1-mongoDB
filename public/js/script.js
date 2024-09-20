document.addEventListener('DOMContentLoaded',function(){
   document.querySelector("#userForm").addEventListener('submit',async function(e){
      e.preventDefault()
    
      let userName=document.querySelector("#userName").value
      let email=document.querySelector("#email").value
      let password=document.querySelector("#password").value
      let confirmPassword =document.querySelector("#confirmPassword").value      

      const userData = {
         userName,email,password
      }
      // Send POST request to the backend
      const response = await fetch('http://localhost:3000/register', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(userData)
      });

      const result = await response.json();

      // Display the response message
      document.getElementById('responseMessage').innerHTML = `
         <div class="alert alert-success">User data submitted: ${result.firstName} ${result.lastName}, ${result.schoolName}</div>
      `;
   })
})