const startBtn = document.querySelector("#startGame")
const menuDiv = document.querySelector("#menu")
const difficulty = document.querySelector("#difficulty")
const gameDiv = document.querySelector("#game")
const table = document.querySelector("tbody")

startBtn.addEventListener("click", startGame)
table.addEventListener("click", placeBulb)

let player

function placeBulb(e) {
    if(e.target.matches("td")) {
        const row = e.target.closest("tr").rowIndex
        const col = e.target.closest("td").cellIndex
        
    }
}

function startGame() {
    menuDiv.hidden = true
    gameDiv.hidden = false
    easyGameBoardRows.map(row => table.innerHTML += row)
    player = document.querySelector("#nameInput").value
    document.querySelector("#name").innerText = "Játékos neve: " +  player
}

const easyGameBoardRows = [
    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="text-align: center; color: white; background-color: black; width: 2em;">1</td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' + 
    '<td style="text-align: center; color: white; background-color: black; width: 2em;">0</td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="text-align: center; color: white; background-color: black; width: 2em;">2</td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: black; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: black; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: black; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' + 
    '<td style="background-color: black; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="text-align: center; color: white; background-color: black; width: 2em;">2</td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',

    '<tr style="height: 2em;">' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="text-align: center; color: white; background-color: black; width: 2em;">3</td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '<td style="background-color: white; width: 2em;"></td>' +
    '</tr>',
]