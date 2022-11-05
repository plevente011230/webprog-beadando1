const startBtn = document.querySelector("#startGame")
const menuDiv = document.querySelector("#menu")
const difficulty = document.querySelector("#difficulty")
const gameDiv = document.querySelector("#game")
const table = document.querySelector("tbody")

startBtn.addEventListener("click", startGame)
document.querySelector("#restart").addEventListener("click", startGame)
table.addEventListener("click", placeBulb)

let wrongCells
let darkCells
const bulb = '💡'
let player
let size

function placeBulb(e) {
    if(e.target.matches("td")) {
        wrongCells = Array.from(table.querySelectorAll(".wrong-cell"))
        let row = e.target.closest("tr").rowIndex
        let col = e.target.closest("td").cellIndex
        let cell = getCell(row, col)
        if(cell.className != "dark-cell") {
            if(getCell(row, col).innerText == bulb) {
                getCell(row, col).innerText = ""
                if(getCell(row, col).className == "wrong-cell") {
                    getCell(row, col).className = "light-cell"
                    wrongCells = Array.from(table.querySelectorAll(".wrong-cell"))
                    wrongCells.filter(cell => checkWrongCell(cell)).map(cell => {
                        console.log(cell)
                        cell.className = "light-cell"
                    })
                } else {
                    makeDark(row, col)
                }
            } else if(getCell(row, col).innerText == "" && wrongCells.length == 0) {
                getCell(row, col).innerText = bulb
                getCell(row, col).className = "light-cell"
                makeLight(row, col)
            }
            checkAroundDarkCells()
            console.log(checkForWin())
        }
    }
}

function checkWrongCell(cell) {
    return checkHorizontal(cell.parentElement.rowIndex, cell.cellIndex) && checkVertical(cell.parentElement.rowIndex, cell.cellIndex)
}

function checkVertical(row, col) {
    const originalRowIndex = row
    row--
    while(isInPlayArea(row, col) && getCell(row, col).className != "dark-cell") {
        if(getCell(row, col).innerText == bulb) {
            return false
        }
        row--
    }
    row = originalRowIndex + 1
    while(isInPlayArea(row, col) && getCell(row, col).className != "dark-cell") {
        if(getCell(row, col).innerText == bulb) {
            return false
        }
        row++
    }
    return true
}

function checkHorizontal(row, col) {
    const originalColumnIndex = col
    col--
    while(isInPlayArea(row, col) && getCell(row, col).className != "dark-cell") {
        if(getCell(row, col).innerText == bulb) {
            return false
        }
        col--
    }
    col = originalColumnIndex + 1
    while(isInPlayArea(row, col) && getCell(row, col).className != "dark-cell") {
        if(getCell(row, col).innerText == bulb) {
            return false
        }
        col++
    }
    return true
}

function checkAroundDarkCells() {
    darkCells.map(cell => {
        if(countBulbsAround(cell) == parseInt(cell.innerText)) {
            cell.style.color = "green"
        } else { cell.style.color = "white" }
    })
}

function countBulbsAround(cell) {
    let row = cell.parentElement.rowIndex
    let col = cell.cellIndex
    let count = 0
    if(isInPlayArea(row - 1, col) && getCell(row - 1, col).innerText == bulb) { count++; }
    if(isInPlayArea(row + 1, col) && getCell(row + 1, col).innerText == bulb) { count++; }
    if(isInPlayArea(row, col - 1) && getCell(row, col - 1).innerText == bulb) { count++; }
    if(isInPlayArea(row, col + 1) && getCell(row, col + 1).innerText == bulb) { count++; }
    return count
}

function makeLight(row, col) {
    let count = 1
    const originalRowIndex = row
    const originalColumnIndex = col
    done = false
    up = false
    down = false
    left = false
    right = false
    while(!done) {
        if(!up) {
            up = lightUp(row - count, col, originalRowIndex, originalColumnIndex)
        }
        if(!down) {
            down = lightUp(row + count, col, originalRowIndex, originalColumnIndex)
        }
        if(!left) {
            left = lightUp(row, col - count, originalRowIndex, originalColumnIndex)
        }
        if(!right) {
            right = lightUp(row, col + count, originalRowIndex, originalColumnIndex)
        }
        if(up && down && left && right) { done = true }
        count++
    }
}

function lightUp(row, col, originalRowIndex, originalColumnIndex) {
    if(isInPlayArea(row, col)) {
        if(getCell(row, col).className == "dark-cell") { return true; }
        if(getCell(row, col).innerText == bulb) {
            getCell(row, col).className = "wrong-cell"
            getCell(originalRowIndex, originalColumnIndex).className = "wrong-cell"
            return true
        }
        getCell(row, col).className = "light-cell"
        return false 
    }
    return true
}

function makeDark(row, col) {
    const originalRowIndex = row
    const originalColumnIndex = col
    let minRow = originalRowIndex
    let maxRow = originalRowIndex
    let minCol = originalColumnIndex
    let maxCol = originalColumnIndex
    let count = 1
    up = false
    down = false
    right = false
    left = false
    done = false
    while(!done) {
        if(!up) {
            up = getEdgeOfLightArea(row - count, col)
            if(up) { minRow = row - count + 1; }
        }
        if(!down) {
            down = getEdgeOfLightArea(row + count, col)
            if(down) { maxRow = row + count - 1; }
        }
        if(!left) {
            left = getEdgeOfLightArea(row, col - count)
            if(left) { minCol = col - count + 1; }
        }
        if(!right) {
            right = getEdgeOfLightArea(row, col + count)
            if(right) { maxCol = col + count - 1; }
        }
        if(up && down && left && right) {
            done = true
        }
        count++
    }
    done = false
    do {
        if(minRow < originalRowIndex) {
            lightDown(minRow, col)
            minRow++
        }
        if(maxRow > originalRowIndex) {
            lightDown(maxRow, col)
            maxRow--
        }
        if(minCol < originalColumnIndex) {
            lightDown(row, minCol)
            minCol++
        }
        if(maxCol > originalColumnIndex) {
            lightDown(row, maxCol)
            maxCol--
        }
        if(minRow >= originalRowIndex && maxRow <= originalRowIndex && minCol >= originalColumnIndex && maxCol <= originalColumnIndex) {
            done = true
        }
    } while(!done);
    lightDown(originalRowIndex, originalColumnIndex)
}

function getEdgeOfLightArea(row, col) {
    if(!isInPlayArea(row, col) || getCell(row, col).className == "dark-cell") {
        return true
    }
    return false
}

function lightDown(row, col) {
    if(checkHorizontal(row, col) && checkVertical(row, col) && getCell(row, col).className != "dark-cell") {
        getCell(row, col).className = "plain-cell"
    }
}

function isInPlayArea(row, col) {
    return row < size && row >= 0 && col < size && col >= 0
}

function getCell(row, col) {
    return table.rows[row].cells[col]
}

function startGame() {
    menuDiv.hidden = true
    document.querySelector("#win").hidden = true
    gameDiv.hidden = false
    if(gameDiv.hidden) {
        gameDiv.hidden = false
    } else {
        let rows = Array.from(table.querySelectorAll("tr"))
        rows.map(row => row.remove())
    }
    if(difficulty[difficulty.selectedIndex].id == "easy") {
        easyGameBoardRows.map(row => table.innerHTML += row)
    } else if(difficulty[difficulty.selectedIndex].id == "hard") {
        hardGameBoardRows.map(row => table.innerHTML += row)
    } else {
        extremeGameBoardRows.map(row => table.innerHTML += row)
    }
    
    player = document.querySelector("#nameInput").value
    document.querySelector("#name").innerText = "Játékos neve: " +  player
    size = difficulty.value
    darkCells = Array.from(table.querySelectorAll(".dark-cell"))
    checkAroundDarkCells()
}

function checkForWin() {
    const cells = document.querySelectorAll("td")
    for(let cell of cells) {
        if(cell.className == "dark-cell" && cell.style.color != "green" && cell.innerText != "") { return false; }
        if(cell.className == "plain-cell" || cell.className == "wrong-cell") { return false; }
    }
    document.querySelector("#win").hidden = false
    return true;
}

const extremeGameBoardRows = [
    //1. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //2. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">3</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">2</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '</tr>',

    //3. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="dark-cell"0</td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //4. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //5. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="dark-cell">1</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">1</td>' +
    '<td class="dark-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //6. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">3</td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //7. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //8. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">1</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">0</td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //9. sor
    '<tr>' +
    '<td class="dark-cell">3</td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">0</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //10. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">0</td>' +
    '</tr>',
]

const hardGameBoardRows = [
    //1. sor
    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">0</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //2. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //3. sor
    '<tr>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">3</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '</tr>',

    //4. sor
    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">1</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //5. sor
    '<tr>' +
    '<td class="dark-cell">2</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '</tr>',

    //6. sor
    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    //7. sor
    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">2</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',
]

const easyGameBoardRows = [
    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">1</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="dark-cell">0</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">2</td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="plain-cell"></td>' + 
    '<td class="dark-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">2</td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',

    '<tr>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="dark-cell">3</td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '<td class="plain-cell"></td>' +
    '</tr>',
]