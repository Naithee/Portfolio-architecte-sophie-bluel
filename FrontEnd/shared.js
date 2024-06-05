/*   
Declaration of the path to the API (will allow us to not retype it for each request) 
This const is located in a different file to prevent loading the main.js just for the backendHost
*/
const backendHost = "http://localhost:5678/api"


const localStorageAuthKey = "bearer-token"

// Stores the API content displayed in the DOM  
let displayedWorksRessource = []

// Stores the API response for the "works" ressource 
let worksRessource = [];

//  Sets new token
function setToken(newToken) {
    localStorage.setItem(localStorageAuthKey, newToken)
}

// Gets session token
function getToken() {
    return localStorage.getItem(localStorageAuthKey)
}

//  Function that gets the data from the API and deserializes it
async function getWorksApi() {
    try {
        //  Sends a request to the API for the ressource /works
        let responsePictures = await fetch(`${backendHost}/works`)

        // Deserializes the response of the request (turns the response into a JS object )
        let worksApiResponse = await responsePictures.json()

        //  Throws an error if the response is not an array 
        if (!Array.isArray(worksApiResponse)) {
            throw new Error("Unexpected response")
        }
        worksRessource = worksApiResponse

    }
    catch (error) {
        console.log("Error while fetching images")
        console.log(error)
    }
}

// Displays the editing mode if the user is logged in
function displayLoginLogout() {

    let li = document.createElement('li')
    let filter = document.getElementsByClassName("filter")[0]
    let editingBanner = document.getElementById("editing-banner")
    document.getElementById('login-logout').innerHTML = ""
    let headerPage = document.getElementById("header")
    let modifyGroup = document.getElementById("modify-group")
    let isLoggedIn = (getToken() !== null)

    // Checks if the user is logged in and adjusts the style according to the session
    if (!isLoggedIn) {
        li.setAttribute('onclick', "login()")
        li.innerHTML = "login"
        filter.style.display = "flex"
        editingBanner.style.display = "none"
        modifyGroup.style.display = "none"
        headerPage.style.marginTop = "50px"
    } else {
        li.setAttribute('onclick', "logout()")
        li.innerHTML = "logout"
        filter.style.display = "none"
        modifyGroup.style.display = "flex"
        editingBanner.style.display = "flex"
        headerPage.style.marginTop = "100px"
    }

    document.getElementById('login-logout').appendChild(li)
}

// Redirects to the login page
function login() {
    window.location.href = "login.html"
}

// Removes the token to disconect the user and display the belonging session style
function logout() {
    localStorage.removeItem(localStorageAuthKey)
    displayLoginLogout()
}


// Renders the pictures of the portfolio and the popup galleries 
function addToGallery(gallery, picture, mode) {

    // Verifies that the input is valid
    if (!gallery || typeof picture !== 'object' || !picture.id || !picture.title || !picture || (mode !== "portfolio" && mode !== "popup")) {
        throw new Error("addToGallery() wrong input")
    }

    // Renders the pictures with DOM elements
    let newFigure = document.createElement("figure")
    let newPictureElement = document.createElement("img")
    newPictureElement.src = picture.imageUrl
    newPictureElement.alt = picture.title
    newFigure.setAttribute("picture-name", picture.id)

    // Adds trashcan icone and a picture-name for the popup mode
    if (mode !== "portfolio") {
        let newIcon = document.createElement("i")
        newIcon.classList.add("fa-solid", "fa-trash-can")
        newIcon.setAttribute("onclick", "removePopupWork(event)")
        newFigure.appendChild(newIcon)
    }

    newFigure.appendChild(newPictureElement)
    gallery.appendChild(newFigure)
}
