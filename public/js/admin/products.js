document.addEventListener("DOMContentLoaded",()=>{
   console.log(`starting products.js`)
   let productForm =document.querySelector("#productForm")
   productForm.addEventListener('submit',async (e)=>{
      e.preventDefault()
      console.log(`running productForm begins`)
      let name=document.querySelector("#name").value
      let category= document.querySelector("#category").value
      let price=parseFloat(document.querySelector("#price").value)
      let dateArrival=document.querySelector("#dateArrival").value
      let photo =document.querySelector("#photo").value //not sure here      

      let product ={
         name,category,price,dateArrival,photo
      }
      console.log('Product data to send:', product); 

      let response = await fetch(`http://localhost:3000/admin/products`,{
         method:"POST",
         headers :{
            "Content-Type":"application/json"
         },
         body:JSON.stringify(product)
      })
      let result = await response.json()
      if(response.ok){
         console.log(`FRONTEND successfully added product.`)
         console.log(`Product name::${result.name}`)
      }
   })
})