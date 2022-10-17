let homeScore = 0;
let guestScore = 0;
let homeEl = document.getElementById("homeScore");
let guestEL = document.getElementById("guestScore");
homeEl.textContent = homeScore;
guestEL.textContent = guestScore;


function incrementHome(points) {
	homeScore += points;
	homeEl.textContent = homeScore;
	highlightLeader();
}

function decrementHome(points) {
	homeScore -= points;
	homeEl.textContent = homeScore;
	highlightLeader();
}


function incrementGuest(points) {
	guestScore += points;
	guestEL.textContent = guestScore;
	highlightLeader();
}

function decrementGuest(points) {
	guestScore -= points;
	guestEL.textContent = guestScore;
	highlightLeader();
}


function newGame() {
	homeScore = 0;
	guestScore = 0;
	homeEl.textContent = homeScore;
	guestEL.textContent = guestScore;
	homeEl.classList.remove("highlight");
	guestEL.classList.remove("highlight");
}


function highlightLeader() {
	if (homeScore > guestScore) {
		homeEl.classList.add("highlight");
		guestEL.classList.remove("highlight");
	} else if (guestScore > homeScore) {
		guestEL.classList.add("highlight");
		homeEl.classList.remove("highlight");
	} else if ((guestScore = homeScore)) {
		homeEl.classList.remove("highlight");
		guestEL.classList.remove("highlight");
	}
}

let intervalVar;
let i = 0;
let j = 0;
const totalTime = document.querySelector(".total-countdown-timer");
const periodTime = Array.from(document.querySelectorAll(".period"));
const offenceTime = Array.from(document.querySelectorAll(".offence-timer"));
const homeBoard = document.querySelector(".home-board");
const guestBoard = document.querySelector(".guest-board");
const scoreDisplay = Array.from(document.querySelectorAll(".score-display"))

const team = function (offenceTimeCounter, score, membersList) {
    this.offenceTimeCounter = offenceTimeCounter;
    this.score = score;
    this.membersList = membersList;
};

const teamMember = function (role, name, surname, number) {
    this.role = role;
    this.name = name;
    this.surname = surname;
    this.number = number;
}

const home = new team(24, 0, [])
const guest = new team(24, 0, [])


const timerBoard = {
    totalTime: 40 * 60,
    periodTime: 10 * 60,
}

const gameBoard = {
    teams: [home, guest],
    timerBoard,
    activeTeam: 0,
    activeGame: false,
    reset: function () {
        clearInterval(intervalVar);
        gameInitialization();
        gameBoard.teams = [new team(24, 0), new team(24, 0)];
        gameBoard.timerBoard = timerBoard;
        gameBoard.activeTeam = 0;
        gameBoard.activeGame = false;

    },
    resetOffenceTime: function () {
        if (!gameBoard.activeGame) {
            gameBoard.teams[gameBoard.activeTeam].offenceTimeCounter = 24;
            displayTime(gameBoard.teams[gameBoard.activeTeam].offenceTimeCounter, offenceTime[j]);
        }
    }
}

const displayTime = (time, element) => {
    let minutes = Math.floor(time / 60);
    let remainingSeconds = Math.floor(time % 60);
    let display = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    element.textContent = display;
}

const gameInitialization = () => {
    homeBoard.classList.add("active");
    gameBoard.timerBoard.totalTime = 40 * 60;
    displayTime(gameBoard.timerBoard.totalTime, totalTime);
    periodTime.map(period => {
        period.textContent = "10:00";
        gameBoard.timerBoard.periodTime = 10 * 60;
    });
    offenceTime.map(offenceTime => offenceTime.textContent = "00:00");
}
gameInitialization();

const hasTimeExpired = (totalTime, periodTime, offenceTime) => {
    if (totalTime || periodTime || offenceTime) {
        clearInterval(intervalVar);
        gameBoard.resetOffenceTime();
        gameBoard.activeGame = !gameBoard.activeGame;
    }
}

const timer = () => {
    gameBoard.activeGame = !gameBoard.activeGame;
    if (gameBoard.activeGame) {
        intervalVar = setInterval(() => {
            let totalTimeHasExpired = gameBoard.timerBoard.totalTime === 0;
            let periodTimeHasExpired = gameBoard.timerBoard.periodTime === 0;
            let offenceTimeHasExpired = gameBoard.teams[gameBoard.activeTeam].offenceTimeCounter === 0;
            hasTimeExpired(totalTimeHasExpired, periodTimeHasExpired, offenceTimeHasExpired);

            gameBoard.timerBoard.totalTime--;
            gameBoard.timerBoard.periodTime--;
            gameBoard.teams[gameBoard.activeTeam].offenceTimeCounter--;

            totalTimeHasExpired ? totalTime.textContent = "0:00" : null;
            if (periodTimeHasExpired) {
                periodTime[i].textContent = "0:00";
                i++;
                gameBoard.timerBoard.periodTime = 10 * 60;
            }
            if (offenceTimeHasExpired) {
                offenceTime[j].textContent = "0:00";
                j = +!j;
                changeTeamHandler();
            }
            displayTime(gameBoard.timerBoard.totalTime, totalTime);
            displayTime(gameBoard.timerBoard.periodTime, periodTime[i]);
            displayTime(gameBoard.teams[gameBoard.activeTeam].offenceTimeCounter, offenceTime[j]);
        }, 1000)
    } else {
        clearInterval(intervalVar)
    };
};

const changeActiveStyle = (elementToRemove, elementToAdd) => {
    elementToRemove.classList.remove("active");
    elementToAdd.classList.add("active");
}

const changeTeamHandler = () => {
    if (!gameBoard.activeGame) {
        gameBoard.activeTeam = +!gameBoard.activeTeam;
        gameBoard.activeTeam ? changeActiveStyle(homeBoard, guestBoard) : changeActiveStyle(guestBoard, homeBoard);
        offenceTime[j].textContent = "00:00";
        j = +!j;
        gameBoard.resetOffenceTime();
    }
}

const pointsDistribution = () => {
    event.srcElement.innerText === "1 point" ? pointsHandler(1) : null;
    event.srcElement.innerText === "2 points" ? pointsHandler(2) : null;
    event.srcElement.innerText === "3 points" ? pointsHandler(3) : null;
}

const pointsHandler = (points) => {
    scoreDisplay[gameBoard.activeTeam].textContent = gameBoard.teams[gameBoard.activeTeam].score += points;
    gameBoard.activeGame = !gameBoard.activeGame
    clearInterval(intervalVar);
    changeTeamHandler();
}

document.querySelector(".start-stop-btn").addEventListener("click", timer);
document.querySelector(".change-offence").addEventListener("click", changeTeamHandler);
document.querySelector(".reset-offence").addEventListener("click", gameBoard.resetOffenceTime)
document.querySelector(".reset-game").addEventListener("click", gameBoard.reset);
Array.from(document.querySelectorAll(".points")).map(button => {
    button.addEventListener("click", pointsDistribution);
})


