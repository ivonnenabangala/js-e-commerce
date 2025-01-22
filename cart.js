const cartApiUrl = "http://localhost:3000/cartItems"
const productsApiUrl = "http://localhost:3000/products"
let cartItems = document.querySelector(".cart-items")
let cartId = localStorage.getItem("cartId") ? parseInt(localStorage.getItem("cartId")) : 1;


async function addToCart(productId, event) {
    if (event) {
        event.preventDefault(); 
    }
    
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
                id: cartId,
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
            cartId++;
            localStorage.setItem("cartId", cartId);
        }
        console.log("Item added to cart successfully");
        

    } catch (error) {
        console.log(error);
        
    }
}
async function getCartItems() {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

    if(!loggedUser){
        alert("Login first to view cart")
        return
    }
    let userId = loggedUser.id
    let cartUrl = `${cartApiUrl}?userId=${userId}`
    try {
        const response = await fetch(cartUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const cartItems = await response.json();
        console.log("Cart Items",cartItems);

        if (!cartItems.length || !cartItems[0].products.length) {
            console.log("No items in the cart.");
            return;
        }


        let productIds = cartItems[0].products.map(item => item.productId);
        console.log(productIds);

        let productDetails = await Promise.all(
            cartItems[0].products.map(async (cartItem) => {
                let productUrl = `${productsApiUrl}/${cartItem.productId}`;
                const productResponse = await fetch(productUrl);
                
                if (!productResponse.ok) {
                    console.error(`Error fetching product ${cartItem.productId}: ${productResponse.status}`);
                    return null;
                }

                let productData = await productResponse.json();
                return { ...productData, quantity: cartItem.quantity }; 
            })
        )
        console.log("Fetched products", productDetails);

        

        let cartContainer = document.getElementById("cartContainer");
        
        for (let product of productDetails) {
            let totalPrice = product.price * product.quantity
            console.log("Product", product);
            
            let cartCards = document.createElement('div')
            cartCards.className = "cart-cards"

            cartCards.innerHTML = `
            <div class="cart-card">
            <div class="product-image">

                <img src="${product.image}" alt="product image">
            </div>
            <div class="content">
                <h4>${product.productName}</h4>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod dolore asperiores blanditiis nesciunt ab itaque in sapiente cumque deleniti dignissimos.</p>
            </div>
            <div class="pricing">
                <p>Ksh. ${product.price}</p>
                <i class="fa fa-minus" aria-hidden="true"></i>
                <span>${product.quantity}</span>
                <i class="fa fa-plus" aria-hidden="true"></i> <br>
                <i class="fa fa-trash" aria-hidden="true" onclick="clearCart(${cartItems[0].products.productId})"></i>
            </div>
        </div>
        <div class="checkout">
            <h2>Total Price: ${totalPrice}</h2>
            <button>Checkout</button>
        </div>
            `

            cartContainer.appendChild(cartCards)
        }


    } catch (error) {
        console.log(error);

    }

}
getCartItems()

async function clearCart(id) {
    const productUrl = `${cartApiUrl}/${id}`
    console.log(productUrl)

    let response = await fetch(productUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

}