// specify variable based on CSS classes
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector(".replay"),
playerNameInput = document.getElementById("playerName");

let playerIcon, botIcon, playerSign, runBot = true, playerName = "";

// Initially hide the game board
playBoard.classList.remove("show");
resultBox.classList.remove("show");
selectBox.classList.add("show");

window.onload = ()=>{
    // make sure all the boxes in the board are clickable
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    console.log("Player X button clicked!"); // For debugging
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Please enter your name.");
        return;
    }
    playerIcon = "fas fa-times";
    botIcon = "far fa-circle";
    playerSign = "X";
    selectBox.classList.remove("show");
    playBoard.classList.add("show");
    setPlayerTurn(); // This function correctly handles the initial turn display for 'X'
}

selectBtnO.onclick = ()=>{
    console.log("Player O button clicked!"); // For debugging
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Please enter your name.");
        return;
    }
    playerIcon = "far fa-circle";
    botIcon = "fas fa-times";
    playerSign = "O";
    selectBox.classList.remove("show");
    playBoard.classList.add("show");
    players.classList.add("active"); // 'O' player means 'X' goes first, so 'O's Turn' is visually active
    setPlayerTurn(); // This function correctly handles the initial turn display for 'O'
}

function setPlayerTurn() {
    if (playerSign === "X") {
        players.classList.remove("active"); // 'X' player means 'X' goes first visually
    } else {
        players.classList.add("active");   // 'O' player means 'X' goes first, so visually show 'O's Turn'
    }
}
// user interaction with the board
function clickedBox(element){
    if(players.classList.contains("active")){
        element.innerHTML = `<i class="${botIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", botIcon === "fas fa-times" ? "X" : "O");
    } else {
        element.innerHTML = `<i class="${playerIcon}"></i>`;
        players.classList.add("active");
        element.setAttribute("id", playerSign);
    }
    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";

    // buffer time to pretend that the AI's thinking
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(()=>{
        bot(runBot);
    }, randomTimeDelay);
}

// computer interaction with the board
function bot(){
    let array = [];
    if(runBot){
        playBoard.style.pointerEvents = "auto";
        let botSign = botIcon === "fas fa-times" ? "X" : "O";
        // find the remaining boxes that has not been marked
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){
                array.push(i);
            }
        }
        // get random box from remaining tiles
        let randomBox = array[Math.floor(Math.random() * array.length)];
        if(array.length > 0){
            if(players.classList.contains("active")){
                allBox[randomBox].innerHTML = `<i class="${botIcon}"></i>`;
                allBox[randomBox].setAttribute("id", botSign);
                players.classList.remove("active");
            } else {
                allBox[randomBox].innerHTML = `<i class="${playerIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active");
            }
            selectWinner();
        }
        allBox[randomBox].style.pointerEvents = "none";
    }
}
// get the sign of a certain box
function getIdVal(classname){
    return document.querySelector(".box" + classname).id;
}
// check 3 tiles to see if they are the same
function checkIdSign(val1, val2, val3, sign){
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
    return false;
}
// check winner
function selectWinner(){
    let winningSign = playerSign;
    if(checkIdSign(1,2,3,winningSign) || checkIdSign(4,5,6, winningSign) || checkIdSign(7,8,9, winningSign) || checkIdSign(1,4,7, winningSign) || checkIdSign(2,5,8, winningSign) || checkIdSign(3,6,9, winningSign) || checkIdSign(1,5,9, winningSign) || checkIdSign(3,5,7, winningSign)){
        runBot = false;
        bot(runBot);

        // buffer time
        setTimeout(()=>{
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = `${playerName} (${playerSign}) won the game!`;
    } else {
        winningSign = botIcon === "fas fa-times" ? "X" : "O";
        if(checkIdSign(1,2,3,winningSign) || checkIdSign(4,5,6, winningSign) || checkIdSign(7,8,9, winningSign) || checkIdSign(1,4,7, winningSign) || checkIdSign(2,5,8, winningSign) || checkIdSign(3,6,9, winningSign) || checkIdSign(1,5,9, winningSign) || checkIdSign(3,5,7, winningSign)){
            runBot = false;
            bot(runBot);

            // buffer time
            setTimeout(()=>{
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.innerHTML = `Bot (${winningSign}) won the game!`;
        }
        else{
            // if the board is full
            if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
                runBot = false;
                bot(runBot);

                // buffer time for showing the match has been drawn
                setTimeout(()=>{
                    resultBox.classList.add("show");
                    playBoard.classList.remove("show");
                }, 700);
                wonText.textContent = "Match has been drawn!";
            }
        }
    }
}

// reload page when replay button is clicked
replayBtn.onclick = () => {
    resetGame();
}

function resetGame() {
    runBot = true;
    playerSign = "X";
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].innerHTML = "";
        allBox[i].setAttribute("id", "");
        allBox[i].style.pointerEvents = "auto";
    }
    players.classList.remove("active");
    resultBox.classList.remove("show");
    playBoard.classList.add("show");
    setPlayerTurn();
    if (playerSign === "O") {
        // Bot makes the first move if the player chose 'O'
        playBoard.style.pointerEvents = "none";
        let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
        setTimeout(()=>{
            bot(runBot);
        }, randomTimeDelay);
    }
}