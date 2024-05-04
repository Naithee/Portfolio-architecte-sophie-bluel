const backendHost = "http://localhost:5678/api"


async function displayPictures() {


    const pictureContainer = document.querySelector(".gallery")

    try {
        let responsePictures = await fetch(`${backendHost}/works`)
        console.log(responsePictures)

        let picturesGalery = await responsePictures.text()
        picturesGalery = JSON.parse(picturesGalery)

        if (!Array.isArray(picturesGalery)) {
            throw new Error("Unexpected response")
        }

        for (let i = 0; i < picturesGalery.length; i++) {

            console.log(picturesGalery[i])
            let newFigure = document.createElement("figure")
            let newPicturElement = document.createElement("img")
            newPicturElement.src = picturesGalery[i].imageUrl
            newPicturElement.alt = picturesGalery[i].title
            let newFigcaption = document.createElement("figcaption")
            newFigcaption.innerText = picturesGalery[i].title

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