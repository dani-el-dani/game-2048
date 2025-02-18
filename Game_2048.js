let gameWidth;
let gameNumbers = [];
let addedTiles;
let undoGameNumbers;
let previousScore;
let isGameStarted = false;
let isgameOver;
let isGameWin;
let score;
let bodyhtml;

const savedHighScores = JSON.parse(localStorage.getItem("high scores")) || [];
let levelHighScore;

const bodyElement = document.querySelector("body")
const playAreaGrid = document.querySelector(".js-play-area-grid");
const gameOverPopUp = document.querySelector(".js-game-over");
const scoreHtml = document.querySelector(".js-score");
const highScoreHtml = document.querySelector(".js-high-score");
const restartButton = document.querySelectorAll(".js-restart-button");
const undotButton = document.querySelector(".js-undo-button");
const menuButton = document.querySelector(".js-menu-button");
const gameWidthButtons = document.querySelectorAll(".js-gameWidth-buttons");
const keepGoingButton = document.querySelector(".js-keep-going");


menuButton.addEventListener(('click'), () => {
    isGameStarted = false;
    addedTiles = [];
    gameNumbers = [];
    scoreHtml.innerHTML = 0;
    highScoreHtml.innerHTML = 0;
    document.querySelector(".js-game-menu").style.display = "block";
    bodyElement.style.overscrollBehavior = "auto";
    
})
gameWidthButtons.forEach((button) => {
    button.addEventListener(('click') , () => {
        gameWidth = Number(button.dataset.gameWidth);
        playAreaGrid.style.gridTemplateColumns = `repeat(${gameWidth}, 1fr)`;
        playAreaGrid.style.fontSize = `${75/gameWidth}px`;
        reStartGame();
        document.querySelector(".js-game-menu").style.display = "none"
    })
})

function reStartGame(){
    isGameStarted = true;
    isGameWin = {win: false, keepGoing: false};
    levelHighScore = null;
    addedTiles = [];
    
    levelHighScore = savedHighScores.find((element) => {
        return element.gameWidth === gameWidth;
    });
    
    if(!levelHighScore){
        levelHighScore = {'gameWidth' : gameWidth, 'highScore': 0};
        savedHighScores.push(levelHighScore);
        localStorage.setItem("high scores", JSON.stringify(savedHighScores));
    }
    undoGameNumbers = [];
    isgameOver = false;
    score = 0;
    previousScore = score;
    gameNumbers = Array(gameWidth * gameWidth).fill(0);
    
    addNewNumberToGame();
    undoGameNumbers = [...gameNumbers];
    updatePlayArea();
    scoreHtml.innerHTML = score;
    highScoreHtml.innerHTML = levelHighScore.highScore;
    bodyElement.style.overscrollBehavior = "none";
    gameOverPopUp.style.display = "none";
}

// swipe event listner start.

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

bodyElement.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
})

bodyElement.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    let key;
    if(Math.abs(touchStartY - touchEndY) < 10 && Math.abs(touchStartX - touchEndX) < 10){
        key = "none";
    }
    else{
        if(Math.abs(touchStartX - touchEndX) > Math.abs(touchStartY - touchEndY)){
            if(touchStartX > touchEndX){
                key = "ArrowLeft";
            }
            else{
                key = "ArrowRight"
            }
        }
        else{
            if(touchStartY > touchEndY){
                key = "ArrowUp";
            }
            else{
                key = "ArrowDown"
            }
        }
    }
    

    if(isGameStarted && key !== "none"){
        handleMove(key);
    }


})

// swipe event listner end

// key down event listner start

function handleMove(key){
    let previousGameNumbers;
    let isGameChanged;
    if(!isgameOver && !isGameWin.win ){
        previousGameNumbers = [...gameNumbers];
        previousScore = score;
        isGameChanged = false;
        if(key === "ArrowDown"){
            moveDown();
        }
        else if(key === "ArrowUp"){
            moveUp();
        }
        else if(key === "ArrowLeft"){
            moveLeft();
        }
        else if(key === "ArrowRight"){
            moveRight();
        }

        if(score > levelHighScore.highScore){
            levelHighScore.highScore = score;
            savedHighScores.forEach((element) =>{
                if(element.gameWidth === gameWidth){
                    element.highScore = score;
                }
            });
            localStorage.setItem("high scores", JSON.stringify(savedHighScores));
            highScoreHtml.innerHTML = levelHighScore.highScore;

        }
    
        for(let i = 0; i < gameWidth * gameWidth; i++){
            if(gameNumbers[i] !== previousGameNumbers[i]){
                isGameChanged = true;
                break;
            }
        }
        
        if(isGameChanged){
            undoGameNumbers = [...previousGameNumbers];
            if(!isGameWin.keepGoing){
                chaeckGameWin();
            }
            if(!isGameWin.win){
                addNewNumberToGame();
                checkIfGameOver();
                updatePlayArea();
                scoreHtml.innerHTML = score;
                if(isgameOver){
                    setTimeout(() => {
                        gameOverPopUp.style.display = "block";
                    }, 250);  
                }
            }
            else{
                updatePlayArea();
                scoreHtml.innerHTML = score;
                document.querySelector('.js-game-win').style.display = "block";
            }                     
        }
    }
}

bodyElement.addEventListener("keydown", (event) => {
    if(isGameStarted){
        handleMove(event.key);
    }
        
});

// key down event listner end

// handles reset, undo and keep going buttons
restartButton.forEach((button) => {
    button.addEventListener('click', () =>{
        if(isGameStarted){
            reStartGame();
        }
          
        document.querySelector('.js-game-win').style.display = "none"; 
    })
})
undotButton.addEventListener('click', ()=>{
    if(isGameStarted){
        addedTiles = [];
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
    isGameWin.win = false;
    //isGameWin.keepGoing = true;
    document.querySelector('.js-game-win').style.display = "none";
});
keepGoingButton.addEventListener('click', () =>{
    isGameWin.win = false;
    isGameWin.keepGoing = true;
    addedTiles = [];
    addNewNumberToGame();
    checkIfGameOver();
    updatePlayArea();
    scoreHtml.innerHTML = score;
    if(isgameOver){
        setTimeout(() => {
            gameOverPopUp.style.display = "block";
        }, 250)
    }
    document.querySelector('.js-game-win').style.display = "none";
    
})

// update the playing array after a swipe or a button press
function updatePlayArea(){
    bodyhtml = ``;
    gameNumbers.forEach((value,index) => {
        if(value === 0){
            bodyhtml += `<div class="number-square number-square-0"><p class="number-text"></p></div>`;
        }
        else if(value < 4096){
            
            if(!addedTiles.includes(index))
                bodyhtml += `<div class = "number-square number-square-${value}"><p class = "number-text">${value}</p></div>`;
            else
                bodyhtml += `<div class = "number-square number-square-${value} animate-zoom-in"><p class = "number-text">${value}</p></div>`;
        }
        else{
            if(!addedTiles.includes(index))
                bodyhtml += `<div class = "number-square number-square-4096"><p class = "number-text">${value}</p></div>`;
            else
                bodyhtml += `<div class = "number-square number-square-4096" animate-zoom-in><p class = "number-text">${value}</p></div>`;  
        }
        
    });
    playAreaGrid.innerHTML = bodyhtml;
}


function moveLeft(){
    addedTiles = [];
    for(let i = 0; i < gameWidth; i++){
        const row = [];
        for(let j = 0; j < gameWidth; j++){
            row[j] = gameNumbers[i * gameWidth + j];
        }

        let rowAddedtiles = addNumbersInRow(row);
        for(let j = 0; j < rowAddedtiles.length; j++){
            addedTiles.push(i * gameWidth + rowAddedtiles[j]);
        } 
        
        for(let j = 0; j < gameWidth; j++){
            gameNumbers[i * gameWidth + j] = row[j];
        }
    }
}

function moveUp(){
    addedTiles = [];
    for(let i = 0; i < gameWidth; i++){
        const row = [];
        for(let j = 0; j < gameWidth; j++){
            row[j] = gameNumbers[i + gameWidth * j];
        }
        
        let rowAddedtiles = addNumbersInRow(row);
        for(let j = 0; j < rowAddedtiles.length; j++){
            addedTiles.push(i  + rowAddedtiles[j] * gameWidth);
        } 

        for(let j = 0; j < gameWidth; j++){
            gameNumbers[i + gameWidth * j] = row[j];
        }
    }
}

function moveRight(){
    addedTiles = [];
    for(let i = 0; i < gameWidth; i++){
        const row = [];
        for(let j = gameWidth-1; j >= 0 ; j--){
            row[gameWidth - 1 -j] = gameNumbers[i * gameWidth + j];
        }
        
        let rowAddedtiles = addNumbersInRow(row);
        for(let j = 0; j < rowAddedtiles.length; j++){
            addedTiles.push((i + 1) * gameWidth - 1 - rowAddedtiles[j]);
        } 

        for(let j = gameWidth-1; j >= 0 ; j--){
            gameNumbers[i * gameWidth + j] = row[gameWidth - 1 - j];
        }
    }
}

function moveDown(){
    addedTiles = [];
    for(let i = 0; i < gameWidth; i++){
        const row = [];
        for(let j = gameWidth-1; j >= 0 ; j--){
            row[gameWidth - 1 -j] = gameNumbers[i + gameWidth * j];
        }
        
        let rowAddedtiles = addNumbersInRow(row);
        for(let j = 0; j < rowAddedtiles.length; j++){
            addedTiles.push(i + (gameWidth - 1 - rowAddedtiles[j]) * gameWidth);
        } 

        for(let j = gameWidth-1; j >= 0 ; j--){
            gameNumbers[i + gameWidth * j] = row[gameWidth - 1 - j];
        }
    }
}

// handling single row
function addNumbersInRow(row){
    let i = 0;
    let j = i + 1;
    let addedIneicesInRow = []
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
            addedIneicesInRow.push(i);
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
    return addedIneicesInRow;
}

function addNewNumberToGame(){
    const checked = [];
    while(true){
        if(checked.length === gameWidth * gameWidth){
            break;
        }
        let index = Math.floor(Math.random() * gameWidth * gameWidth);
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
            gameNumbers[index] = Math.random() < 0.95 ? 2 : 4;
            addedTiles.push(index);
            break;
        }
    }
}

function checkIfGameOver(){
    const gameHolder = [...gameNumbers];
    const scoreHolder = score;
    const addedTilesHolder = [...addedTiles];
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
        
        for(let j = 0; j < gameWidth * gameWidth; j++){
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
    addedTiles = [...addedTilesHolder];
}

function chaeckGameWin(){
    for(let i = 0; i < gameNumbers.length; i++){
        if(gameNumbers[i] === 2048){
            isGameWin.win = true;
        }
    }
}