"use strict";
var sec = 30;
var time;

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const flagElement = document.getElementById('flags')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

let shuffledQuestions, currentQuestionIndex

let score;

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  startTimer();
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  score = 0;
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}


function getGeographyScore(gameScore) {
  $.ajax({
    url: "/get-geographyGame",
    method: "POST",
    data: {
      "geographyGameHighscore": gameScore
    },
    success: function (res) {

    }
  });
}


function showQuestion(question) {
  questionElement.innerText = question.question
  flagElement.src = question.image
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (document.body.classList.contains('correct')) {
    score += 50;
    getGeographyScore(score);
    sessionStorage.setItem("score", score);
    document.getElementById("gamescore").innerText = score;
  }
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    startButton.innerText = 'Restart'
    score = 0;
    startButton.classList.remove('hide')
  }

}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}


function startTimer() {
  time = setInterval(timer, 1000);
}

//the left seconds will show from 30 to 1
function timer() {
  sec -= 1;
  document.getElementById("left").innerHTML = "You have <font color =red>" +
    sec + "</font> seconds left";

  if (sec == 0) {
    clearInterval(time);
    window.location.href = '/geographyFinalScore';
  }
}


const questions = [{
    image: '/img/flag_images/ca.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Canada',
        correct: true
      },
      {
        text: 'Mexico',
        correct: false
      },
      {
        text: 'Monaco',
        correct: false
      },
      {
        text: 'Vatican City',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/gh.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Mali',
        correct: false
      },
      {
        text: 'Portugal',
        correct: false
      },
      {
        text: 'Ghana',
        correct: true
      },
      {
        text: 'Montenegro',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/dj.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Djibouti',
        correct: true
      },
      {
        text: 'Madagascar',
        correct: false
      },
      {
        text: 'Kenya',
        correct: false
      },
      {
        text: 'Libya',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/ng.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Egpyt',
        correct: false
      },
      {
        text: 'Chad',
        correct: false
      },
      {
        text: 'South Africa',
        correct: false
      },
      {
        text: 'Nigeria',
        correct: true
      }
    ]
  },
  {
    image: '/img/flag_images/gr.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Bosnia',
        correct: false
      },
      {
        text: 'Greece',
        correct: true
      },
      {
        text: 'Pakistan',
        correct: false
      },
      {
        text: 'Latvia',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/ee.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Sri Lanka',
        correct: false
      },
      {
        text: 'Fiji',
        correct: false
      },
      {
        text: 'Estonia',
        correct: true
      },
      {
        text: 'Bangladesh',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/af.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Guetamala',
        correct: false
      },
      {
        text: 'El Salvador',
        correct: false
      },
      {
        text: 'North Korea',
        correct: false
      },
      {
        text: 'Afghanistan',
        correct: true
      }
    ]
  },
  {
    image: '/img/flag_images/tw.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Nepal',
        correct: false
      },
      {
        text: 'Nicaragua',
        correct: false
      },
      {
        text: 'China',
        correct: false
      },
      {
        text: 'Taiwan',
        correct: true
      }
    ]
  },
  {
    image: '/img/flag_images/tn.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Kazakstan',
        correct: false
      },
      {
        text: 'Tunisia',
        correct: true
      },
      {
        text: 'India',
        correct: false
      },
      {
        text: 'Rome',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/gb.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'United Kingdom',
        correct: true
      },
      {
        text: 'Netherlands',
        correct: false
      },
      {
        text: 'Spain',
        correct: false
      },
      {
        text: 'France',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/mx.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Canada',
        correct: false
      },
      {
        text: 'Mexico',
        correct: true
      },
      {
        text: 'Monaco',
        correct: false
      },
      {
        text: 'Vatican City',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/pt.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Mali',
        correct: false
      },
      {
        text: 'Portugal',
        correct: true
      },
      {
        text: 'Ghana',
        correct: false
      },
      {
        text: 'Montenegro',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/ke.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Djibouti',
        correct: false
      },
      {
        text: 'Madagascar',
        correct: false
      },
      {
        text: 'Kenya',
        correct: true
      },
      {
        text: 'Libya',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/za.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Egpyt',
        correct: false
      },
      {
        text: 'Chad',
        correct: false
      },
      {
        text: 'South Africa',
        correct: true
      },
      {
        text: 'Nigeria',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/pk.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Bosnia',
        correct: false
      },
      {
        text: 'Greece',
        correct: false
      },
      {
        text: 'Pakistan',
        correct: true
      },
      {
        text: 'Latvia',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/fj.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Sri Lanka',
        correct: false
      },
      {
        text: 'Fiji',
        correct: true
      },
      {
        text: 'Estonia',
        correct: false
      },
      {
        text: 'Bangladesh',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/sv.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Guetamala',
        correct: false
      },
      {
        text: 'El Salvador',
        correct: true
      },
      {
        text: 'North Korea',
        correct: false
      },
      {
        text: 'Afghanistan',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/mn.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Nepal',
        correct: false
      },
      {
        text: 'Mongolia',
        correct: true
      },
      {
        text: 'China',
        correct: false
      },
      {
        text: 'Taiwan',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/in.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'Kazakstan',
        correct: false
      },
      {
        text: 'Tunisia',
        correct: false
      },
      {
        text: 'India',
        correct: true
      },
      {
        text: 'Rome',
        correct: false
      }
    ]
  },
  {
    image: '/img/flag_images/nl.svg',
    question: 'Which country is this?',
    answers: [{
        text: 'United Kingdom',
        correct: false
      },
      {
        text: 'Netherlands',
        correct: true
      },
      {
        text: 'Spain',
        correct: false
      },
      {
        text: 'France',
        correct: false
      }
    ]
  }
]