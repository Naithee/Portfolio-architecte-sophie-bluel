/*   
Declaration of the path to the API (will allow us to not retype it for each request) 

This const is located in a different file to prevent loading the main.js just for the backendHost
*/
const backendHost = "http://localhost:5678/api"
const localStorageAuthKey = "bearer-token"


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