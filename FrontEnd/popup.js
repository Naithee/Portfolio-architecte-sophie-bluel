//export getWorksApi function to load gallery

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
        newIcon.setAttribute("onclick", "removePopupWork()")
        newFigure.setAttribute("picture-name", displayedWorksRessource[i]) //not working yet

        newFigure.appendChild(newPictureElement)
        newFigure.appendChild(newIcon)
        popupGallery.appendChild(newFigure)
    }

}

//  Deletes the selected work from the API and refreshes the gallery content
async function removePopupWork() {

    //  Accesses the id of the selected work
    let workId = displayedWorksRessource.id

    // Parameter of the fetch function that sets the options of the DELETE method
    const deleteOptions = {
        // Defines which method we use with fetch
        method: "DELETE",
        // Defines the type of the request that will be sent and converts its content into string
        body: JSON.stringify({ id: workId }), // no body just id as a path !!!
        // Specifies the type of data that will be sent
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    // Send a delete request of the selected work to the API at the works ressource
    let deleteResponse = await fetch(`${backendHost}/works/{id}`, deleteOptions)

    /* Deserializes the response of the API and removes the selected work 
      if the request is valid */
    if (deleteResponse === 200) {
        console.log(`"Deleted work : ${{ workId }}"`)
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

//  Verifies the inputs and sends a POST request to the API
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

    const imageIcone = document.getElementById("image-icone")

    form.addEventListener("submit", async (event) => {

        event.preventDefault()

        let postOptions = {
            method: "POST",
            body: JSON.stringify({
                image: fileUpload.value,
                title: inputTitle.value,
                category: categoryOption.value,
            }),
            header: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        let postResponse = await fetch(`${backendHost}/works`, postOptions)
        if (postResponse.status === 201) {
            let readableResponse = await postResponse.json()
            console.log(readableResponse)
            imageIcone.innerHTML = fileUpload.value
        }
    })

}


