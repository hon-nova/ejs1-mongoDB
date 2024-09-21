document.addEventListener('DOMContentLoaded',function(){

   const loginAuthentication = async () => {
      const loginForm = document.querySelector("#loginForm"); 

      loginForm.addEventListener('submit', async function(e) {
          e.preventDefault();
   
          const email = document.querySelector("#email").value;
          const password = document.querySelector("#password").value;
   
          const loginData = {
              email,
              password
          };   
          try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
   
            const result = await response.json();              
            
            console.log(`FRONTEND: retrieved email::${result.user.username}`)
            if (response.ok) {
            // Redirect to home on success
            console.log(`FRONTEND: retrieved email::${result.email}`)
            console.log(`FRONTEND: retrieved email::${result.username}`)
            sessionStorage.setItem('username',result.user.username)
            
            setTimeout(()=>{
            alert(`FRONTEND: retrieved email:: Helo ${result.user.username}`)
            window.location.href = '/';
            },2000)
                
            } else {
                // Display error message
                document.querySelector("#errorMessage").innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
            }
          } catch (err) {
              console.error(`Failed to login: ${err}`);
              document.querySelector("#errorMessage").innerHTML = `<div class="alert alert-danger">Error connecting to the server.</div>`;
          }
      });
   };
   loginAuthentication()

})