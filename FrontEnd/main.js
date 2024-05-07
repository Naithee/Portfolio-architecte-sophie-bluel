/*  Declaration of the path to the API (will allow us to not retype it for each request) */
const backendHost = "http://localhost:5678/api"

let worksRessource = [];
let displayedWorkRessource = []
let categoryKeysArray = ["Tous"]

/*  Function that gets the pictures and their titles from the API and insert them into the DOM  */
async function getWorksApi() {
    try {
        /*  Sends a request to the API for the ressource /works */
        let responsePictures = await fetch(`${backendHost}/works`)

        /* Deserializes the response of the request (turns the response into a JS object ) */
        let worksApiResponse = await responsePictures.json()

        /*  Throws an error if the response is not an array */
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

function displayPictures() {

    /*  Get the DOM element where the pictures will be inserted */
    const pictureContainer = document.querySelector(".gallery")


    /* Creates a new DOM elements for each picture and each title */
    for (let i = 0; i < worksRessource.length; i++) {

        /* console.log(worksRessource[i]) */
        let newFigure = document.createElement("figure")
        let newPicturElement = document.createElement("img")
        newPicturElement.src = worksRessource[i].imageUrl
        newPicturElement.alt = worksRessource[i].title
        let newFigcaption = document.createElement("figcaption")
        newFigcaption.innerText = worksRessource[i].title

        /*  Appends the new elements to the DOM */
        newFigure.appendChild(newPicturElement)
        newFigure.appendChild(newFigcaption)
        pictureContainer.appendChild(newFigure)
    }
}

/*  Filter function with If

function filterPictures(searchCategory) {

    let filteredArray = []
    for (let i = 0; i < worksRessource.length; i++) {

        if (worksRessource[i].category.name === searchCategory || searchCategory === "Tous") {
            filteredArray.push(worksRessource[i])
        }
    }

    return filteredArray
}
*/

function filterPictures(searchCategory) {

    return worksRessource.filter((element) => {
        return element.category.name === searchCategory || searchCategory === "Tous"
    })
}


// call the function 

console.log(new Date().getMilliseconds())

getWorksApi().then(() => {
    console.log(new Date().getMilliseconds())
    displayPictures() /* Call filter before with "Tous" */
    extractKeys()
    console.log(categoryKeysArray)
    console.log(filterPictures(categoryKeysArray[3]))
    console.log(worksRessource)
})


function extractKeys() {

    for (let i = 0; i < worksRessource.length; i++) {
        if (!categoryKeysArray.includes(worksRessource[i].category.name)) {

            categoryKeysArray.push(worksRessource[i].category.name)

        }
    }

}

/* 

Create a function that displays the keys from the categoryKeysArray[] in the DOM
Create another function that is exectuted onclick of one of they keys of the categoryKeysArray
that replaces the "displayedWorksRessource" with the result of "filteredPictures(selectedKeys)"
Change function displayPictures into display displayedWorkRessource

*/

