const productsApiUrl = "http://localhost:3000/products"
const cartApiUrl = "http://localhost:3000/cartItems"
let cartItems = document.querySelector(".cart-items")
let cartId = localStorage.getItem("cartId") ? parseInt(localStorage.getItem("cartId")) : 1;
let container = document.querySelector(".cards");
let tableBody = document.querySelector(".adminTable table tbody");

async function getProducts() {
    try {
        const response = await fetch(productsApiUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products);
        if (products.length > 0) {
            prodId = Math.max(...products.map(p => Number(p.id))) + 1;
        } else {
            prodId = 1;
        }
        

        container.innerHTML = ""
        for (let product of products) {

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
                <button class="add-to-cart" onclick="addToCart(event, ${product.id})">Add to cart</button>
            `
            container.appendChild(displayProduct);
        }



        console.log("Products: ", products)
    } catch (error) {
        console.log(error);

    }

}
getProducts()

async function addToCart(event, productId) {
    if (event) {
        event.preventDefault(); 
        event.stopPropagation();
    }
    
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

    if(!loggedUser){
        alert("Login first to add items to cart")
        return
    }
    let userId = loggedUser.id
    let cartUrl = `http://localhost:3000/cartItems?userId=${userId}`
    console.log("Cart URL", cartUrl);
    
    let cartId = localStorage.getItem("cartId") || 1; 
    let cartApiUrl = "http://localhost:3000/cartItems";

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
        // alert("Login first to view cart")
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
            document.querySelector("#no-items").style.display = "block"
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
                return { ...productData, quantity: cartItem.quantity, productId: cartItem.productId }; 
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
            <div class="cart-card" data-cy="cart-card">
            <div class="product-image">

                <img src="${product.image}" alt="product image">
            </div>
            <div class="content">
                <h4>${product.productName}</h4>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod dolore asperiores blanditiis nesciunt ab itaque in sapiente cumque deleniti dignissimos.</p>
            </div>
            <div class="pricing">
                <p>Ksh. ${product.price}</p>
                <i class="fa fa-minus" aria-hidden="true" onclick="decrementCart(${product.id})"></i>
                <span>${product.quantity}</span>
                <i class="fa fa-plus" aria-hidden="true" onclick="addToCart(event, ${product.id})"></i> <br>
                <i class="fa fa-trash" aria-hidden="true" onclick="clearCart(${product.productId})"></i>
            </div>
        </div>
        <div class="checkout">
            <h2>Total Price: ${totalPrice}</h2>
            <button onclick="handleCheckout(${product.productId})" data-cy="checkout">Checkout</button>
        </div>
            `

            cartContainer.appendChild(cartCards)
        }


    } catch (error) {
        console.log(error);

    }

}
getCartItems()
async function handleCheckout(productId) {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    let messageElement = document.getElementById("checkoutMessage");
    messageElement.style.display = "block";

    setTimeout(() => {
        clearCart(productId);
    }, 2000);

    setTimeout(() => {
        messageElement.style.display = "none";
    }, 3000);
}

async function clearCart(productId) {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
        alert("Login first to remove items from cart");
        return;
    }

    let userId = loggedUser.id;
    let cartUrl = `${cartApiUrl}?userId=${userId}`;

    try {
        const response = await fetch(cartUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const cartItems = await response.json();
        console.log("Fetched cart items:", cartItems);

        if (!cartItems.length || !cartItems[0].products.length) {
            console.log("No items in the cart.");
            return;
        }

        const cart = cartItems.find(item => item.userId == userId);
        console.log("Found cart:", cart);

        if (!cart) {
            console.log("Cart not found for this user.");
            return;
        }

        console.log("Cart before filtering:", cart.products);
        const updatedProducts = cart.products.filter(item => item.productId !== productId);
        console.log("Cart after filtering:", updatedProducts);

        if (updatedProducts.length === cart.products.length) {
            console.log(`Product with ID ${productId} not found in the cart.`);
            return;
        }

        // Create the payload to update the cart
        const updatedCart = {
            ...cart,
            products: updatedProducts
        };

        console.log(`Delete URL: ${cartApiUrl}/${cart.id}`);
        
        const updateResponse = await fetch(`${cartApiUrl}/${cart.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCart)
        });

        if (!updateResponse.ok) {
            throw new Error(`Error updating cart: ${updateResponse.status}`);
        }

        console.log("Product removed from cart.");
        getCartItems(); 

    } catch (error) {
        console.log("Error:", error);
    }
}

async function decrementCart(productId) {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
        alert("Login first to update the cart");
        return;
    }

    let userId = loggedUser.id;
    let cartUrl = `${cartApiUrl}?userId=${userId}`;

    try {
        const response = await fetch(cartUrl);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const cartItems = await response.json();

        if (!cartItems.length || !cartItems[0].products.length) {
            console.log("No items in the cart.");
            return;
        }

        const cart = cartItems.find(item => item.userId == userId);
        if (!cart) {
            console.log("Cart not found for this user.");
            return;
        }

        let updatedProducts = cart.products.map(item => {
            if (item.productId === productId) {
                item.quantity -= 1; // Decrease quantity
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove item if quantity is 0

        if (updatedProducts.length === cart.products.length) {
            console.log("Product quantity updated.");
        } else {
            console.log("Product removed from cart.");
        }

        // Update cart data
        const updatedCart = { ...cart, products: updatedProducts };
        
        await fetch(`${cartApiUrl}/${cart.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCart)
        });

        console.log("Cart updated successfully.");
        getCartItems(); // Refresh cart UI

    } catch (error) {
        console.log(error);
    }
}



async function getAdminProducts() {
    try {
        const response = await fetch(productsApiUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products);

        tableBody.innerHTML = ""
        for (let product of products) {
            let adminProduct = document.createElement('tr')
            adminProduct.innerHTML = `
            <td>${product.productName}</td>
            <td><img src="${product.image}" alt="image"></td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td class="actions">
            <i class="fa fa-edit" aria-hidden="true" onclick="openEditForm(${product.id})"></i>
              <i class="fa fa-trash" aria-hidden="true" onclick="deleteProduct(${product.id})"></i>
            </td>
            `
            console.log(adminProduct);

            tableBody.appendChild(adminProduct)
        }


        console.log("Products: ", products)
    } catch (error) {
        console.log(error);

    }

}
getAdminProducts()

async function deleteProduct(id) {
    const productUrl = `${productsApiUrl}/${id}`
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

// let prodId = localStorage.getItem("prodId") ? parseInt(localStorage.getItem("prodId")) : 1;

// const productForm = document.querySelector(".product-form")
// const formTitle = productForm.querySelector("h1");
// const submitButton = productForm.querySelector("button[type='submit']");
// productForm.onsubmit = async (event) => {
//     event.preventDefault()

//     const name = document.getElementById("productName").value
//     const image = document.getElementById("productImage").value
//     const price = document.getElementById("productPrice").value
//     const description = document.getElementById("productDesc").value

//     const newProduct = {
//         id: prodId,
//         productName: name,
//         image: image,
//         price: price,
//         description: description
//     }

//     try {
//         let response;
//         if (editId) {
//             response = await fetch(`${productsApiUrl}/${editId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newProduct)
//             });
//         } else {
//             response = await fetch(productsApiUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newProduct)
//             });
//         }

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`)
//         }
//         prodId++;
//         localStorage.setItem("prodId", prodId);


//         productForm.reset()
//         getProducts()
//         getAdminProducts()
//         closeForm()
//     } catch (error) {
//         console.log(error);

//     }

// }
let prodId = localStorage.getItem("prodId") ? parseInt(localStorage.getItem("prodId")) : 1;

const productForm = document.querySelector(".product-form");

if (productForm) {
    const formTitle = productForm.querySelector("h1");
    const submitButton = productForm.querySelector("button[type='submit']");

    productForm.onsubmit = async (event) => {
        event.preventDefault();

        const name = document.getElementById("productName")?.value.trim();
        const image = document.getElementById("productImage")?.value.trim();
        const price = document.getElementById("productPrice")?.value.trim();
        const description = document.getElementById("productDesc")?.value.trim();

        if (!name || !image || !price || !description) {
            console.log("All fields are required.");
            return;
        }

        const newProduct = {
            id: prodId,
            productName: name,
            image: image,
            price: price,
            description: description
        };

        try {
            let response;
            if (editId) {
                response = await fetch(`${productsApiUrl}/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct)
                });
            } else {
                response = await fetch(productsApiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProduct)
                });
            }

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            prodId++;
            localStorage.setItem("prodId", prodId);

            productForm.reset();
            getProducts();
            getAdminProducts();
            closeForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
} else {
    console.warn("Product form not found in the DOM.");
}


// if (productForm) {
//     productForm.onsubmit = async (event) => {
//         event.preventDefault()

//     const name = document.getElementById("productName").value
//     const image = document.getElementById("productImage").value
//     const price = document.getElementById("productPrice").value
//     const description = document.getElementById("productDesc").value

//     const newProduct = {
//         id: prodId,
//         productName: name,
//         image: image,
//         price: price,
//         description: description
//     }
//     console.log("editId:", editId); // Debugging

//     try {
//         console.log("Submitting product:", newProduct);
//     console.log("API URL:", editId ? `${productsApiUrl}/${editId}` : productsApiUrl);
// console.log("Response:", await response.json());

//         let response;
//         if (editId) {
//             response = await fetch(`${productsApiUrl}/${editId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newProduct)
//             });
//         } else {
//             response = await fetch(productsApiUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newProduct)
//             });
//         }

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }
//         prodId++;
//         localStorage.setItem("prodId", prodId);

//         productForm.reset();
//         getProducts();
//         getAdminProducts();
//         closeForm();
//     } catch (error) {
//         console.log(error);
//     }
//     };
// }



function openCreateForm() {
    const productForm = document.querySelector(".product-form");
    const formTitle = productForm.querySelector("h1");
    const submitButton = productForm.querySelector("button[type='submit']");


    document.querySelector(".product-form").style.display = "block";
    editId = null;
    formTitle.textContent = "Create New Product";
    submitButton.textContent = "Add Product";
    productForm.reset();
    productForm.style.display = "block";
}

function openEditForm(id) {
    const productForm = document.querySelector(".product-form");
    const formTitle = productForm.querySelector("h1");
    const submitButton = productForm.querySelector("button[type='submit']");

    document.querySelector(".product-form").style.display = "block";
    editId = id;
    formTitle.textContent = "Edit Product";
    submitButton.textContent = "Save Changes";
    productForm.style.display = "block";
    prepopulateForm(id);
}

const closeForm = () => {
    document.querySelector(".product-form").style.display = "none";
}
async function prepopulateForm(id) {
    try {
        const response = await fetch(`${productsApiUrl}/${id}`);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const product = await response.json();

        document.getElementById("productName").value = product.productName;
        document.getElementById("productImage").value = product.image;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productDesc").value = product.description;
    } catch (error) {
        console.error(error);
    }
}

