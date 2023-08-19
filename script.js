const rows = 50;
const cols = 50;
const liveCell = 1;
const deadCell = 0;
let grid = new Array(rows).fill(null).map(() => new Array(cols).fill(deadCell));
let intervalId;
let isRunning = false;
let score = 0

const gridElement = document.getElementById("grid");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const nextButton = document.getElementById("nextButton");
const randomButton = document.getElementById("randomButton");

randomButton.addEventListener("click", generateRandomCells);

function generateRandomCells() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.5 ? liveCell : deadCell;
        }
    }
    updateGridDisplay();
    score = 0;
    document.getElementById("score").innerHTML = `<p><strong>Score: </strong>${score}</p>`;
}

function createCellElement(row, col) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => toggleCellState(row, col);
    return cell;
}

function updateGridDisplay() {
    gridElement.innerHTML = "";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellElement = createCellElement(i, j);
            cellElement.style.backgroundColor = grid[i][j] === liveCell ? "white" : "black";
            gridElement.appendChild(cellElement);
        }
    }
}

function toggleCellState(row, col) {
    grid[row][col] = grid[row][col] === liveCell ? deadCell : liveCell;
    updateGridDisplay();
}

function applyRules() {
    const newGrid = new Array(rows).fill(null).map(() => new Array(cols).fill(deadCell));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const liveNeighbors = countLiveNeighbors(i, j);
            if (grid[i][j] === liveCell) {
                if (liveNeighbors === 2 || liveNeighbors === 3) {
                    newGrid[i][j] = liveCell;
                }
            } else {
                if (liveNeighbors === 3) {
                    newGrid[i][j] = liveCell;
                    // Check if the cell is transitioning from dead to alive
                    if (grid[i][j] === deadCell) {
                        score += 1;
                    }
                }
            }
        }
    }
    grid = newGrid;
    document.getElementById("score").innerHTML = `<p><strong>Score: </strong>${score}</p>`;
}


function countLiveNeighbors(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols && !(i === row && j === col)) {
                if (grid[i][j] === liveCell) {
                    count++;
                }
            }
        }
    }
    return count;
}

const recordingIndicator = document.querySelector(".recording-indicator");

function startSimulation() {
    recordingIndicator.style.display = "block";
    document.getElementById("stopButton").style.backgroundColor = "#218838";
    document.getElementById("startButton").style.backgroundColor = "#294a31";
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(() => {
            applyRules();
            updateGridDisplay();
        }, 200);
    }
}

function stopSimulation() {
    recordingIndicator.style.display = "none";
    document.getElementById("stopButton").style.backgroundColor = "#294a31";
    document.getElementById("startButton").style.backgroundColor = "#218838";
    if (isRunning) {
        isRunning = false;
        clearInterval(intervalId);
    }
}


startButton.addEventListener("click", startSimulation);
stopButton.addEventListener("click", stopSimulation);
nextButton.addEventListener("click", () => {
    applyRules();
    updateGridDisplay();
});

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    score=0;
    document.getElementById("score").innerHTML=`<p><strong>Score: </strong>${score}</p>`
    stopSimulation();
    grid = new Array(rows).fill(null).map(() => new Array(cols).fill(deadCell));
    updateGridDisplay();
});

// Add event listener for the Rules button
const rulesButton = document.getElementById("rulesButton");
rulesButton.addEventListener("click", () => {
    alert("Conway's Game of Life Rules:\n\n The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, or'populated' or 'unpopulated'. Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:\n\nAny live cell with fewer than two live neighbours dies, as if caused by underpopulation. \n\n Any live cell with two or three live neighbours lives on to the next generation. \n\n Any live cell with more than three live neighbours dies, as if by overpopulation. \n\n  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. \n\n The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell, and the rules keep getting applied on and on."
        );
      });

updateGridDisplay();
recordingIndicator.style.display = "none";
