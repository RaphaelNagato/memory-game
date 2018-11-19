/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cards = document.getElementsByClassName("card");
let cardIsOpen = false;
let firstCard, secondCard;
let openedCards = [];

function openCard() {
    this.classList.add("open");

    if (cardIsOpen === false) {
        cardIsOpen = true;
        firstCard = this;
    } else {
        cardIsOpen = false;
        secondCard = this;

        matchCards();
    }

}


function matchCards() {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        firstCard.removeEventListener("click", openCard);
        secondCard.removeEventListener("click", openCard);
    } else {
        setTimeout(function () {
            firstCard.classList.remove("open");
            secondCard.classList.remove("open");
        }, 1500);
    }
}

for (let card of cards) {
    card.addEventListener("click", openCard);
}