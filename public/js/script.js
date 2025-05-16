let screens = {
    "login": document.getElementById("Login_Section"),
    "main": document.getElementById("Main_Section"),
    "add": document.getElementById("Add_Section"),
    "update": document.getElementById("Update_Section")
}

let loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the site from refreshing

    // TODO: Actual login logic
    
    // for now, just show the main screen
    showScreen("main");
});

function showScreen(screenName) {
    for (let screen in screens) {
        if (screen === screenName) {
            screens[screen].style.display = "block";
        } else {
            screens[screen].style.display = "none";
        }
    }
}


// Show the login screen by default
showScreen("login");