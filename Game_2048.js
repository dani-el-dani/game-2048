let gameDifficulty = 4;
const gameNumbers = [8,0,4,4,16,2,2,2,8,8,2,4,128,64,64,512];
const bodyElement = document.querySelector("body")
let bodyhtml = ``;
gameNumbers.forEach((value,index) => {
    if(value === 0){
        bodyhtml += `<div class = "number-square"></div>`;
    }
    else{
        bodyhtml += `<div class = "number-square">${value}</div>`;
    }
    
    if(index > 0 && index % gameDifficulty === gameDifficulty-1){
        bodyhtml += `<br>`;
    }
});

bodyElement.innerHTML = bodyhtml;
bodyElement.addEventListener("keydown", (event) => {
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
        console.log(event.key);
    }
    
    bodyhtml = ``;
    gameNumbers.forEach((value,index) => {
        if(value === 0){
            bodyhtml += `<div class = "number-square"> </div>`;
        }
        else{
            bodyhtml += `<div class = "number-square">${value}</div>`;
        }
        if(index > 0 && index % gameDifficulty === gameDifficulty-1){
            bodyhtml += `<br>`;
        }
    });
    bodyElement.innerHTML = bodyhtml;
    
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