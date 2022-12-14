const startBtn = document.querySelector("#startGame")
const menuDiv = document.querySelector("#menu")
const roomSelect = document.querySelector("#difficulty")
const gameDiv = document.querySelector("#game")
const gameBoard = document.querySelector("#gameBoard")
const gridEditorDiv = document.querySelector("#gridEditor")
const openEditorBtn = document.querySelector("#createOwnGrid")
const restartBtn = document.querySelector("#restart")
const editorDiv = document.querySelector("#editor")
const roomEditor = document.querySelector("#roomEditor")
const roomSizeInput = document.querySelector("#roomSize")
const startEditingBtn = document.querySelector("#startEditing")
const saveRoomBtn = document.querySelector("#saveRoom")
const roomNameInput = document.querySelector("#customRoomName")
const pauseBtn = document.querySelector("#pauseGame")
const saveDiv = document.querySelector("#save")
const saveBtn = document.querySelector("#saveBtn")
const gameNameInput = document.querySelector("#gameName")
const savedGamesSelect = document.querySelector("#savedGames")
const loadGameBtn = document.querySelector("#loadGame")
const timeSpan = document.querySelector("#time")
const continueBtn = document.querySelector("#continue")
const prevoiusGamesDiv = document.querySelector("#previousGames")
const scoresTable = document.querySelector("#scores")
const roomNameH2 = document.querySelector("#roomName")
const backBtn = document.querySelector("#back")
const winDiv = document.querySelector("#win")
const loadSavedGameDiv = document.querySelector("#loadSavedGame")

startBtn.addEventListener("click", startGame)
restartBtn.addEventListener("click", startGame)
openEditorBtn.addEventListener("click", openEditor)
gameBoard.addEventListener("click", placeBulb)
roomSizeInput.addEventListener("input", generateTable)
startEditingBtn.addEventListener("click", startEditing)
roomEditor.addEventListener("click", placeBarrier)
saveRoomBtn.addEventListener("click", saveRoom)
pauseBtn.addEventListener("click", pauseGame)
saveBtn.addEventListener("click", saveGameProgress)
loadGameBtn.addEventListener("click", loadGame)
continueBtn.addEventListener("click", continueEditing)
backBtn.addEventListener("click", backToMenu)

let inputAllowed = false
let wrongCells
let darkCells
const bulb = '????'
let player
let size
let room
let pausedGames = []
let pausedGamesTimers = []
let displayedElapsedTime
let timerRef
let startDate = ""

function backToMenu() {
    gameDiv.hidden = true
    winDiv.hidden = true
    menuDiv.hidden = false
    prevoiusGamesDiv.hidden = false
    room = ""
}

function continueEditing() {
    saveDiv.hidden = true
    inputAllowed = true
}

function loadGame() {
    menuDiv.hidden = true
    gameDiv.hidden = false
    prevoiusGamesDiv.hidden = true
    menuDiv.innerHTML = pausedGames[savedGamesSelect.selectedIndex]
    let elapsedTime = pausedGamesTimers[savedGamesSelect.selectedIndex]
    startDate = new Date().getTime() - elapsedTime
    timerRef = startTimer(new Date(startDate))
    darkCells = Array.from(gameBoard.querySelectorAll(".dark-cell"))
    inputAllowed = true
    room = roomSelect.options[roomSelect.selectedIndex].text
    roomNameH2.innerText = "Szoba neve:" + room
}

function getElapsedTime(startTime) {
    let endTime = new Date()
    let timeDiff = (endTime.getTime() - startTime.getTime()) / 1000
    let seconds = Math.floor(timeDiff % 60)
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds
    timeDiff = Math.floor(timeDiff / 60)
    let minutes = timeDiff
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes
    return minutesAsString + ":" + secondsAsString 
}

function saveRoom() {
    let rowsToSave = []
    let rows = Array.from(roomEditor.querySelectorAll("tr"))
    rows.map(row => {
        rowAsHtml = "<tr>" + row.innerHTML + "</tr>"
        rowsToSave.push(rowAsHtml)
        rowsToSave.push(",")
    })
    localStorage.setItem(roomNameInput.value, rowsToSave)
    let newOption = roomSelect.appendChild(document.createElement("option"))
    newOption.text = roomNameInput.value
    clearTable(editorDiv)
    editorDiv.hidden = true
    menuDiv.hidden = false
    prevoiusGamesDiv.hidden = false
}

function placeBarrier(e) {
    if(e.target.matches("td") && inputAllowed) {
        let row = e.target.closest("tr").rowIndex
        let col = e.target.closest("td").cellIndex
        let cell = getEditableCell(row, col)
        if(cell.className == "plain-cell") {
            cell.className = "dark-cell"
        } else {
            if(cell.innerText == "") {
                cell.innerText = 0
            } else if(cell.innerText == "4") {
                cell.className = "plain-cell"
                cell.innerText = ""
            } else {
                cell.innerText = parseInt(cell.innerText) + 1
            }
        }
    }
}

function getEditableCell(row, col) {
    return roomEditor.rows[row].cells[col]
}

function startEditing() {
    inputAllowed = true
    roomSizeInput.disabled = true
}

function openEditor() {
    menuDiv.hidden = true
    editorDiv.hidden = false
    prevoiusGamesDiv.hidden = true
    generateTable()
    inputAllowed = false
}

function generateTable() {
    clearTable(roomEditor)
    for(let i = 0; i < roomSizeInput.value; i++) {
        let row = roomEditor.appendChild(document.createElement("tr"))
        for(let j = 0; j < roomSizeInput.value; j++) {
            td = row.appendChild(document.createElement("td"))
            td.className = "plain-cell"
        }
    }
}

function clearTable(table) {
    let rows = Array.from(table.querySelectorAll("tr"))
    rows.map(row => row.remove())
}

function pauseGame() {
    inputAllowed = false
    saveDiv.hidden = false
}

function saveGameProgress() {
    let newOption = savedGamesSelect.appendChild(document.createElement("option"))
    newOption.text = gameNameInput.value + " - " + player
    saveDiv.hidden = true
    gameDiv.hidden = true
    menuDiv.hidden = false
    loadSavedGameDiv.hidden = false
    prevoiusGamesDiv.hidden = false
    clearInterval(timerRef)
    pausedGamesTimers.push(new Date().getTime() - startDate.getTime())
    pausedGames.push(gameDiv.innerHTML)
    startTime = ""
    room = ""
}

function placeBulb(e) {
    if(e.target.matches("td") && inputAllowed) {
        wrongCells = Array.from(gameBoard.querySelectorAll(".wrong-cell"))
        let row = e.target.closest("tr").rowIndex
        let col = e.target.closest("td").cellIndex
        let cell = getCell(row, col)
        if(cell.className != "dark-cell") {
            if(getCell(row, col).innerText == bulb) {
                getCell(row, col).innerText = ""
                if(getCell(row, col).className == "wrong-cell") {
                    getCell(row, col).className = "light-cell"
                    wrongCells = Array.from(gameBoard.querySelectorAll(".wrong-cell"))
                    wrongCells.filter(cell => checkWrongCell(cell)).map(cell => {
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
    let intervalRef = setTimeout(makeLightHelper, 200)
    
    function makeLightHelper() {
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
        if(!done) { 
            setTimeout(makeLightHelper, 200) 
        } else { checkForWin() }
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
    return gameBoard.rows[row].cells[col]
}

function startGame() {
    menuDiv.hidden = true
    prevoiusGamesDiv.hidden = true
    winDiv.hidden = true
    gameDiv.hidden = false
    displayedElapsedTime = "00:00"
    startDate = new Date()
    timerRef = startTimer(startDate)
    inputAllowed = true
    if(gameDiv.hidden) {
        gameDiv.hidden = false
    } else {
        clearTable(gameBoard)
    }
    if(roomSelect.selectedIndex < 3) {
        grids[roomSelect.selectedIndex].map(row => gameBoard.innerHTML += row)
    } else {
        localStorage.getItem(roomSelect.options[roomSelect.selectedIndex].text).split(",").map(row => gameBoard.innerHTML += row)
    }
    console.log(roomSelect.options[roomSelect.selectedIndex].text)
    room = roomSelect.options[roomSelect.selectedIndex].text
    roomNameH2.innerText = "Szoba neve:" + room
    player = document.querySelector("#nameInput").value
    document.querySelector("#name").innerText = "J??t??kos neve: " +  player
    size = gameBoard.querySelectorAll("tr").length
    darkCells = Array.from(gameBoard.querySelectorAll(".dark-cell"))
    checkAroundDarkCells()
}

function startTimer(startDate) {
    return setInterval(() => {
        displayedElapsedTime = getElapsedTime(startDate)
        timeSpan.innerText = displayedElapsedTime
    }, 1000)
}

function checkForWin() {
    const cells = document.querySelectorAll("td")
    for(let cell of cells) {
        if(cell.className == "dark-cell" && cell.style.color != "green" && cell.innerText != "") { return false; }
        if(cell.className == "plain-cell" || cell.className == "wrong-cell") { return false; }
    }
    winDiv.hidden = false
    inputAllowed = false
    clearInterval(timerRef)
    let newRow = scoresTable.appendChild(document.createElement("tr"))
    let playerCell = newRow.appendChild(document.createElement("td"))
    playerCell.innerText = player
    let roomCell = newRow.appendChild(document.createElement("td"))
    roomCell.innerText = room
    let timeCell = newRow.appendChild(document.createElement("td"))
    timeCell.innerText = timeSpan.innerText
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

let grids = [easyGameBoardRows, hardGameBoardRows, extremeGameBoardRows]
