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


function getToken() {
    return localStorage.getItem(localStorageAuthKey)
}

function setToken(newToken) {
    localStorage.setItem(localStorageAuthKey, newToken)
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

function displayLoginLogout() {
    let li = document.createElement('li')
    let filter = document.getElementsByClassName("filter")[0]
    let editingBanner = document.getElementById("editing-banner")
    document.getElementById('login-logout').innerHTML = ""
    let headerPage = document.getElementById("header")
    let modifyGroup = document.getElementById("modify-group")
    let isLoggedIn = (getToken() !== null)
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


function login() {
    window.location.href = "login.html"
}

function logout() {
    localStorage.removeItem(localStorageAuthKey)
    displayLoginLogout()
}

