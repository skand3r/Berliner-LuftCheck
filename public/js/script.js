let screens = {
    "login": document.getElementById("Login_Section"),
    "main": document.getElementById("Main_Section"),
    "add": document.getElementById("Add_Section"),
    "update": document.getElementById("Update_Section")
}

let admina = {
    "username": 'admina',
    "password": 'password',
    "role": 'admin',
    "name": 'Mina'
}

let normalo = {
    "username": 'normalo',
    "password": 'password',
    "role": 'non-admin',
    "name": 'Norman'
}


showScreen("login");

let loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the site from refreshing

    let currentUser;
    if (document.getElementById("username").value === "admina" && document.getElementById("password").value === "password") {
        currentUser = admina;

    }

    else if (document.getElementById("username").value === "normalo" && document.getElementById("password").value === "password") {
        currentUser = normalo;
    }

    else {
        showError()
    }

    const welcomeText = document.getElementById("welcome-text")
    welcomeText.textContent = `Welcome ${currentUser.name} to Berliner LuftCheck`


    // TODO: Actual login logic

    // for now, just show the main screen
    showScreen("main");
});

const entries = document.getElementsByClassName("entry");

for (let i = 0; i < entries.length; i++) {
    entries[i].addEventListener("click", () => showScreen("update"));
}




function showScreen(screenName) {
    for (let screen in screens) {
        if (screen === screenName) {
            screens[screen].style.display = "block";
        } else {
            screens[screen].style.display = "none";
        }
    }
}

function showError() { }

// function delete (item) {}


// Show the login screen by default
showScreen("login");