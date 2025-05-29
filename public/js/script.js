let screens = {
    "login": document.getElementById("Login_Section"),
    "main": document.getElementById("Main_Section"),
    "add": document.getElementById("Add_Section"),
    "update": document.getElementById("Update_Section")
}

const Users = [
    {
        "username": 'admina',
        "password": 'password',
        "role": 'admin',
        "name": 'Mina'
    }, {
        "username": 'normalo',
        "password": 'password',
        "role": 'non-admin',
        "name": 'Norman'
    }
]

const entryData = [
    {
        title: "Bike path ends abruptly",
        description: "Bike path ends abruptly without warning",
        street: "Willheminenshof 75",
        postal: "10657",
        city: "Berlin",
        lat: "52.45634",
        lon: "18.3213",
        category: "radweg",
        image: "images/1.png"
    },
    {
        title: "Deviation due to construction",
        description: "Construction alters bike path",
        street: "Treskowalle 12",
        postal: "12657",
        city: "Berlin",
        lat: "56.3453",
        lon: "16.5213",
        category: "baustellen",
        image: "images/2.png"
    },
    {
        title: "Sharp deviation angle",
        description: "Dangerous angle in the path",
        street: "Treskowalle 19",
        postal: "12657",
        city: "Berlin",
        lat: "56.3453",
        lon: "17.5213",
        category: "radweg",
        image: null
    }
];



showScreen("login");

let loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the site from refreshing

    let currentUser;
    if (document.getElementById("username").value === "admina" && document.getElementById("password").value === "password") {
        currentUser = Users[0];
        renderEntries();

    }

    else if (document.getElementById("username").value === "normalo" && document.getElementById("password").value === "password") {
        currentUser = Users[1];
        renderEntries();
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


function renderEntries() {
    const container = document.getElementById("entry_container");
    container.innerHTML = "";

    entryData.forEach((entry, index) => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "entry";

        entryDiv.innerHTML = `
        <h3>${entry.title}</h3>
                <p>${entry.description}</p>
                <p><b>Street:</b> ${entry.street}</p>
                <p><b>Postal Code:</b> ${entry.postal}</p>
                <p><b>City:</b> ${entry.city}</p>
                <p><b>Lat:</b> ${entry.lat}</p>
                <p><b>Lon:</b> ${entry.lon}</p>
                <p><b>Category:</b> ${entry.category}</p>
                ${entry.image ? `<img src="${entry.image}" alt="image ${index + 1}">` : ""}
        `;


        container.appendChild(entryDiv);
    })
}

// function delete (item) {}


// Show the login screen by default
showScreen("login");