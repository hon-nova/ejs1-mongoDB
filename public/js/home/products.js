document.addEventListener('DOMContentLoaded',async function(){
  
   // let username = sessionStorage.getItem('username')
   // if (username){
   //    document.getElementsByTagName('h1')[0].innerHTML=`Hello ${username}`
   // }
    

   fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const products = data.products; 
        console.log(`FRONTEND products::${products}`)
})})