//  Declaration of the path to the API (will allow us to not retype it for each request) 
const backendHost = "http://localhost:5678/api"

// Gets the DOM input for email
let userEmailInput = document.getElementById("email")
// Gets the DOM input for passwords
let userPasswordInput = document.getElementById("password")

// Verifies the format of the email input
function verifyEmail() {

    // Gets the DOM element that will display the error message
    const errorMessage = document.getElementById("errorMessage")

    // Sets a new regular expression to define the format of the email
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+")

    /* Throws an error if the value of the email input does
     not match the format defined by the regular expression */
    if (!emailRegExp.test(userEmailInput.value)) {
        errorMessage.innerText = "Erreur dans l'identifiant."
        throw new Error("Email invalide.").message = "Erreur dans l'identifiant"
    }
}

// Verifies the users' inputs and posts them to the API
function allowAccess() {

    // Gets the DOM element that holds the inputs and the submit button
    const form = document.querySelector("form")

    // Listens to the submit of the form
    form.addEventListener("submit", async (event) => {

        /* Prevents the default behaviour of the page (no reloading of the page allows us
             to treat the data with JS instead of sending it to the server */
        event.preventDefault()

        try {
            // Calls the function that verifies the email input
            verifyEmail(userEmailInput.value)

            // Throws an error if the password is shorter than 3 characters
            if (userPasswordInput.value.length < 3) {
                errorMessage.innerText = "Mot de passe invalide"
                throw new Error("Mot de passe invalide")
            }
        }
        // (￣﹃￣) where is the error defined + what is return for?
        catch (error) {
            console.log(error)
            return
        }

        // Parameter of the fetch function that sets the options of the post method
        let postOptions = {
            // Defines which method we use with fetch
            method: "POST",
            // Defines the type of the request that will be sent and converts its content into string
            body: JSON.stringify({
                email: userEmailInput.value,
                password: userPasswordInput.value
            }),
            // Specifies the type of data that will be sent
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        // Posts the passwords and emails to the API at the login ressource
        let loginResponse = await fetch(`${backendHost}/users/login`, postOptions)

        /* Deserializes the response of the API and redirects to the edit mode homepage 
        if the access is allowed (200) */
        if (loginResponse.status === 200) {
            let readableResponse = await loginResponse.json()
            console.log(readableResponse)
            window.location.href = "editing.mode.html"
        } 
        // Displays an error if the access is denied (401 or 404)
        else {
            errorMessage.innerText = "Identifiant ou mot de passe invalide."
        }
    })

}


allowAccess()


