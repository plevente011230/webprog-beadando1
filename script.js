const startBtn = document.querySelector("#startGame")
const menuDiv = document.querySelector("#menu")
const difficulty = document.querySelector("#difficulty")
const gameDiv = document.querySelector("#game")
const table = document.querySelector("tbody")

startBtn.addEventListener("click", startGame)
table.addEventListener("click", placeBulb)

const darkCells = document.getElementsByClassName("dark-cell")
const bulb = '💡'
let player
let size

function placeBulb(e) {
    if(e.target.matches("td")) {
        let row = e.target.closest("tr").rowIndex
        let col = e.target.closest("td").cellIndex
        let cell = getCell(row, col)
        if(cell.className == "light-cell" || cell.className == "plain-cell") {
            cell.innerText = bulb
            cell.className = "light-cell"
            makeLight(row, col)
            checkAroundDarkCells()
            console.log(darkCells)
        }
    }
}

function checkAroundDarkCells() {
    for(let i = 0; i < darkCells.length; i++) {
        console.log(countBulbsAround(darkCells[i]))
        if(countBulbsAround(darkCells[i]) == parseInt(darkCells[i].innerText)) {
            darkCells[i].style.color = "green"
        } else { darkCells[i].style.color = "white" }
    }
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
    lightUp(row, col)
    lightDown(row, col)
    lightLeft(row, col)
    lightRight(row, col)
}

function lightUp(row, col) {
    const originalCell = getCell(row, col)
    row--
    while(isInPlayArea(row, col)) {
        if(getCell(row, col).className == "dark-cell") { return; }
        if(getCell(row, col).innerText == bulb) {
            getCell(row, col).className = "wrong-cell"
            originalCell.className = "wrong-cell"
            return
        }
        getCell(row, col).className = "light-cell"
        row--;
    }
}

function lightDown(row, col) {
    const originalCell = getCell(row, col)
    row++
    while(isInPlayArea(row, col)) {
        if(getCell(row, col).className == "dark-cell") { return; }
        if(getCell(row, col).innerText == bulb) {
            getCell(row, col).className = "wrong-cell"
            originalCell.className = "wrong-cell"
            return
        }
        getCell(row, col).className = "light-cell"
        row++;
    }
}

function lightLeft(row, col) {
    const originalCell = getCell(row, col)
    col--
    while(isInPlayArea(row, col)) {
        if(getCell(row, col).className == "dark-cell") { return; }
        if(getCell(row, col).innerText == bulb) {
            getCell(row, col).className = "wrong-cell"
            originalCell.className = "wrong-cell"
            return
        }
        getCell(row, col).className = "light-cell"
        col--;
    }
}

function lightRight(row, col) {
    const originalCell = getCell(row, col)
    col++
    while(isInPlayArea(row, col)) {
        if(getCell(row, col).className == "dark-cell") { return; }
        if(getCell(row, col).innerText == bulb) {
            getCell(row, col).className = "wrong-cell"
            originalCell.className = "wrong-cell"
            return
        }
        getCell(row, col).className = "light-cell"
        col++;
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
    gameDiv.hidden = false
    easyGameBoardRows.map(row => table.innerHTML += row)
    player = document.querySelector("#nameInput").value
    document.querySelector("#name").innerText = "Játékos neve: " +  player
    size = difficulty.value
    checkAroundDarkCells()
}

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