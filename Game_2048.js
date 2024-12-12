let level = 4;
const gameNumbers = [8,0,4,4,16,2,2,2,8,8,2,4,128,64,64,512];
const bodyElement = document.querySelector("body")
let bodyhtml = ``;
gameNumbers.forEach((value,index) => {
    if(value === 0){
        bodyhtml += `<button class = "number-square"> </button>`;
    }
    else{
        bodyhtml += `<button class = "number-square">${value}</button>`;
    }
    
    if(index > 0 && index % level === level-1){
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
    }
    
    bodyhtml = ``;
    gameNumbers.forEach((value,index) => {
        if(value === 0){
            bodyhtml += `<button class = "number-square"> </button>`;
        }
        else{
            bodyhtml += `<button class = "number-square">${value}</button>`;
        }
        if(index > 0 && index % level === level-1){
            bodyhtml += `<br>`;
        }
    });
    bodyElement.innerHTML = bodyhtml;
    
});

function moveLeft(){
    for(let i = 0; i < n; i++){
        const row = [];
        for(let j = 0; j < level; j++){
            row[j] = gameNumbers[i * level + j];
        }
        addNumbersInRow(row);
        for(let j = 0; j < level; j++){
            gameNumbers[i * level + j] = row[j];
        }
    }
}

function moveUp(){
    for(let i = 0; i < level; i++){
        const row = [];
        for(let j = 0; j < level; j++){
            row[j] = gameNumbers[i + level * j];
        }
        addNumbersInRow(row);
        for(let j = 0; j < level; j++){
            gameNumbers[i + level * j] = row[j];
        }
    }
}

function moveRight(){
    for(let i = 0; i < level; i++){
        const row = [];
        for(let j = level-1; j >= 0 ; j--){
            row[level - 1 -j] = gameNumbers[i * level + j];
        }
        addNumbersInRow(row);
        for(let j = level-1; j >= 0 ; j--){
            gameNumbers[i * level + j] = row[level - 1 - j];
        }
    }
}

function moveDown(){
    for(let i = 0; i < n; i++){
        const row = [];
        for(let j = level-1; j >= 0 ; j--){
            row[level - 1 -j] = gameNumbers[i + level * j];
        }
        addNumbersInRow(row);
        for(let j = level-1; j >= 0 ; j--){
            gameNumbers[i + level * j] = row[level - 1 - j];
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