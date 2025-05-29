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
        category: "bike-path",
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
        category: "construction",
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
        category: "bike-path",
        image: null
    }
];


let editingIndex = null;


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


    showScreen("main");
});


let updateForm = document.getElementById("update-form");

updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editingIndex === null) return;


    entryData[editingIndex].title = document.getElementById("update-title").value;
    entryData[editingIndex].description = document.getElementById("update-description").value;
    entryData[editingIndex].street = document.getElementById("update-street").value;
    entryData[editingIndex].postal = document.getElementById("update-postal").value;
    entryData[editingIndex].city = document.getElementById("update-city").value;
    entryData[editingIndex].lat = document.getElementById("update-lat").value;
    entryData[editingIndex].lon = document.getElementById("update-lon").value;
    entryData[editingIndex].category = document.getElementById("update-category").value;


    const preview = document.getElementById("update_image");
    entryData[editingIndex].image = preview.src;


    editingIndex = null;


    renderEntries();
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

        entryDiv.addEventListener("click", () => {
            editingIndex = index;
            fillUpdateForm(entry);
            showScreen("update")
        });
        container.appendChild(entryDiv);
    })
}


function fillUpdateForm(entry) {
    document.getElementById("update-title").value = entry.title;
    document.getElementById("update-description").value = entry.description;
    document.getElementById("update-street").value = entry.street;
    document.getElementById("update-postal").value = entry.postal;
    document.getElementById("update-city").value = entry.city;
    document.getElementById("update-lat").value = entry.lat;
    document.getElementById("update-lon").value = entry.lon;
    document.getElementById("update-category").value = entry.category;


    const preview = document.getElementById("update_image");
    preview.src = entry.image || "";
    preview.style.display = entry.image ? "block" : "none";
}

function getLonLat(e) {
    e.preventDefault();
    let street = document.getElementById("update-street").value;
    let postal = document.getElementById("update-postal").value;
    let city = document.getElementById("update-city").value;

    let httpRequest = new XMLHttpRequest();
    const url = `https://api.geoapify.com/v1/geocode/search?text=${street}%20${postal}%20${city}&apiKey=f4480c048f294d0daefc2b8b8cca4fcc`

    httpRequest.open("GET", url, true);

    httpRequest.onerror = function () {
        console.log("Connecting to server with " + url + " failed!\n");
    };

    httpRequest.onload = function () {
        let data = this.response;
        let obj = JSON.parse(data)
        if (this.status == 200) {
            document.getElementById("update-lon").value = obj.features[0].properties.lon;
            document.getElementById("update-lat").value = obj.features[0].properties.lat;
        }
        else {
            console.log("HTTP-status code was: " + this.status);
        }
    }

    httpRequest.send();

}
// function delete (item) {}
// function showError() {}

// Show the login screen by default
showScreen("login");