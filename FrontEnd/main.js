// Stores the category names of the works, initialised with "Tous"
let categoryKeysArray = ["Tous"]

//  Renders the gallery content with the API response
function renderGalleryContent() {

    //  Get the DOM element where the pictures will be inserted 
    const pictureContainer = document.querySelector(".gallery")
    //  Removes the content of the gallery in the DOM
    pictureContainer.innerHTML = ""

   let gallery = document.querySelector(".gallery")
    for (let i = 0; i < displayedWorksRessource.length; i++) {

        addToGallery(gallery, displayedWorksRessource[i], "portfolio")
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

// Displays the editing mode if the user is logged in
displayLoginLogout()
