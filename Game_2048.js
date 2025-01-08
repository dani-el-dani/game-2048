let gameDifficulty = 3;
const gameNumbers = [];
let previousGameNumbers = [];
let isgameOver = false;
let score = 100000;
for(let i = 0; i < gameDifficulty * gameDifficulty; i++){
    gameNumbers.push(0);
}
previousGameNumbers = [...gameNumbers];
addNewNumberToGame();
const bodyElement = document.querySelector("body")
const playAreaGrid = document.querySelector(".js-play-area-grid");
const gameOverPopUp = document.querySelector(".js-game-over");
const scoreHtml = document.querySelector(".js-score");
playAreaGrid.style.gridTemplateColumns = `repeat(${gameDifficulty}, 1fr)`;
playAreaGrid.style.fontSize = `${6/gameDifficulty}vw`;

let bodyhtml = ``;
gameNumbers.forEach((value,index) => {
    if(value === 0){
        bodyhtml += `<div class="number-square number-square-0"><p class="number-text"></p></div>`;
    }
    else{
        bodyhtml += `<div class = "number-square number-square-${value}"><p class = "number-text">${value}</p></div>`;
    }
    
});

playAreaGrid.innerHTML = bodyhtml;

bodyElement.addEventListener("keydown", (event) => {
    previousGameNumbers = [...gameNumbers];
    let isGameChanged = false;
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
    for(let i = 0; i < gameDifficulty * gameDifficulty; i++){
        if(gameNumbers[i] !== previousGameNumbers[i]){
            isGameChanged = true;
            break;
        }
    }
    
    if(isGameChanged & !isgameOver){
        addNewNumberToGame();
        checkIfGameOver();
        bodyhtml = ``;
        gameNumbers.forEach((value,index) => {
            if(value === 0){
                bodyhtml += `<div class="number-square number-square-0"><p class="number-text"></p></div>`;
            }
            else{
                bodyhtml += `<div class = "number-square number-square-${value}"><p class = "number-text">${value}</p></div>`;
            }
        });
        if(isgameOver){
            gameOverPopUp.style.display = "block";
        }
        playAreaGrid.innerHTML = bodyhtml;
        scoreHtml.innerHTML = score;
    }
    
    
});

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
        while(row[j] === 0){
            j++;
            if(j === row.length){
                break;
            }
        }
        if(j === row.length){
            break;
        }
        if(row[i] === 0){
            row[i] = row[j];
            row[j] = 0;
        }
        else if(row[i] === row[j]){
            row[i] = row[i] + row[j];
            score += row[i]; 
            row[j] = 0;
            i++;
        }
        else if(j > i+1){
            row[i+1] = row[j];
            row[j] = 0;
            j++;
            i++;
        }
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