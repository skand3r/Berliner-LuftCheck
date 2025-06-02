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
    }, 
    {
        "username": 'normalo',
        "password": 'password',
        "role": 'non-admin',
        "name": 'Norman'
    }
]

let entryData = [
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

const updateInputs = {
    title: document.getElementById("update-title"),
    description: document.getElementById("update-description"),
    street: document.getElementById("update-street"),
    postal: document.getElementById("update-postal"),
    city: document.getElementById("update-city"),
    lat: document.getElementById("update-lat"),
    lon: document.getElementById("update-lon"),
    category: document.getElementById("update-category")
};

const updateImageInput = document.getElementById("update_image_input");
const updateImageInputDefaultDisplay = updateImageInput.style.display;

const updateButtons = {
    update: document.getElementById("update_submit"),
    delete: document.getElementById("update_delete"),
    cancel: document.getElementById("update_cancel"),
};

const addButton = document.getElementById("add_button");
const addButtonDefaultDisplay = addButton.style.display;

const addSubmitButton = document.getElementById("add_submit");
const addCancelButton = document.getElementById("add_cancel");
const addApiStatus = document.getElementById("add_api_status")
const updateApiStatus = document.getElementById("update_api_status")

const addInputs = {
    title: document.getElementById("add-title"),
    description: document.getElementById("add-description"),
    street: document.getElementById("add-street"),
    postal: document.getElementById("add-postal"),
    city: document.getElementById("add-city"),
    lat: document.getElementById("add-lat"),
    lon: document.getElementById("add-lon"),
    category: document.getElementById("add-category")
};

const loginForm = document.getElementById("login_form");
const loginError = document.getElementById("login_error");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const updateForm = document.getElementById("update-form");
const addForm = document.getElementById("add-form");

let editingIndex = null;
let currentUser = null;


loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the site from refreshing

    // get entered values
    let enteredUsername = usernameInput.value
    let enteredPassword = passwordInput.value

    // check users for matching username and password
    for (let user of Users) {
        if (user["username"] === enteredUsername && user["password"] === enteredPassword) {
            loginError.style.display = "none";
            loginUser(user);
            return
        }
    }
    
    // no matching credentials found, show an error
    showError()
});

function loginUser(user) {
    //clear login values
    usernameInput.value = "";
    passwordInput.value = "";


    currentUser = user;
    renderEntries();
    const welcomeText = document.getElementById("welcome-text");
    welcomeText.textContent = `Welcome ${user.name} to Berliner LuftCheck`;

    // show/hide add button depending on user role
    addButton.style.display = user.role === "admin" ? addButtonDefaultDisplay : "none";

    showScreen("main");
}

updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editingIndex === null) return;

    // if address is unchanged, dont update the coordinates
    if (updateInputs.street.value === entryData[editingIndex].street && updateInputs.postal.value === entryData[editingIndex].postal && updateInputs.city.value === entryData[editingIndex].city) {
        updateEntry();
        return;
    }

    updateApiStatus.style.color = "inherit";
    updateApiStatus.innerHTML = "getting coordinates...";

    updateButtonsSetEnabled(false);

    getLonLat(updateInputs.street.value, updateInputs.postal.value, updateInputs.city.value)
    .then(coords => {
        updateButtonsSetEnabled(true);
        updateApiStatus.innerHTML = "";
        console.log("Coordinates:", coords);
        updateInputs.lat.value = coords.lat;
        updateInputs.lon.value = coords.lon;
        updateEntry();
    })
    .catch(error => {
        updateButtonsSetEnabled(true);
        console.error("Error:", error);
        updateApiStatus.style.color = "#ff5555";
        updateApiStatus.innerHTML = "Error getting Coordinates: " + error;
    });
});

function updateEntry() {
    // fill entries
    entryData[editingIndex].title = updateInputs.title.value;
    entryData[editingIndex].description = updateInputs.description.value;
    entryData[editingIndex].street = updateInputs.street.value;
    entryData[editingIndex].postal = updateInputs.postal.value;
    entryData[editingIndex].city = updateInputs.city.value;
    entryData[editingIndex].lat = updateInputs.lat.value;
    entryData[editingIndex].lon = updateInputs.lon.value;
    entryData[editingIndex].category = updateInputs.category.value;


    const preview = document.getElementById("update_image");
    entryData[editingIndex].image = preview.src;


    editingIndex = null;


    renderEntries();
    showScreen("main");
}


function updateDelete() {
    entryData.splice(editingIndex, 1);
    renderEntries();
    showScreen("main");
}

addForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    addApiStatus.style.color = "inherit";
    addApiStatus.innerHTML = "getting coordinates...";

    addButtonsSetEnabled(false);

    getLonLat(addInputs.street.value, addInputs.postal.value, addInputs.city.value)
    .then(coords => {
        addButtonsSetEnabled(true);
        addApiStatus.innerHTML = "";
        console.log("Coordinates:", coords);
        addInputs.lat.value = coords.lat;
        addInputs.lon.value = coords.lon;
        addEntry();
    })
    .catch(error => {
        addButtonsSetEnabled(true);
        console.error("Error:", error);
        addApiStatus.style.color = "#ff5555";
        addApiStatus.innerHTML = "Error getting Coordinates: " + error;
    });
});

function addButtonsSetEnabled(enabled) {
    addSubmitButton.disabled = !enabled;
    addCancelButton.disabled = !enabled;
}

function updateButtonsSetEnabled(enabled) {
    updateButtons.cancel.disabled = !enabled;
    updateButtons.delete.disabled = !enabled;
    updateButtons.update.disabled = !enabled;
}

function addEntry () {
    let newEntry = {};

    // fill entries
    newEntry.title = addInputs.title.value;
    newEntry.description = addInputs.description.value;
    newEntry.street = addInputs.street.value;
    newEntry.postal = addInputs.postal.value;
    newEntry.city = addInputs.city.value;
    newEntry.lat = addInputs.lat.value;
    newEntry.lon = addInputs.lon.value;
    newEntry.category = addInputs.category.value;


    const preview = document.getElementById("add-image");
    newEntry.image = preview.src;

    entryData.push(newEntry);


    renderEntries();
    showScreen("main");
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
    //fill inputs
    updateInputs.title.value = entry.title;
    updateInputs.description.value = entry.description;
    updateInputs.street.value = entry.street;
    updateInputs.postal.value = entry.postal;
    updateInputs.city.value = entry.city;
    updateInputs.lat.value = entry.lat;
    updateInputs.lon.value = entry.lon;
    updateInputs.category.value = entry.category;

    // make entries editable depending on user role
    let userIsAdmin = currentUser["role"] === "admin";
    for (input of Object.values(updateInputs)) {
        input.readOnly = !userIsAdmin;

        // keep coordinate inputs readonly
        if (input.id === "update-lat" || input.id === "update-lon") input.readOnly = true;
    }

    // show/hide buttons depending on user role
    updateButtons.update.style.display = userIsAdmin ? updateButtons.updateDefaultDisplay : "none";
    updateButtons.delete.style.display = userIsAdmin ? updateButtons.deleteDefaultDisplay : "none";
    updateImageInput.style.display = userIsAdmin ? updateImageInputDefaultDisplay : "none";
    
    const preview = document.getElementById("update_image");
    preview.src = entry.image || "";
    preview.style.display = entry.image ? "block" : "none";
}

function getLonLat(street, postal, city) {
    // use encodeURIComponent to automatically convert special characters
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(street + ' ' + postal + ' ' + city)}&apiKey=f4480c048f294d0daefc2b8b8cca4fcc`;

    // creating a Promise for returning the result
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", url, true);

        httpRequest.onload = function () {
            if (this.status === 200) {
                const obj = JSON.parse(this.responseText);
                console.log(obj)
                if (obj.features && obj.features.length > 0) {
                    const coords = {
                        lon: obj.features[0].properties.lon,
                        lat: obj.features[0].properties.lat
                    };
                    resolve(coords);
                } else {
                    reject("No results found");
                }
            } else {
                reject(`HTTP error: ${this.status}`);
            }
        };

        httpRequest.onerror = function () {
            reject("Network error");
        };

        httpRequest.send();
    });
}


// function delete (item) {}
function showError() {
    passwordInput.value = "";
    loginError.style.display = "block";
}

// function to initialize the site
function init() {
    updateButtons.updateDefaultDisplay = updateButtons.update.style.display;
    updateButtons.deleteDefaultDisplay = updateButtons.delete.style.display;

    // Show the login screen by default
    showScreen("login");
}

init();