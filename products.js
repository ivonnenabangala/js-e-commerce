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

let prodId = localStorage.getItem("prodId") ? parseInt(localStorage.getItem("prodId")) : 1;

const productForm = document.querySelector(".product-form")
const formTitle = productForm.querySelector("h1");
const submitButton = productForm.querySelector("button[type='submit']");
productForm.onsubmit = async (event) => {
    event.preventDefault()

    const name = document.getElementById("productName").value
    const image = document.getElementById("productImage").value
    const price = document.getElementById("productPrice").value
    const description = document.getElementById("productDesc").value

    const newProduct = {
        id: prodId,
        productName: name,
        image: image,
        price: price,
        description: description
    }

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
            throw new Error(`Response status: ${response.status}`)
        }
        prodId++;
        localStorage.setItem("prodId", prodId);


        productForm.reset()
        getProducts()
        getAdminProducts()
        closeForm()
    } catch (error) {
        console.log(error);

    }

}

// const openCreateForm = () => {
//     document.querySelector(".product-form").style.display = "block";
// }
function openCreateForm() {
    document.querySelector(".product-form").style.display = "block";
    editId = null;
    formTitle.textContent = "Create New Product";
    submitButton.textContent = "Add Product";
    productForm.reset();
    productForm.style.display = "block";
}

function openEditForm(id) {
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

