"use strict";
const cards = document.querySelectorAll('.memory-card');

//game js
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let score = 0;

// this is the score (put this into the database)
let match = 0;

let deduct = 10;

//stopwatch timer
let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
let timerRef = document.querySelector('.timerDisplay')
let int = null;
let timerStart = 0

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;

        if (timerStart === 0) {
            int = setInterval(displayTimer, 10);
            console.log("timer started");
            timerStart = 1;
        }

    } else {
        //second click
        secondCard = this;

        //check if the cards match
        if (firstCard.dataset.framework === secondCard.dataset.framework) {
            //first card and second card match
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);

            match++;

            gameDone();
            resetBoard();
        } else {
            lockBoard = true;

            //first and second dont match
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');

                resetBoard();
            }, 1000)
        }
    }
}




function gameDone() {
    if (match === 6) {

        clearInterval(int);
        //the code below is for when the game is over (put the score into the database)


        deduct = 10 * seconds;
        score = 600 - deduct;
        getMemoryScore(score);
        sessionStorage.setItem("score", score);




        window.location.href = '/memoryFinalScore';
        // location.href = '/main.html';
    }
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

function displayTimer() {
    milliseconds += 10;
    if (milliseconds == 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
        }
    }
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
    timerRef.innerHTML = ` ${h} : ${m} : ${s} : ${ms} `;
}

cards.forEach(card => card.addEventListener('click', flipCard));

function getMemoryScore(gameScore) {
    $.ajax({
        url: "/get-memoryGame",
        method: "POST",
        data: {
            "memoryGameHighscore": gameScore
        },
        success: function (res) {

        }
    });
}