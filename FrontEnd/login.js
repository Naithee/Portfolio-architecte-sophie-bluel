const backendHost = "http://localhost:5678/api"

let userEmailInput = document.getElementById("email")
let userPasswordInput = document.getElementById("password")

function loadLoginPage() {
    window.location.href = "login.html"
}

// add bearer token for password

function getUserInput() {

    const form = document.querySelector("form")

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        try {
            verifyEmail(userEmailInput.value)
            if (userPasswordInput.value.length < 3) {
                errorMessage.innerText = "Mot de passe invalide"
                throw new Error("Mot de passe invalide")
            }
        }
        catch (error) {
            console.log(error)
            return
        }
        let postOptions = {
            method: "POST", body: JSON.stringify({
                email: userEmailInput.value,
                password: userPasswordInput.value
            }), headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        let loginResponse = await fetch(`${backendHost}/users/login`, postOptions)
        if (loginResponse.status === 200) {
            let readableResponse = await loginResponse.json()
            console.log(readableResponse)
            window.location.href = "index.html"
            /* Create a new HTML file called edition mode and redirect to this file instead
            (don't forget to do the style with the black banner + modify icone)
            */
        } else {
            errorMessage.innerText = "Identifiant ou mot de passe invalide."
        }
    })


}

getUserInput()



function verifyEmail(loginEmail) {

    const errorMessage = document.getElementById("errorMessage")
    console.log(errorMessage)
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+")

    if (!emailRegExp.test(userEmailInput.value)) {
        errorMessage.innerText = "Erreur dans l'identifiant"
        throw new Error("Email invalide.").message = "Erreur dans l'identifiant"
    }
    console.log(userEmailInput.value)

}


function allowAccess() {



}