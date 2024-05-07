/*  Declaration of the path to the API (will allow us to not retype it for each request) */
const backendHost = "http://localhost:5678/api"

/*  Function that gets the pictures and their titles from the API and insert them into the DOM  */
async function displayPictures() {

/*  Get the DOM element where the pictures will be inserted */
    const pictureContainer = document.querySelector(".gallery")

    try {
        /*  Sends a request to the API for the ressource /works */
        let responsePictures = await fetch(`${backendHost}/works`)
        console.log(responsePictures)

        /* Deserializes the response of the request (turns the response into a JS object ) */
        let picturesGalery = await responsePictures.json()

        /*  Throws an error if the response is not an array */
        if (!Array.isArray(picturesGalery)) {
            throw new Error("Unexpected response")
        }

        /* Creates a new DOM elements for each picture and each title */
        for (let i = 0; i < picturesGalery.length; i++) {

            console.log(picturesGalery[i])
            let newFigure = document.createElement("figure")
            let newPicturElement = document.createElement("img")
            newPicturElement.src = picturesGalery[i].imageUrl
            newPicturElement.alt = picturesGalery[i].title
            let newFigcaption = document.createElement("figcaption")
            newFigcaption.innerText = picturesGalery[i].title

            /*  Appends the new elements to the DOM */
            newFigure.appendChild(newPicturElement)
            newFigure.appendChild(newFigcaption)
            pictureContainer.appendChild(newFigure)
        }

    }
    catch (error) {
        console.log("Error while fetching images")
        console.log(error)
    }


}

displayPictures()