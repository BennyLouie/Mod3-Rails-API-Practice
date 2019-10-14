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

    //Created Container for Shoe Display under the Image (the "Body")//////////////
    let cardBody = document.createElement('div')
        cardBody.className = 'card-body'

    //Created Label for Shoe Name//////////////////////////////////
    let cardTitle = document.createElement('h4')
        cardTitle.className = 'card-title'
        cardTitle.id = 'shoe-name'
        cardTitle.innerText = obj.name

    //Added Shoe Description Under Shoe Image//////////////////////
    let desc = document.createElement('p')
        desc.className = 'card-text'
        desc.id = 'shoe-description'
        desc.innerText = obj.description

    //Created a container for the price////////////////////////////
    let priceText = document.createElement('p')
        priceText.className = 'card-text'

    //Added Price//////////////////////////////////////////////////
    let price = document.createElement('small')
        price.className = 'text-muted'
        price.id = 'shoe-price'
        price.innerText = `$${obj.price}`

    //Placed price inside the price container//////////////////////
    priceText.append(price)

    //Created Form for New Review//////////////////////////////////
    let form = document.createElement('form')
        form.id = 'new-review'

        //Created container for form elements//////////////////////
        let formGroup = document.createElement('div')

            //Created Text Area for review input/////////////
            let textArea = document.createElement('textarea')
                textArea.className = 'form-control'
                textArea.id = 'review-content'
                textArea.rows = '3'

            //Created Submit button for new review//////////
            let textInput = document.createElement('input')
                textInput.type = 'submit'
                textInput.className = 'btn btn-primary'
            
            //Added Elements to the container of form elements/////
            formGroup.append(textArea, textInput)

            //Added container to form//////////////////////////////
            form.append(formGroup)

        //Added Event Listener to Form/////////////////////////////
        form.addEventListener('submit', evt => {
            evt.preventDefault()
            submitReview(obj, evt)
        })

    //Placed Everything I just created into "the Body"/////////////
    cardBody.append(cardTitle, desc, priceText, form)

    //Created a container for reviews//////////////////////////////
    let cardHeader = document.createElement('h5')
        cardHeader.className = 'card-header'
        cardHeader.innerText = 'Reviews'

    //Created an unordered list for reviews////////////////////////
    let reviewList = document.createElement('ul')
        reviewList.className = 'list-group list-group-flush'
        reviewList.id = 'reviews-list'
        
        //Created a list element for each review for the shoe//////
        obj.reviews.forEach(review => {
            let reviewItem = document.createElement('li')
            reviewItem.className = 'list-group-item'
            reviewItem.innerText = review.content
            reviewList.prepend(reviewItem)
        })

    //Added everything into the review container///////////////////
    shoeDisplay.append(shoeImg, cardBody, cardHeader, reviewList)
}

//Function for submitting a new review (POST fetch request)/////////////////////////////////
function submitReview(obj, evt){

    //Assigning input to a variable/////////////////////////
    let input = evt.target["review-content"].value

    //Added conditional in case the input is blank//////////
    if (input === ''){return}
    
    //POST fetch to submit review///////////////////////////
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

        //Selected the Review List///////////////////////////
        let reviewList = document.querySelector('#reviews-list')

        //Created New Review List Element////////////////////
        //Prepended it to original list//////////////////////
        let reviewItem = document.createElement('li')
            reviewItem.className = 'list-group-item'
            reviewItem.innerText = respJSON.content
            reviewList.prepend(reviewItem)
    })
}