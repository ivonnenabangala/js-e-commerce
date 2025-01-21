const productsApiUrl = "http://localhost:3000/products"
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


async function getAdminProducts() {
    try {
        const response = await fetch(productsApiUrl)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products);
        
        tableBody.innerHTML = ""
        for(let product of products){
            let adminProduct = document.createElement('tr')
            adminProduct.innerHTML = `
           
         
            <td>${product.productName}</td>
            <td><img src="${product.image}" alt="image"></td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td class="actions">
            <i class="fa fa-edit" aria-hidden="true" onclick="openForm(); prepopulateForm(${product.id})"></i>
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
    const productUrl = productsApiUrl + `/${id}`
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

async function createProduct() {

    
}

