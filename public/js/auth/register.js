document.addEventListener('DOMContentLoaded',function(){
   const handleRegistration =()=>{
      let userForm =document.querySelector("#userForm")
      if (!userForm) {
         console.error('Registration form not found!');
         return;
      }
      userForm.addEventListener('submit',async function(e){
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
      })   
   }
   handleRegistration()
})
   
  
     
  