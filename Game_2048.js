let gameDifficulty = 5;
const gameNumbers = [];
let previousGameNumbers = [];
for(let i = 0; i < gameDifficulty * gameDifficulty; i++){
    gameNumbers.push(0);
}
previousGameNumbers = [...gameNumbers];
addNewNumberToGame();
const bodyElement = document.querySelector("body")
let bodyhtml = ``;
gameNumbers.forEach((value,index) => {
    if(value === 0){
        bodyhtml += `<div class = "number-square"><p></p></div>`;
    }
    else{
        bodyhtml += `<div class = "number-square"><p>${value}</p></div>`;
    }
    
    if(index > 0 && index % gameDifficulty === gameDifficulty-1){
        bodyhtml += `<br>`;
    }
});

bodyElement.innerHTML = bodyhtml;
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
    if(isGameChanged){
        addNewNumberToGame();
    }
    
    bodyhtml = ``;
    gameNumbers.forEach((value,index) => {
        if(value === 0){
            bodyhtml += `<div class = "number-square"><p></p></div>`;
        }
        else{
            bodyhtml += `<div class = "number-square"><p>${value}</p></div>`;
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