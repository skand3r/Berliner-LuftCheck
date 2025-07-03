let screens = {
    "login": document.getElementById("Login_Section"),
    "main": document.getElementById("Main_Section"),
    "add": document.getElementById("Add_Section"),
    "update": document.getElementById("Update_Section")
}

const LOGIN_URL = "/login";
const LOCATION_URL = "/loc";

let entryData = [];

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

const update_preview = document.getElementById("update_image");

const addButton = document.getElementById("add_button");
const addButtonDefaultDisplay = addButton.style.display;

const addImageInput = document.getElementById("add-image");
const add_preview = document.getElementById("add-image-preview");

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

let currentlyEditing = null;
let currentUser = null;


loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the site from refreshing

    // get entered values
    let enteredUsername = usernameInput.value
    let enteredPassword = passwordInput.value

    // check if credentials are valid
    checkLogin(enteredUsername, enteredPassword)
    .then(user => {
        // if credentials are valid, login user
        loginUser(user);
    })
    .catch(error => {
        showError()
        console.error("Login error:", error);
    });
});

function checkLogin(username, password) {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", LOGIN_URL, true);
        httpRequest.setRequestHeader("Content-Type", "application/json");

        httpRequest.onload = function () {
            if (this.status === 200) {
                const user = JSON.parse(this.responseText);
                resolve(user);
            } else {
                reject("Login failed: " + this.statusText);
            }
        };

        httpRequest.onerror = function () {
            reject("Network error");
        };

        const data = JSON.stringify({ username: username, password: password });
        httpRequest.send(data);
    });
}

function loginUser(user) {
    //clear login values
    usernameInput.value = "";
    passwordInput.value = "";


    currentUser = user;
    const welcomeText = document.getElementById("welcome-text");
    welcomeText.textContent = `Welcome ${user.name} to Berliner LuftCheck`;

    // show/hide add button depending on user role
    addButton.style.display = user.role === "admin" ? addButtonDefaultDisplay : "none";

    // wait for entries to be updated before showing the main screen
    updateEntriesAndShowMainScreen();
}

updateImageInput.addEventListener("change", function () {
    console.log("Update image input changed");
    getImageData(updateImageInput)
    .then(imageData => {
        update_preview.src = imageData; // set the preview image to the new image data
        update_preview.style.display = "block"; // show the preview image
    })
    .catch(error => {
        console.error("Error getting image data:", error);
        updateApiStatus.innerHTML = "Error getting image data: " + error;
        updateApiStatus.style.color = "#ff5555";
    });
});

addImageInput.addEventListener("change", function () {
    getImageData(addImageInput)
    .then(imageData => {
        add_preview.src = imageData; // set the preview image to the new image data
        add_preview.style.display = "block"; // show the preview image
    })
    .catch(error => {
        console.error("Error getting image data:", error);
        addApiStatus.innerHTML = "Error getting image data: " + error;
        addApiStatus.style.color = "#ff5555";
    });
});

updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentlyEditing === null) return;

    // if address is unchanged, dont update the coordinates
    if (updateInputs.street.value === currentlyEditing.street && updateInputs.postal.value === currentlyEditing.postal && updateInputs.city.value === currentlyEditing.city) {
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

function updateEntriesAndShowMainScreen() {
    updateEntries().then(() => {
        showScreen("main");
    });
}

function getImageData(inputElement) {
    return new Promise((resolve, reject) => {
        const file = inputElement.files[0];
        if (!file) {
            reject("No file selected");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;
            resolve(imageData);
        };
        reader.onerror = function () {
            reject("Error reading file");
        };
        reader.readAsDataURL(file);
    });
}

async function updateEntry() {
    // check if currentlyEditing is null
    if (currentlyEditing === null) return;

    // fill body with updated values
    const body = {
        title: updateInputs.title.value ? updateInputs.title.value : currentlyEditing.title,
        description: updateInputs.description.value ? updateInputs.description.value : currentlyEditing.description,
        street: updateInputs.street.value ? updateInputs.street.value : currentlyEditing.street,
        postal: updateInputs.postal.value ? updateInputs.postal.value : currentlyEditing.postal,
        city: updateInputs.city.value ? updateInputs.city.value : currentlyEditing.city,
        lat: updateInputs.lat.value,
        lon: updateInputs.lon.value,
        category: updateInputs.category.value,
        image: update_preview.src // use the preview image as the new image
    }

    // send PUT request to update entry
    new Promise((resolve) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("PUT", `${LOCATION_URL}/${currentlyEditing._id}`, true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.onload = function () {
            if (this.status === 204) {
                console.log("Entry updated:", this.responseText);
                updateApiStatus.innerHTML = "";
                resolve();
            } else {
                console.error("Error updating entry:", this.statusText);
                updateApiStatus.innerHTML = "Error updating entry: " + this.statusText;
                updateApiStatus.style.color = "#ff5555";
            }
        };

        httpRequest.onerror = function () {
            console.error("Network error");
            updateApiStatus.innerHTML = "Network error";
            updateApiStatus.style.color = "#ff5555";
            reject("Network error");
        };

        httpRequest.send(JSON.stringify(body));
    }).then(() => {
        currentlyEditing = null;
        updateEntriesAndShowMainScreen();
    });
}

function deleteEntry(id) {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("DELETE", `${LOCATION_URL}/${id}`, true);

        httpRequest.onload = function () {
            if (this.status === 204) {
                resolve();
            } else {
                reject("Failed to delete entry: " + this.statusText);
            }
        };

        httpRequest.onerror = function () {
            reject("Network error");
        };

        httpRequest.send();
    });
}

function updateDelete() {
    if (currentlyEditing === null) return;
    deleteEntry(currentlyEditing._id);
    updateEntriesAndShowMainScreen();
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


    newEntry.image = add_preview.src; // use the preview image as the new image

    // post entry to server
    postEntry(newEntry)
    .then(response => {
        console.log("Entry added:", response);

        // clear inputs
        addInputs.title.value = "";
        addInputs.description.value = "";
        addInputs.street.value = "";
        addInputs.postal.value = "";
        addInputs.city.value = "";
        addInputs.lat.value = "";
        addInputs.lon.value = "";
        addInputs.category.value = "";
        add_preview.src = ""; // clear image preview

        addApiStatus.innerHTML = "";
    })
    .catch(error => {
        console.error("Error adding entry:", error);
        addApiStatus.innerHTML = "Error adding entry: " + error;
        addApiStatus.style.color = "#ff5555";
    });

    updateEntriesAndShowMainScreen();
}

function postEntry(entry) {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", LOCATION_URL, true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.onload = function () {
            if (this.status === 201) {
                const newEntry = this.getResponseHeader("Location");
                return newEntry
            } else {
                reject("Failed to post entry: " + this.statusText);
            }
        };
        httpRequest.onerror = function () {
            reject("Network error");
        };
        httpRequest.send(JSON.stringify(entry));
    });
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

function updateEntries() {
    return new Promise((resolve, reject) => {
        // fetch entries from server
        fetchEntries().then(entries => {
            entryData = entries;
            renderEntries();
            resolve();
        }).catch(error => {
            console.error("Error fetching entries:", error);
            alert("Error fetching entries: " + error);
            reject(error);
        });
    });
}

function fetchEntries() {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", LOCATION_URL, true);

        httpRequest.onload = function () {
            if (this.status === 200) {
                const entries = JSON.parse(this.responseText);
                resolve(entries);
            } else {
                reject("Failed getting Entries" + this.statusText);
            }
        };

        httpRequest.onerror = function () {
            reject("Network error");
        };

        httpRequest.send();
    });
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
            currentlyEditing = entry; // set currentlyEditing to the clicked entry
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

        // keep coordinate and city inputs readonly
        if (input.id === "update-lat" || input.id === "update-lon" || input.id === "update-city") input.readOnly = true;
    }

    //select element cannot be readonly, so we disable it instead
    updateInputs.category.disabled = !userIsAdmin;

    // show/hide buttons depending on user role
    updateButtons.update.style.display = userIsAdmin ? updateButtons.updateDefaultDisplay : "none";
    updateButtons.delete.style.display = userIsAdmin ? updateButtons.deleteDefaultDisplay : "none";
    updateImageInput.style.display = userIsAdmin ? updateImageInputDefaultDisplay : "none";
    
    const preview = document.getElementById("update_image");
    preview.src = entry.image || "";
    preview.style.display = entry.image ? "block" : "none";

    updateApiStatus.innerHTML = "";
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