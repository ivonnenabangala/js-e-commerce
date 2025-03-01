const usersApiUrl = "http://localhost:3000/users"

const accountExistsMsg = document.getElementById("account-exists")
const successMessage = document.getElementById("account-success");
const invalidMessage = document.getElementById("incomplete-form");
const incorrectCredentials = document.querySelector(".incorret-credentials")


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
    if (!username || !password) {
        console.log("Showing incomplete form message"); // Debugging line
        invalidMessage.style.display = "block";
        return;
    }
    

    const newUser = {
        id: userId,
        name: name,
        username: username,
        email: email,
        role: "customer",
        password: password
    }

    try {
        let checkResponse = await fetch(`${usersApiUrl}?email=${email}`);
        let existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {
            accountExistsMsg.style.display = "block";
            setTimeout(() => {
                accountExistsMsg.style.display = "none";
            }, 4000);
            return; 
        }
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
        Swal.fire({
            title: "Account Created Successfullt",
            text: "Log in to your account to proceed!",
            icon: "success",
            confirmButtonText: "OK"
        });

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
    if (!username || !password) {
        invalidMessage.style.display = "block";
        return;
    }

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
            // Swal.fire({
            //     title: "Login Successful!",
            //     text: "Welcome back!",
            //     icon: "success",
            //     confirmButtonText: "OK"
            // });
            document.querySelector(".login-form").style.display = "none"
        }
        console.log("Logged user: ", loggedUser);
        if(loggedUser.role == "admin"){
            document.querySelector(".admin-products").style.display = "block";
        }
        if(loggedUser){
            document.querySelector(".btn-login").style.display = "none"
            document.querySelector(".btn-sign-up").style.display = "none"
            document.querySelector(".logout-btn").style.display = "block"

        }
        console.log(loggedUser.username);
        

    } catch (error) {
        console.log(error);

    }

}

const openLoginForm = () => {
        document.querySelector(".login-form").style.display = "block";
}
const openSignUpForm = () => {
    document.querySelector(".sign-up-form").style.display = "block";
}
const closeOpenForm = () => {
    document.querySelector(".sign-up-form").style.display = "none";
    document.querySelector(".login-form").style.display = "none";
}
function logout() {
    localStorage.clear()
    document.querySelector(".btn-login").style.display = "block"
    document.querySelector(".btn-sign-up").style.display = "block"
    document.querySelector(".logout-btn").style.display = "none"
    document.querySelector(".admin-products").style.display = "none";
}