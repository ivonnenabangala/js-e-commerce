const usersApiUrl = "http://localhost:3000/users"
const productsApiUrl = "http://localhost:3000/products"
const cartApiUrl = "http://localhost:3000/cartItems"
let container = document.querySelector(".cards");


async function getUsers() {
    try {
        const response = await fetch(usersApiUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const users = await response.json();
        console.log("Users: ", users)
    } catch (error) {
        console.log(error);

    }

}
getUsers()

let userId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : 1;
const regForm = document.getElementById("registerForm")
regForm.onsubmit = async (event) => {
    event.preventDefault()

    const name = document.getElementById("name").value
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const newUser = {
        id: userId,
        name: name,
        username: username,
        email: email,
        password: password
    }

    try {
        let response = await fetch(usersApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const createdUser = await response.json()
        console.log("Created user: ", createdUser);

        userId++;
        localStorage.setItem("userId", userId);

        regForm.reset()
    } catch (error) {
        console.log(error);

    }

}

const loginForm = document.getElementById("loginForm")

loginForm.onsubmit = async (event) => {
    event.preventDefault()

    const username = document.getElementById("logUsername").value
    const password = document.getElementById("logPassword").value

    try {
        let response = await fetch(usersApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const users = await response.json()
        let loggedUser = users.find(user => user.username === username && user.password === password)
        if (!loggedUser) {
            const invalid = document.getElementById("invalidLogin")
            invalid.style.display = "block"
        } else{
            console.log("User logged in:", loggedUser);
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
            alert("Login successful!");
        }
        console.log("Logged user: ", loggedUser);

    } catch (error) {
        console.log(error);

    }

}

async function getProducts() {
    try {
        const response = await fetch(productsApiUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products);
        
        container.innerHTML = ""
        for(let product of products) {

            let displayProduct = document.createElement('div');
            displayProduct.className = 'card';
            displayProduct.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="">
                </div>
                <div class="text">
                    <p>${product.productName}</p>
                    <p>${product.description}</p>
                    <p>Ksh. ${product.price}</p>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to cart</button>
            `
            container.appendChild(displayProduct);
        }
        


        console.log("Products: ", products)
    } catch (error) {
        console.log(error);

    }

}
getProducts()
async function addToCart(productId) {
    console.log("Clicked");
    
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

// document.querySelector('.add-to-cart').addEventListener('click', async function () {
//     let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

//     if(!loggedUser){
//         alert("Login first to add items to cart")
//         return
//     }
    
// })