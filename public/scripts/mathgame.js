let score = 0;
var sec = 60;
var time;

startTimer();

function startTimer() {
    time = setInterval(timer, 1000);
}

//the left seconds will show from 59 to 1
function timer() {
    sec -= 1;
    document.getElementById("left").innerHTML = "You have <font color =red>" +
        sec + "</font> seconds left";

    if (sec == 0) {
        clearInterval(time);
        window.location.href = '/mathFinalScore';
    }
}

//refresh numbers
function generateRand() {
    document.getElementById("number1").innerHTML = rando(100);
    document.getElementById("number2").innerHTML = rando(100);
    document.getElementById("number3").innerHTML = rando(100);

}


function getMathScore(mathScore) {
    $.ajax({
        url: "/get-mathscore",
        method: "POST",
        data: {
            "mathGameHighscore": mathScore
        },
        success: function (res) {

        }
    });
}

function submit() {
    score = parseInt(document.getElementById("gamescore").innerHTML);
    var num1 = parseInt(document.getElementById("number1").innerHTML);
    var num2 = parseInt(document.getElementById("number2").innerHTML);
    var num3 = parseInt(document.getElementById("number3").innerHTML);
    var rightNum = num2 + num3
    var sum = rightNum - num1


    var userInput = parseInt(document.getElementById("inputID").value);

    if (userInput == sum) {
        score = score + 50;
        document.getElementById("gamescore").innerText = score;
        sessionStorage.setItem("score", score);
        generateRand();

    } else {
        score = score - 20;
        document.getElementById("gamescore").innerText = score;
        sessionStorage.setItem("score", score);
        generateRand();
    }

    document.getElementById("inputID").value = null;


}

function getScore() {
    document.getElementById("gamescore").innerText = score;
}