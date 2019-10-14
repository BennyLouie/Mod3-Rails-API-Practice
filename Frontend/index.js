//Initial Variable Assignments for the two different displays: Shoe List and Shoe Display///
let shoeList = document.querySelector('#shoe-list')
let shoeDisplay = document.querySelector('#main-shoe')

//Initial fetch to dispay the list of shoes in the DOM//////////////////////////////////////
fetch('http://localhost:3000/shoes')
    .then(resp => resp.json())
    .then(respJSON => respJSON.forEach(loadShoes))

//Function to to assist the initial display fetch///////////////////////////////////////////
function loadShoes(obj){

    //Created a single list element of a shoe//////////////////////
    let shoeItem = document.createElement('li')
        shoeItem.className = 'list-group-item'
        shoeItem.innerText = obj.name
        shoeItem.addEventListener('click', evt => displayShoe(obj))
        shoeList.append(shoeItem)

        //Default Shoe Display/////////////////////////////////////
        if (obj.id === 1){
            displayShoe(obj)
        }
}

//Function to display a shoe in the main container//////////////////////////////////////////
function displayShoe(obj){

    //Clears out previous display//////////////////////////////////
    shoeDisplay.innerHTML = ''

    //Created Shoe Image///////////////////////////////////////////
    let shoeImg = document.createElement('img')
        shoeImg.src = obj.image
        shoeImg.className = 'card-img-top'
        shoeImg.id = 'shoe-image'

    //Created Container for Shoe Display (the "Body")//////////////
    let cardBody = document.createElement('div')
        cardBody.className = 'card-body'

    //Created Label for Shoe Name//////////////////////////////////
    let cardTitle = document.createElement('h4')
        cardTitle.className = 'card-title'
        cardTitle.id = 'shoe-name'
        cardTitle.innerText = obj.name

    //
    let desc = document.createElement('p')
        desc.className = 'card-text'
        desc.id = 'shoe-description'
        desc.innerText = obj.description

    let priceText = document.createElement('p')
        priceText.className = 'card-text'

    let price = document.createElement('small')
        price.className = 'text-muted'
        price.id = 'shoe-price'
        price.innerText = obj.price

    priceText.append(price)

    let form = document.createElement('form')
        form.id = 'new-review'

        let formGroup = document.createElement('div')
            let textArea = document.createElement('textarea')
                textArea.className = 'form-control'
                textArea.id = 'review-content'
                textArea.rows = '3'
            let textInput = document.createElement('input')
                textInput.type = 'submit'
                textInput.className = 'btn btn-primary'
            formGroup.append(textArea, textInput)
            form.append(formGroup)

        form.addEventListener('submit', evt => {
            evt.preventDefault()
            submitReview(obj, evt)
        })


    cardBody.append(cardTitle, desc, priceText, form)

    let cardHeader = document.createElement('h5')
        cardHeader.className = 'card-header'
        cardHeader.innerText = 'Reviews'

    let reviewList = document.createElement('ul')
        reviewList.className = 'list-group list-group-flush'
        reviewList.id = 'reviews-list'
        
        obj.reviews.forEach(review => {
            let reviewItem = document.createElement('li')
            reviewItem.className = 'list-group-item'
            reviewItem.innerText = review.content
            reviewList.prepend(reviewItem)
        })

    shoeDisplay.append(shoeImg, cardBody, cardHeader, reviewList)
}

//Function for submitting a new review (POST fetch request)/////////////////////////////////
function submitReview(obj, evt){
    let input = evt.target["review-content"].value
    fetch(`http://localhost:3000/shoes/${obj.id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            content: input
        })
    })
    .then(resp => resp.json())
    .then(respJSON => {
        let reviewList = document.querySelector('#reviews-list')
        let reviewItem = document.createElement('li')
            reviewItem.className = 'list-group-item'
            reviewItem.innerText = respJSON.content
            reviewList.prepend(reviewItem)
    })
}