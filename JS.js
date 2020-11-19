// Variable for the questions :
var questions = [
    {
        title: "Commonly used data types DO NOT include :",
        multiChoice: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        multiChoice: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },

    {
        title: "Arrays in Javascript can be used to store ____.",
        multiChoice: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        title: "String values must be enclosed within ____ when being assigned to variables.",
        multiChoice: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        title: "A very useful tool used during development and debugging for printing content to the debugger is :",
        multiChoice: ["Javascript", "terminal / bash", "for loops", "console log"],
        answer: "console log"
    },

];
// Var start time :
var secondsLeft = 76;

// Getting all the elements :
// View scores button :
var scoreBtn = document.getElementById("view-scores");

// Timer element :
var timer = document.getElementById("timer");

// hp div :
var hp = document.getElementById("hp");

// Highscores div :
var scoresDiv = document.getElementById("scores-div");

// Buttons div :
var buttonsDiv = document.getElementById("buttons")

// Start button div with event listener :
var startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);


// variable for the questions title :
var questionDiv = document.getElementById("question-div");

// div to hold the results :
var results = document.getElementById("results");

// div for the choices :
var choices = document.getElementById("choices");

// array to store high scores :
var emptyArray = [];

// Gets the array of high scores from local storage :
var storedArray = JSON.parse(window.localStorage.getItem("highScores"));

// keeping track of which question we're on :
var questionCount = 0;

// keeping score :
var score = 0;

// Function to set the timer :
function setTime() {
    loadQuestions();
    var timerInterval = setInterval(function () {
        secondsLeft--;
        timer.textContent = "";
        timer.textContent = "Time: " + secondsLeft;
        if (secondsLeft <= 0 || questionCount === questions.length) {
            clearInterval(timerInterval);
            userScore();
        }
    }, 1000);
}

// Function to load the questions on the page (called above):
function loadQuestions() {
    removeEls(startButton, hp);

    if (questionCount < questions.length) {
        questionDiv.innerHTML = questions[questionCount].title;
        choices.textContent = "";

        for (var i = 0; i < questions[questionCount].multiChoice.length; i++) {
            var newEl = document.createElement("button");
            newEl.textContent = questions[questionCount].multiChoice[i];
            newEl.setAttribute("data-id", i);
            newEl.setAttribute("class", "answer");
            newEl.addEventListener("click", function (event) {
                event.stopPropagation();

                if (newEl.textContent === questions[questionCount].answer) {
                    score = secondsLeft;
                } else {
                  secondsLeft = secondsLeft - 10;
                     
                }

                questionDiv.innerHTML = "";

                if (questionCount === questions.length) {
                    return;
                } else {
                    questionCount++;
                    loadQuestions();
                }
            });
            choices.append(newEl);
        }
    }
}


function userScore() {
    timer.remove();
    choices.textContent = "";

    var initialsInput = document.createElement("input");
    var saveBtn = document.createElement("input");

    results.innerHTML = `Your score is: ${score} points! Enter initials : `;
    initialsInput.setAttribute("type", "text");
    saveBtn.setAttribute("type", "button");
    saveBtn.setAttribute("value", "Save Score!");
    saveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var scoresArray = defineScoresArray(storedArray, emptyArray);

        var initials = initialsInput.value;
        var userAndScore = {
            initials: initials,
            score: score,
        };

        scoresArray.push(userAndScore);
        saveScores(scoresArray);
        displayAllScores();
        clearScoresBtn();
        goBackBtn();
        scoreBtn.remove();
    });
    results.append(initialsInput);
    results.append(saveBtn);
}

var saveScores = function (array) {
    window.localStorage.setItem("highScores", JSON.stringify(array));
}

function defineScoresArray (arr1, arr2) {
    if (arr1 !== null) {
        return arr1
    } else {
        return arr2
    }
}

function removeEls(...els) {
    for (var newEl of els) newEl.remove();
}

function displayAllScores() {
    removeEls(timer, startButton, results);
    var scoresArray = defineScoresArray(storedArray, emptyArray);

    scoresArray.forEach(function (obj) {
        var initials = obj.initials;
        var storedScore = obj.score;
        var resultsP = document.createElement("p");
        resultsP.textContent = `${initials}: ${storedScore}`;
        scoresDiv.append(resultsP);
    });
}

function viewScores() {
    scoreBtn.addEventListener("click", function (event) {
        event.preventDefault();
        removeEls(timer, startButton);
        displayAllScores();
        removeEls(scoreBtn);
        clearScoresBtn();
        goBackBtn();
    });
}

function clearScoresBtn() {
    var clearBtn = document.createElement("input");
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("value", "Clear Scores");
    clearBtn.addEventListener("click", function (event) {
        event.preventDefault();
        removeEls(scoresDiv);
        window.localStorage.removeItem("highScores");
    })
    scoresDiv.append(clearBtn)
}

function goBackBtn() {
    var backBtn = document.createElement("input");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("value", "Go Back");
    backBtn.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.reload();
    })
    buttonsDiv.append(backBtn)
}


viewScores();