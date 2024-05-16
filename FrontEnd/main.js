//  Declaration of the path to the API (will allow us to not retype it for each request) 
const backendHost = "http://localhost:5678/api"

// Stores the API response for the "works" ressource 
let worksRessource = [];
// Stores the API content displayed in the DOM  
let displayedWorksRessource = []
// Stores the category names of the works, initialised with "Tous"
let categoryKeysArray = ["Tous"]

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

//  Renders the gallery content with the API response
function renderGalleryContent() {

    //  Get the DOM element where the pictures will be inserted 
    const pictureContainer = document.querySelector(".gallery")
    //  Removes the content of the gallery in the DOM
    pictureContainer.innerHTML = ""
    console.log(pictureContainer)

    /* Creates a new DOM element for each object of the API response /works 
    (we access the pictures and the titles of each object and display them)
    */
    for (let i = 0; i < displayedWorksRessource.length; i++) {

        let newFigure = document.createElement("figure")
        let newPicturElement = document.createElement("img")
        newPicturElement.src = displayedWorksRessource[i].imageUrl
        newPicturElement.alt = displayedWorksRessource[i].title
        let newFigcaption = document.createElement("figcaption")
        newFigcaption.innerText = displayedWorksRessource[i].title

        //  Appends the new elements to the DOM
        newFigure.appendChild(newPicturElement)
        newFigure.appendChild(newFigcaption)
        pictureContainer.appendChild(newFigure)
    }
}

function renderPopupGallery() {
    const popupGallery = document.querySelector(".popup-gallery")

    for (let i = 0; i < displayedWorksRessource.length; i++) {

        let newFigure = document.createElement("figure")
        let newPictureElement = document.createElement("img")
        newPictureElement.src = displayedWorksRessource[i].imageUrl
        newPictureElement.alt = displayedWorksRessource[i].title
        let newIcon = document.createElement("i")
        newIcon.classList.add("fa-solid", "fa-trash-can")
        newIcon.setAttribute("onclick", "removePopupWork()")
        newFigure.setAttribute("picture-name", displayedWorksRessource[i]) //not working yet

        newFigure.appendChild(newPictureElement)
        newFigure.appendChild(newIcon)
        popupGallery.appendChild(newFigure)
    }

}

// not working yet + move all the functions related to popup in another file
async function removePopupWork() {
    console.log("test")

    let workId = displayedWorksRessource.id

    const deleteOptions = {
        method: "DELETE",
        body: JSON.stringify({ id: workId }), // no body just id as a path
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    let deleteResponse = await fetch(`${backendHost}/works/{id}`, deleteOptions)
    if (deleteResponse === 200) {
        console.log(`"Deleted work : ${{ workId }}"`)
    }

}

function displayPopup() {
    let popupBackground = document.querySelector(".popup-background")
    popupBackground.style.display = "flex"
    let popupAdd = document.getElementById("popup-add")
    popupAdd.style.display = "none"
}

// ! add a function that will allow to leave the popup on clicking on the background

function hidePopup() {
    let popupBackground = document.querySelector(".popup-background")
    popupBackground.style.display = "none"
}

function displayAddWorkPopup() {

    let popupDelete = document.getElementById("popup-delete")
    popupDelete.style.display = "none"

    let popupAdd = document.getElementById("popup-add")
    popupAdd.style.display = "flex"

}

function returnIcone() {
    let popupDelete = document.getElementById("popup-delete")
    popupDelete.style.display = "flex"

    let popupAdd = document.getElementById("popup-add")
    popupAdd.style.display = "none"

    // in the future do a if/ else to redirect to the correct popup
}

function postNewWork() {

    const validateButton = document.getElementById("validate-button")
    const fileUpload = document.getElementById("file")
    const inputTitle = document.getElementById("title")
    const categoryOption = document.getElementById("category-option")
    const errorMessage = document.getElementById("errorMessage")

    // category option not working yet
    if ((fileUpload.value && inputTitle.value && categoryOption.value) != "") {
        console.log("there is a file and a title and a category")
        validateButton.style.cursor = "pointer"
        errorMessage.innerText = ""
    } else {
        validateButton.style.cursor = "not-allowed"
        errorMessage.innerText = "Veuillez renseigner les informations nécessaires."
        throw new Error("Missing required information.")
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

//  Gets the works from the worksRessource according to their category name
function filterCategory(selectedCategory) {

    // Returns all the works from the worksResource if the selectedCategory is "Tous"
    if (selectedCategory === "Tous") {
        return worksRessource
    }
    // Returns the works belonging to the selectedCategory
    else {
        return worksRessource.filter((element) => {
            // return true || false => return true
            // return true && false => return false
            /* return element.category.name === selectedCategory || selectedCategory === "Tous" */
            return element.category.name === selectedCategory
        })
    }
}

/* 
Get the key "name" from the worksRessource category array and adds the category 
names into the categoryKeyArray
*/
function extractKeys() {

    for (let i = 0; i < worksRessource.length; i++) {
        if (!categoryKeysArray.includes(worksRessource[i].category.name)) {
            categoryKeysArray.push(worksRessource[i].category.name)
        }
    }
}


function displayCategoryKeys() {

    //  Gets the DOM element where the filter menu will be inserted
    const filterMenu = document.querySelector(".filter")

    /*  Creates the filter buttons and gives them a class, an attribute
     according to their category names and calls the focusCategory function  */
    for (let i = 0; i < categoryKeysArray.length; i++) {

        let categoryTitle = document.createElement("button")
        categoryTitle.classList.add("category-button")
        categoryTitle.setAttribute("onclick", `focusCategory("${categoryKeysArray[i]}")`)
        /* We set a new attribute for each button and give it the value
         of its belonging category key to escape the "&" character in the
         "Hotels & restaurants" category button */
        categoryTitle.setAttribute("category-key", categoryKeysArray[i])
        categoryTitle.innerText = categoryKeysArray[i]

        //  Appends the new elements in the DOM
        filterMenu.appendChild(categoryTitle)
    }
}

//
function focusCategory(selectedCategory) {
    //  Copies the filtered works from worksRessource thanks to the filterCategory function
    displayedWorksRessource = filterCategory(selectedCategory)
    //  Renders the gallery content
    renderGalleryContent()

    //  Gets the filter buttons and adds the focus style to the selected button
    const buttons = document.getElementsByClassName("category-button")
    for (let i = 0; i < buttons.length; i++) {

        if (buttons[i].getAttribute("category-key") === selectedCategory) {
            buttons[i].classList.add("filter-focus")
        } else {
            buttons[i].classList.remove("filter-focus")
        }
    }
}


// Calls the functions that need the API response to get executed
function processResponseApi() {
    extractKeys()
    displayCategoryKeys()
    focusCategory("Tous")
    renderPopupGallery()
}



// Executes the function calls after receiving the response of the API 
getWorksApi().then(processResponseApi)

