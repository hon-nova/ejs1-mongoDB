document.addEventListener("DOMContentLoaded",()=>{
   let name=document.querySelector("#name").value
   let category= document.querySelector("#category")
   let price=document.querySelector("#price").value
   let dateArrival=document.querySelector("#dateArrival").value
   let photo =document.querySelector("#photo").value //not sure here
   let productForm =document.querySelector("#productForm")
   productForm.addEventListener('submit',async (e)=>{
      e.preventDefault()

      let product ={
         name,category,price,dateArrival,photo
      }

      let response = await fetch(`http://localhost:3000/admin/products`,{
         method:"POST",
         headers :{
            "Content-Type":"application/json"
         },
         body:JSON.stringify({product})
      })
      let result = await response.json()
      if(response.ok){
         console.log(`FRONTEND successfully added produc.`)
         console.log(`Product name::${result.name}`)
      }
   })
})