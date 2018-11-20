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
/* Variables needed for multiple functions displayed in the global scope */
const cards = document.getElementsByClassName("card");
let cardIsOpen = false;
let BoardIsLocked = false;
let firstCard, secondCard;
let openedCards = [];
let moves = 0;
let second = 0,
    minute = 0,
    hour = 0;
let time = document.querySelector(".timer");
let clock;
let stars = Array.from(document.querySelectorAll(".stars li"));
let countOfStars;
let updateMoves = document.querySelector(".moves");
let matchedPairs = 0;

shuffleCards(); // the function 'shuffleCards' is fired

startClock(); // the function 'startClock' is fired

// An event Listener is added to the cards so that they can open when clicked
for (let card of cards) {
    card.addEventListener("click", openCard);
}

// Event listener added to the replay button 
let replay = document.querySelector(".replay")
replay.addEventListener("click", function () {
    resetGame();
});

//Event listener added to the cancel button
let cancel = document.querySelector(".cancel")
cancel.addEventListener("click", cancelEvent)

//Event listener added to the restart button
document.querySelector(".restart").addEventListener("click", function () {
    showGameStats();
    toggleModalClass();
    stopClock();
});


/* Turns the list of cards to an array so they can be looped over and shuffled*/
function shuffleCards() {
    let CardsToshuffle = Array.from(cards)
    let ShuffledCards = shuffle(CardsToshuffle);
    for (card of ShuffledCards) {
        document.querySelector(".deck").appendChild(card);
    }

}


/* this fires when a card is clicked */
function openCard() {
    if (BoardIsLocked) return;
    if (this === firstCard) return;
    this.classList.add("open");

    if (cardIsOpen === false) {
        cardIsOpen = true;
        firstCard = this;
    } else {
        secondCard = this;

        matchCards();

        countMoves();

        checkMoves();
    }

}

/* The function to check for similar cards */
function matchCards() {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        cardsDoMatch();
    } else {
        cardsDoNotMatch();
    }
}


/* This fires when cards do match */
function cardsDoMatch() {
    firstCard.removeEventListener("click", openCard);
    secondCard.removeEventListener("click", openCard);
    matchedPairs++;
    if (matchedPairs === 8) {
        setTimeout(gameOver, 1000);
    };
    boardReset();
}

/* This fires when two cards do not match */
function cardsDoNotMatch() {
    BoardIsLocked = true;
    setTimeout(function () {
        firstCard.classList.remove("open");
        secondCard.classList.remove("open");

        boardReset();
    }, 1000);
}

/* Resets the Board to avoid the logic of the game being scrambled */
function boardReset() {
    [cardIsOpen, BoardIsLocked] = [false, false];
    [firstCard, secondCard] = [null, null];
}


/* counts the number of moves the player played and displays it  */
function countMoves() {
    moves += 1;
    updateMoves.innerHTML = moves;
}


/* The code for the timer */
function startClock() {
    clock = setInterval(function () {
        time.textContent = (`${hour} : ${minute} : ${second}`);
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

function stopClock() {
    clearInterval(clock);
}


/* This function checks the number of moves so as to hide the stars*/
function checkMoves() {
    if (moves === 16 || moves === 30) {
        removeStar();
    }
}


/* This function hides the star */
function removeStar() {
    for (star of stars) {
        if (star.style.display !== "none") {
            star.style.display = "none";
            break;
        }
    }
}


/* This function toggles the modal view between 'hidden' or 'view' */
function toggleModalClass() {
    let modal = document.querySelector(".modal");
    modal.classList.toggle("hidden");
}


/* This appends the value of the game stats to the modal */
function showGameStats() {
    let timeStats = document.querySelector(".game-time");
    let moveStats = document.querySelector(".game-moves");
    let starStats = document.querySelector(".game-stars");
    let stars = starCount();

    timeStats.innerHTML = `Time: ${time.textContent}`;
    moveStats.innerHTML = `Moves: ${moves}`;
    starStats.innerHTML = `Stars: ${stars}`;
}

/*  The function checks for the number of visible stars to be shown in the game stats */
function starCount() {
    countOfStars = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            countOfStars++;
        }
    }
    return countOfStars;
}


/* This function is used to either enable or disable the cancel button in the modal, it is disabled when the game is over but 
enabled in other cases */
function cancelEvent() {
    toggleModalClass();
    startClock();
};


/* Resets all the card to it's default state*/
function resetCards() {
    for (let card of cards) {
        card.classList.remove("open")
    }
}


/* Resets the game to be played again */
function resetGame() {
    stopClock();
    toggleModalClass();
    [second, minute, hour] = [0, 0, 0];
    moves = 0;
    updateMoves.innerHTML = 0;
    for (star of stars) {
        star.style.display = "inline";
    };
    shuffleCards();
    resetCards();
    startClock();
    openedCards = [];
    for (let card of cards) {
        card.addEventListener("click", openCard);
    };
    matchedPairs = 0;

}


/* this fires when all the cards have been matched */
function gameOver() {
    alert("You have won");
    toggleModalClass();
    showGameStats();
    cancel.removeEventListener("click", cancelEvent);
    for (let card of cards) {
        card.addEventListener("click", openCard);
    }

}