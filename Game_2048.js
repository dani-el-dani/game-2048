let gameDifficulty;
let gameNumbers = [];
let undoGameNumbers;
let previousScore;
let isGameStarted = false;
let isgameOver;
let score;
let bodyhtml;

const savedHighScores = JSON.parse(localStorage.getItem("high scores")) || [];
let levelHighScore;

const bodyElement = document.querySelector("body")
const playAreaGrid = document.querySelector(".js-play-area-grid");
const gameOverPopUp = document.querySelector(".js-game-over");
const scoreHtml = document.querySelector(".js-score");
const highScoreHtml = document.querySelector(".js-high-score");
const restartButton = document.querySelector(".js-restart-button");
const undotButton = document.querySelector(".js-undo-button");
const menuButton = document.querySelector(".js-menu-button");
const gameDifficultyButtons = document.querySelectorAll(".js-difficulty-buttons");


menuButton.addEventListener(('click'), () => {
    isGameStarted = false;
    gameNumbers = [];
    scoreHtml.innerHTML = 0;
    highScoreHtml.innerHTML = 0;
    document.querySelector(".js-game-menu").style.display = "block";
    
})
gameDifficultyButtons.forEach((button) => {
    button.addEventListener(('click') , () => {
        gameDifficulty = Number(button.dataset.gameDifficulty);
        playAreaGrid.style.gridTemplateColumns = `repeat(${gameDifficulty}, 1fr)`;
        playAreaGrid.style.fontSize = `${75/gameDifficulty}px`;
        for(let i = 0; i < gameDifficulty * gameDifficulty; i++){
            gameNumbers.push(0);
        }
        reStartGame();
        document.querySelector(".js-game-menu").style.display = "none"
    })
})





// initializing game array


function reStartGame(){
    isGameStarted = true;
    levelHighScore = null;
    savedHighScores.forEach((element) =>{
        if(element.gameDifficulty === gameDifficulty){
            levelHighScore = element;
        }
    });
    if(!levelHighScore){
        levelHighScore = {'gameDifficulty' : gameDifficulty, 'highScore': 0};
        savedHighScores.push(levelHighScore);
        localStorage.setItem("high scores", JSON.stringify(savedHighScores));
    }
    undoGameNumbers = [];
    isgameOver = false;
    score = 0;
    previousScore = score;
    gameNumbers.forEach((value,index)=>{
        gameNumbers[index] = 0;
    })
    
    addNewNumberToGame();
    undoGameNumbers = [...gameNumbers];
    updatePlayArea();
    scoreHtml.innerHTML = score;
    highScoreHtml.innerHTML = levelHighScore.highScore;
    gameOverPopUp.style.display = "none";
}



bodyElement.addEventListener("keydown", (event) => {
    if(isGameStarted){
        let previousGameNumbers;
        let isGameChanged;
        if(!isgameOver){
            previousGameNumbers = [...gameNumbers];
            previousScore = score;
            isGameChanged = false;
            if(event.key === "ArrowDown"){
                moveDown();
            }
            else if(event.key === "ArrowUp"){
                moveUp();
            }
            else if(event.key === "ArrowLeft"){
                moveLeft();
            }
            else if(event.key === "ArrowRight"){
                moveRight();
            }

            if(score > levelHighScore.highScore){
                levelHighScore.highScore = score;
                savedHighScores.forEach((element) =>{
                    if(element.gameDifficulty === gameDifficulty){
                        element.highScore = score;
                    }
                });
                localStorage.setItem("high scores", JSON.stringify(savedHighScores));
                highScoreHtml.innerHTML = levelHighScore.highScore;

            }
        
            for(let i = 0; i < gameDifficulty * gameDifficulty; i++){
                if(gameNumbers[i] !== previousGameNumbers[i]){
                    isGameChanged = true;
                    break;
                }
            }
            
            if(isGameChanged){
            undoGameNumbers = [...previousGameNumbers];
                addNewNumberToGame();
                checkIfGameOver();
                updatePlayArea();
                scoreHtml.innerHTML = score;
                if(isgameOver){
                    gameOverPopUp.style.display = "block";
                }      
            }
        }
    }
        
});

restartButton.addEventListener('click', () =>{
    if(isGameStarted){
        reStartGame();
    }   
})
undotButton.addEventListener('click', ()=>{
    if(isGameStarted){
        undoGameNumbers.forEach((value,index) =>{
            gameNumbers[index] = value;
        });
        score = previousScore;
        if(isgameOver){
            gameOverPopUp.style.display = "none";
            isgameOver = false;
        }
        updatePlayArea();
        scoreHtml.innerHTML = score;
    }
    
});

function updatePlayArea(){
    bodyhtml = ``;
    gameNumbers.forEach((value,index) => {
        if(value === 0){
            bodyhtml += `<div class="number-square number-square-0"><p class="number-text"></p></div>`;
        }
        else if(value < 4096){
            bodyhtml += `<div class = "number-square number-square-${value}"><p class = "number-text">${value}</p></div>`;
        }
        else{
            bodyhtml += `<div class = "number-square number-square-4096"><p class = "number-text">${value}</p></div>`;
        }
        
    });
    playAreaGrid.innerHTML = bodyhtml;
}


function moveLeft(){
    for(let i = 0; i < gameDifficulty; i++){
        const row = [];
        for(let j = 0; j < gameDifficulty; j++){
            row[j] = gameNumbers[i * gameDifficulty + j];
        }
        addNumbersInRow(row);
        for(let j = 0; j < gameDifficulty; j++){
            gameNumbers[i * gameDifficulty + j] = row[j];
        }
    }
}

function moveUp(){
    for(let i = 0; i < gameDifficulty; i++){
        const row = [];
        for(let j = 0; j < gameDifficulty; j++){
            row[j] = gameNumbers[i + gameDifficulty * j];
        }
        addNumbersInRow(row);
        for(let j = 0; j < gameDifficulty; j++){
            gameNumbers[i + gameDifficulty * j] = row[j];
        }
    }
}

function moveRight(){
    for(let i = 0; i < gameDifficulty; i++){
        const row = [];
        for(let j = gameDifficulty-1; j >= 0 ; j--){
            row[gameDifficulty - 1 -j] = gameNumbers[i * gameDifficulty + j];
        }
        addNumbersInRow(row);
        for(let j = gameDifficulty-1; j >= 0 ; j--){
            gameNumbers[i * gameDifficulty + j] = row[gameDifficulty - 1 - j];
        }
    }
}

function moveDown(){
    for(let i = 0; i < gameDifficulty; i++){
        const row = [];
        for(let j = gameDifficulty-1; j >= 0 ; j--){
            row[gameDifficulty - 1 -j] = gameNumbers[i + gameDifficulty * j];
        }
        addNumbersInRow(row);
        for(let j = gameDifficulty-1; j >= 0 ; j--){
            gameNumbers[i + gameDifficulty * j] = row[gameDifficulty - 1 - j];
        }
    }
}

function addNumbersInRow(row){
    let i = 0;
    let j = i + 1;
    while(i < row.length - 1){
        // finding the next non-empty cell.
        while(row[j] === 0){
            j++;
            if(j === row.length){
                break;
            }
        }

        //if there is no non-empty cell we stop.
        if(j === row.length){
            break;
        }

        //if the current cell is empty we bring the next non empty cell to the current cell.
        if(row[i] === 0){
            row[i] = row[j];
            row[j] = 0;
        }

        // if the current cell and the next non-empty cell are equal we add them together 
        // and put it in the currrent cell and the next non-empty cell becomes empty.
        else if(row[i] === row[j]){
            row[i] = row[i] + row[j];
            score += row[i]; 
            row[j] = 0;
            i++;
        }

        // if the current cell and the next non-empty cell are not equal and there is an empty cell between them,
        // we bring the next non-empty cell next to the current cell.
        else if(j > i+1){
            row[i+1] = row[j];
            row[j] = 0;
            j++;
            i++;
        }
        // if the current cell and the next non-empty cell are not equal and they are next to each other,
        // we don't do nothing.

        else{
            j++;
            i++;
        }
        
    }
}

function addNewNumberToGame(){
    const checked = [];
    while(true){
        if(checked.length === gameDifficulty * gameDifficulty){
            break;
        }
        let index = Math.floor(Math.random() * gameDifficulty * gameDifficulty);
        let isIndexChecked = false;
        checked.forEach((value) => {
            if(value === index){
                isIndexChecked = true;
                return;
            }
        });
        if(isIndexChecked){
            continue;
        }
        else if(gameNumbers[index] !== 0){
            checked.push(index);
        }
        else{
            gameNumbers[index] = Math.random() < 0.85 ? 2 : 4;
            break;
        }
    }
}
function checkIfGameOver(){
    const gameHolder = [...gameNumbers];
    const scoreHolder = score;
    isgameOver = true;
    for(let i = 0; i < 4; i++){
        if(i === 0){
            moveDown();
        }
        else if(i === 1){
            moveUp();
        }
        else if(i === 2){
            moveRight();
        }
        else{
            moveLeft();
        }
        
        for(let j = 0; j < gameDifficulty * gameDifficulty; j++){
            if(gameNumbers[j] !== gameHolder[j]){
                isgameOver = false;
                break;
            }
        }
        if(!isgameOver){
            gameHolder.forEach((value, index) =>{
                gameNumbers[index] = value;
            });
            break;
        }
    }
    score = scoreHolder;
 }