const startBtn = document.querySelector("#startGame")
const menuDiv = document.querySelector("#menu")
const difficulty = document.querySelector("#difficulty")
const gameDiv = document.querySelector("#game")
const table = document.querySelector("tbody")

startBtn.addEventListener("click", startGame)
table.addEventListener("click", placeBulb)

const bulb = '<img src="./bulb.png"></img>'
let player

function placeBulb(e) {
    if(e.target.matches("td")) {
        const row = e.target.closest("tr").rowIndex
        const col = e.target.closest("td").cellIndex
        let cell = table.rows[row].cells[col]
        if(cell.className == "plain-cell") {
            cell.innerHTML = bulb
            cell.className = "light-cell"
            makeLight();
        }
    }
}

function makeLight() {

}



function startGame() {
    menuDiv.hidden = true
    gameDiv.hidden = false
    easyGameBoardRows.map(row => table.innerHTML += row)
    player = document.querySelector("#nameInput").value
    document.querySelector("#name").innerText = "Játékos neve: " +  player
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