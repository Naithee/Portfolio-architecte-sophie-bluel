
// document.getElementById("title").value = "dodge"

let form = document.getElementById('upload');
let uploadButton = document.getElementById('file');
let currentTitle = null;
let currentCategory = null;
let currentFile = null;
let currentFileContent = null;
let inputIsValid = false;


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

function resetFileInput() {
    inputIsValid = false;
    currentFile = null;
    currentFileContent = null;
    document.getElementById('uploaded-preview-container').innerHTML = ""
    fileUploadElement.files = []
}

displaySubmitButtonState()

form.addEventListener("submit", async (event) => {
    event.preventDefault()
    postNewWork(event)
})

form.addEventListener("change", async (event) => {
    onInputChange()

})

uploadButton.addEventListener("change", () => {
    if (uploadButton.files.length == 1) {
        console.log("File selected: ", uploadButton.files[0]);
        let previewContainer = document.getElementById('uploaded-preview-container')

        let newPictureElement = document.createElement("img")
        newPictureElement.src = URL.createObjectURL(uploadButton.files[0]);
        newPictureElement.alt = uploadButton.files[0]

        previewContainer.appendChild(newPictureElement)
    }
});


//  Renders the popup gallery content with the API response
function renderPopupGallery() {

    //  Get the DOM element where the pictures will be inserted 
    const popupGallery = document.querySelector(".popup-gallery")

    /* Creates a new DOM element for each object of the API response /works 
   (we access the pictures of each object and display them)
   */

    for (let i = 0; i < displayedWorksRessource.length; i++) {

        let newFigure = document.createElement("figure")
        let newPictureElement = document.createElement("img")
        newPictureElement.src = displayedWorksRessource[i].imageUrl
        newPictureElement.alt = displayedWorksRessource[i].title
        let newIcon = document.createElement("i")
        newIcon.classList.add("fa-solid", "fa-trash-can")
        newIcon.setAttribute("onclick", "removePopupWork(event)")
        newFigure.setAttribute("picture-name", displayedWorksRessource[i].id)

        newFigure.appendChild(newPictureElement)
        newFigure.appendChild(newIcon)
        popupGallery.appendChild(newFigure)
    }

}

//  Deletes the selected work from the API and refreshes the gallery content
async function removePopupWork(event) {

    let workId;
    if (event instanceof PointerEvent && event.target instanceof HTMLElement) {
        //  Accesses the id of the selected work
        workId = event.target.parentElement.attributes.getNamedItem('picture-name').value
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
    let deleteResponse = await fetch(`${backendHost}/works/${workId}`, deleteOptions)

    /* Deserializes the response of the API and removes the selected work 
      if the request is valid */
    if (deleteResponse.status === 204) {
        console.log(`"Deleted work : ${workId}"`)
    }


    worksRessource = worksRessource.filter((element) => {
        return element.id != workId
    })

    displayedWorksRessource = displayedWorksRessource.filter((element) => {
        return element.id != workId
    })

 let elements = document.getElementsByTagName("figure")
    console.log(elements)
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('picture-name') === workId){
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
        console.log(popupContentList[i].id, popupContentList[i].style.display)
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


function onInputChange() {
    const categoryOptionElement = document.getElementById("category-option")
    const fileUploadElement = document.getElementById("file")
    const inputTitleElement = document.getElementById("title")

    if (!categoryOptionElement || !fileUploadElement || !inputTitleElement) {
        window.alert("ERROR") // TODO 
        throw new Error("Error") // TODO
    }

    currentTitle = inputTitleElement.value
    currentCategory = categoryOptionElement.value
    currentFile = fileUploadElement.files[0]
    validateInput()
    displaySubmitButtonState(inputIsValid)

}

function displaySubmitButtonState(state) {
    const validateButton = document.getElementById("validate-button")
    if (state !== true) {
        validateButton.classList.add('button-disabled')
    } else {
        validateButton.classList.remove('button-disabled')
    }
}

function validateInput() {
    inputIsValid = ((!!currentTitle || !!currentCategory || !!currentFile) && (currentTitle !== "" && currentCategory !== "" && currentFile.name !== ""))
}

//  Verifies the inputs and sends a POST request to the API
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
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            console.log(formData)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
