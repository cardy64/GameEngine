import Milo from "./oldEngines/main-8-30-2023.js";

const gridSize = 8;
const tileSize = 7;
const xShift = 65;


let grid = [];
function _init() {
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(0);
        }
    }

    // grid[5][3] = 1;
}

let c1 = 0;
let c2 = 0;

let player = 0;

let winStart = null;
let winDirection = null;

function _tick() {

    Milo.cls();

    c1 = Math.floor((Milo.mouse.getY() - (Milo.mouse.getX() - xShift)) / (2 * tileSize));
    c2 = Math.floor((Milo.mouse.getY() + (Milo.mouse.getX() - xShift)) / (2 * tileSize));

    if (Milo.mouse.getClick()) {
        if (c1 >= 0 && c1 < gridSize &&
            c2 >= 0 && c2 < gridSize) {
            if (validPlacement(c1, c2)) {
                setTile(c1, c2);
            }
        }
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            drawTile(i, j, 0);
        }
    }

    if (winStart !== null) {
        const winLineStart = gridToScreen(winStart.getX(), winStart.getY());
        winLineStart.add(0, tileSize);
        let winLineEnd = winDirection.clone();
        winLineEnd.multiply(-3);
        winLineEnd.add(winStart);
        winLineEnd = gridToScreen(winLineEnd.getX(), winLineEnd.getY());
        winLineEnd.add(0, tileSize);


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                Milo.line(
                    winLineStart.getX()-1 + i,
                    winLineStart.getY()-2 + j,
                    winLineEnd.getX()-1 + i,
                    winLineEnd.getY()-2 + j,
                    "yellow")
            }
        }
    }
}

function inBounds(i, j) {
    return i >= 0 && j >= 0 && i < gridSize && j < gridSize;
}

function setTile(i, j) {

    const checking = player + 1;
    grid[i][j] = player + 1;
    player = (player + 1) % 2;

    const directions = [
        new Milo.Vector(1, 0),
        new Milo.Vector(0, 1),
        new Milo.Vector(1, 1),
        new Milo.Vector(-1, 1),
    ];

    for (let k = 0; k < directions.length; k++) {

        // console.log("first - " + k);

        const direction = directions[k];

        const pos = new Milo.Vector(i, j);

        const backDir = direction.clone();
        backDir.multiply(-4);

        pos.add(backDir);

        let streak = 0;

        for (let m = 0; m < 7; m++) {

            pos.add(direction);

            // console.log("second - " + pos.toString());

            if (!inBounds(pos.getX(), pos.getY())) {
                streak = 0;
                // console.log("break 1");
                continue;
            }
            if (getGridFromVec(pos) !== checking) {
                streak = 0;
                // console.log("break 2");
                continue;
            }

            streak += 1;

            if (streak === 4) {
                winStart = pos.clone();
                winDirection = direction.clone();

                break;
            }

            // console.log("no break")
        }
    }

    // 1,0
    // 0,1
    // 1,1
    // -1,1
}

function getGridFromVec(vec) {
    return grid[vec.getX()][vec.getY()]
}

function getLine(i, j, dir) {
    for (let j = 0; j < 4; j++) {

    }
}

function getTile(v) {
    return grid[v.getX()][v.getY()];
}

function validPlacement(i, j) {
    if (grid[i][j] !== 0) {
        return false;
    }

    if ((i === gridSize-1 || grid[i+1][j] !== 0) &&
        (j === gridSize-1 || grid[i][j+1] !== 0)) {
        return true;
    }
    return false;
}

function gridToScreen(i, j) {
    const drawVector = new Milo.Vector(0, 0);

    const v1 = new Milo.Vector(-1, 1);
    // v1.normalize();
    v1.multiply(tileSize);
    const v2 = new Milo.Vector(1, 1);
    // v2.normalize();
    v2.multiply(tileSize);

    v1.multiply(i);
    v2.multiply(j);

    drawVector.add(v1.getX(), v1.getY());
    drawVector.add(v2.getX(), v2.getY());

    const x = Math.floor(drawVector.getX()) + xShift;
    const y = Math.floor(drawVector.getY());

    return new Milo.Vector(x, y);
}

function drawTile(i, j, c) {

    const pos = gridToScreen(i ,j);

    const x = pos.getX();
    const y = pos.getY();

    // Milo.line(
    //     x,
    //     y,
    //     x + (tileSize - 1),
    //     y + (tileSize - 1),
    //     "red")

    // Milo.pSet(x, y, "purple");

    let color = "#222222";

    if ((i + j) % 2 === 0) {
        color = "#333333";
    }

    drawBG(x, y, color);

    if (grid[i][j] === 1) {
        drawCircle(x, y, "red");
    }

    if (grid[i][j] === 2) {
        drawCircle(x, y, "blue");
    }

    if (i === c1 && j === c2) {
        // Milo.pSet(x, y + 8, "blue");
        drawBG(x, y, "rgba(255,255,255,0.2)");

        if (validPlacement(c1, c2)) {
            if (player === 0) {
                drawCircle(x, y, "rgba(255, 0, 0, 0.2)");
            }

            if (player === 1) {
                drawCircle(x, y, "rgba(0, 0, 255, 0.2)");
            }
        }
    }

}

function drawCircle(x, y, color) {
    Milo.circleFill(x, y + tileSize - 1, Math.floor(tileSize/1.9), color);
}

function drawBG(x, y, c) {
    for (let i = 0; i < tileSize + 1; i++) {
        Milo.line(
            x + i,
            y + i,
            x - (tileSize) + i,
            y + (tileSize) + i,
            c)
        if (i !== tileSize) {
            Milo.line(
                x + i,
                y + i + 1,
                x - (tileSize) + i + 1,
                y + (tileSize) + i,
                c)
        }
    }
}

Milo.functions(_init, _tick);
