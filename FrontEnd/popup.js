let form = document.getElementById('upload');
let uploadButton = document.getElementById('file');

// Sets all inputs of the upload page to null
let currentTitle = null;
let currentCategory = null;
let currentFile = null;
let currentFileContent = null;
let inputIsValid = false;

// Resets all the inputs of the upload page
function resetInputs() {
    const categoryOptionElement = document.getElementById("category-option")
    const fileUploadElement = document.getElementById("file")
    const inputTitleElement = document.getElementById("title")
    categoryOptionElement.value = 0
    inputTitleElement.value = ""
    fileUploadElement.files = null
    currentTitle = null;
    currentCategory = null;
    currentFile = null;
    currentFileContent = null;
    inputIsValid = false;
    document.getElementById('uploaded-preview-container').innerHTML = ""
}

// Resets the input of the file upload
function resetFileInput() {
    inputIsValid = false;
    currentFile = null;
    currentFileContent = null;
    document.getElementById("file").value = ""
    document.getElementById('uploaded-preview-container').innerHTML = ""
}

// Sets the style of the submit button
displaySubmitButtonState()

// Calls the post function on submit
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    postNewWork(event)
})

// Calls function that validates the content of all inputs and stores them
form.addEventListener("change", async (event) => {
    onInputChange()
})


// Renders a preview of the uploaded file
uploadButton.addEventListener("change", () => {
    if (uploadButton.files.length == 1) {

        let previewContainer = document.getElementById('uploaded-preview-container')

        let newPictureElement = document.createElement("img")
        newPictureElement.src = URL.createObjectURL(uploadButton.files[0]);
        newPictureElement.alt = uploadButton.files[0]

        previewContainer.appendChild(newPictureElement)
    }
});

// Renders the gallery popup with addToGallery()
function renderPopupGallery() {

    //  Get the DOM element where the pictures will be inserted 
    const popupGallery = document.querySelector(".popup-gallery")

    // Calls the render function for the mode popup to displays the gallery pictures
    for (let i = 0; i < displayedWorksRessource.length; i++) {
        addToGallery(popupGallery, displayedWorksRessource[i], "popup")
    }

}

//  Deletes the selected work from the API and refreshes the gallery content
async function removePopupWork(event) {

    let deleteWorkId;
    if (event instanceof PointerEvent && event.target instanceof HTMLElement) {
        //  Accesses the id of the selected work
        deleteWorkId = event.target.parentElement.attributes.getNamedItem('picture-name').value
    }

    // Parameter of the fetch function that sets the options of the DELETE method
    const deleteOptions = {
        // Defines which method we use with fetch
        method: "DELETE",
        // Defines the type of the request that will be sent and converts its content into string
        // Specifies the type of data that will be sent
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${getToken()}`
        }
    }

    // Send a delete request of the selected work to the API at the works ressource
    let deleteResponse = await fetch(`${backendHost}/works/${deleteWorkId}`, deleteOptions)

    /* Deserializes the response of the API and removes the selected work 
      if the request is valid */
    if (deleteResponse.status === 204) {
        console.log(`"Deleted work : ${deleteWorkId}"`)
    }


    worksRessource = worksRessource.filter((element) => {
        return element.id != deleteWorkId
    })

    /* Executes the same as worksRessource.filter in a more explicite way
    let filteredRessources = []
    for (let i = 0; i < worksRessource.length; i++) {
        if (worksRessource[i].id !== deleteWorkId) {
            filteredRessources.push(worksRessource[i])
        }
    }
    worksRessource = filteredRessources */

    displayedWorksRessource = displayedWorksRessource.filter((element) => {
        return element.id != deleteWorkId
    })

    let elements = document.getElementsByTagName("figure")

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('picture-name') === deleteWorkId) {
            elements[i].remove()
        }
    }
}

//  Displays the popup with onclick on the modify icone
function displayPopup(contentType) {

    //  Gets the DOM element where the popup is declared and displays it
    let popupContainer = document.querySelector(".popup")
    popupContainer.style.display = "flex"

    // Clears the popup content
    let popupContentList = document.getElementsByClassName('popup-content')
    for (let i = 0; i < popupContentList.length; i++) {
        popupContentList[i].style.display = (popupContentList[i].id === contentType) ? "flex" : "none"
    }

}

//  Hides the popup with onclick on the x-mark
function hidePopup() {

    //  Gets the DOM element where the popup is declared and hides it
    let popupContainer = document.querySelector(".popup")
    popupContainer.style.display = "none"
    resetInputs()
}

//  Hides the popup delete and displays the popup add
function displayAddWorkPopup() {

    //  Gets the DOM element where the popup delete is declared and hides it
    let popupDelete = document.getElementById("popup-delete")
    popupDelete.style.display = "none"

    //  Gets the DOM element where the popup add is declared and displays it
    let popupAdd = document.getElementById("popup-add")
    popupAdd.style.display = "flex"

}

//  Hides the popup add and displays the popup delete
function returnIcone() {

    //  Gets the DOM element where the popup delete is declared and displays it
    let popupDelete = document.getElementById("popup-delete")
    popupDelete.style.display = "flex"

    //  Gets the DOM element where the popup add is declared and removes it
    let popupAdd = document.getElementById("popup-add")
    popupAdd.style.display = "none"
}

// Validates the content of all inputs and stores them
function onInputChange() {
    const categoryOptionElement = document.getElementById("category-option")
    const fileUploadElement = document.getElementById("file")
    const inputTitleElement = document.getElementById("title")

    if (!categoryOptionElement || !fileUploadElement || !inputTitleElement) {
        throw new Error("Error")
    }

    currentTitle = inputTitleElement.value
    currentCategory = categoryOptionElement.value
    currentFile = fileUploadElement.files[0]
    validateInput()
    displaySubmitButtonState(inputIsValid)
}

// Sets the style of the submit button
function displaySubmitButtonState(state) {
    const validateButton = document.getElementById("validate-button")

    if (state !== true) {
        validateButton.classList.add('button-disabled')
    } else {
        validateButton.classList.remove('button-disabled')
    }
}

// Verifies if the inputs of the page are valid 
function validateInput() {
    inputIsValid = ((!!currentTitle || !!currentCategory || !!currentFile) && (currentTitle !== "" && currentCategory !== "" && currentFile.name !== ""))
}

// Sends a POST request to the API
async function postNewWork(event) {
    const form = event.target;
    const formData = new FormData(form);

    // Send the form data using fetch
    fetch(`${backendHost}/works`, {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })
        // Deserializes the response of the request (turns the response into a JS object )
        .then(response => response.json())
        .then(data => {
            // Renders the new element in the popup gallery
            const popupGallery = document.querySelector(".popup-gallery")
            addToGallery(popupGallery, data, "popup")
            // Renders the new element in the portfolio gallery
            const gallery = document.querySelector(".gallery")
            addToGallery(gallery, data, "portfolio")
            hidePopup()
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
