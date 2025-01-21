const cartApiUrl = "http://localhost:3000/cartItems"

async function addToCart( productId) {
    // event.preventDefault()
    
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

    if(!loggedUser){
        alert("Login first to add items to cart")
        return
    }
    let userId = loggedUser.id
    let cartUrl = `http://localhost:3000/cartItems?userId=${userId}`

    try {
        let response = await fetch(cartUrl)
        let cartItems = await response.json()
        let cartItem = cartItems.length > 0? cartItems[0]: null

        if(cartItem) {
            let productExists = cartItem.products.find(p => p.productId === productId)
            if(productExists){
                productExists.quantity += 1;
            } else{
                cartItem.products.push({productId, quantity: 1})
            }

            await fetch(`http://localhost:3000/cartItems/${cartItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItem)
            })
        } else{
            const newCartItem = {
                userId,
                products: [{productId, quantity:1}]
            }

            await fetch(cartApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCartItem)
            })
        }
        console.log("Item added to cart successfully");
        

    } catch (error) {
        console.log(error);
        
    }
}
