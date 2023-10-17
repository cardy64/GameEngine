import Milo from "./oldEngines/main-8-30-2023.js";

// const colors = ["#8a7805", "#f9c4c0", "#f5fca6", "#a6fcd2"];

const colors = ["#8a7805", "#c73b30", "#d8e085", "#38ea92"];

let nextColors = [];

let timer = 0;

const gravity = 1;

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

class Bitch {
    constructor(x, y, sandSim, tiles) {
        this.tiles = tiles;

        this.x = x;
        this.y = y;

        this.sandSim = sandSim;

        this.tileSize = 7;

        this.gravity = 1;

        if (nextColors.length === 0) {
            nextColors = [1,1,2,2,3,3,4,4];
            shuffleArray(nextColors);
        }

        this.c = nextColors.pop();
    }

    getTileSize() {
        return this.tileSize;
    }

    spaghetti() {
        this.y += this.gravity;

        let hit = false;

        for (let i = 0; i < this.getTiles().length; i++) {
            hit = hit || this.checkTile(this.getTiles()[i]);
        }
        if (hit) {
            // console.log("hit me :3");

            if (this.getY() === 1) {
                console.log("top me off zaddy");
                this.getSandSim().setBitch(null);
            } else {
                this.sandussy();
                this.getSandSim().newBitch();
            }
        }
    }

    sandussy() {
        for (let i = 0; i < this.getTiles().length; i++) {
            const tile = this.getTiles()[i];

            for (let x = 0; x < this.getTileSize(); x++) {
                for (let y = 0; y < this.getTileSize(); y++) {
                    this.getSandSim().setSand(
                        this.getX() + tile.getX()*this.getTileSize() + x,
                        this.getY() + tile.getY()*this.getTileSize() + y,
                        this.getC());
                }
            }
        }
    }

    getWidth() {

        let currentBiggestX = 0;

        for (let i = 0; i < this.getTiles().length; i++) {
            const tile = this.getTiles()[i];

            currentBiggestX = Math.max(currentBiggestX, tile.getX());
        }

        return currentBiggestX;
    }

    getC() {
        return this.c;
    }

    getSandSim() {
        return this.sandSim;
    }

    getTiles() {
        return this.tiles;
    }

    draw() {
        for (let i = 0; i < this.getTiles().length; i++) {
            const tile = this.getTiles()[i];

            Milo.rectFill(
                tile.x * this.getTileSize() + this.x,
                tile.y * this.getTileSize() + this.y,
                this.getTileSize(),
                this.getTileSize(),
                colors[this.getC()-1]);
        }
    }

    checkTile(tile) {

//(this.getSandSim().getHeight() - this.getTileSize()) + " " +

        let xCheck = this.getX() + tile.getX()*this.getTileSize();
        let yCheck = this.getY() + tile.getY()*this.getTileSize();

        // Milo.pSet(xCheck, yCheck, "#0000ff");

        if (yCheck === this.getSandSim().getHeight() - this.getTileSize()) {
            return true;
        }


        let hit = false;

        for (let i = -1; i < this.getTileSize()-1; i++) {
            for (let j = 0; j < 2; j++) {
                let xCheck1 = this.getX() + i + tile.getX() * this.getTileSize() + 1
                let yCheck1 = this.getY() + j * (this.getTileSize() + 1) + tile.getY() * this.getTileSize() - 1;

                // Milo.pSet(xCheck1, yCheck1, "#00ff00");

                const check1 = this.getSandSim().getSand(xCheck1, yCheck1);

                let xCheck2 = this.getX() + j * (this.getTileSize() + 1) + tile.getX() * this.getTileSize() - 1;
                let yCheck2 = this.getY() + i + tile.getY() * this.getTileSize() + 1;

                // Milo.pSet(xCheck2, yCheck2, "#0000ff");

                if (xCheck1 < 0 || xCheck1 > this.getSandSim().getWidth() - 1) {

                } else if (xCheck2 < 0 || xCheck2 > this.getSandSim().getWidth() - 1) {

                } else {

                    const check2 = this.getSandSim().getSand(xCheck2, yCheck2);

                    hit = hit || check1 !== 0 || check2 !== 0;

                    if (hit) {
                        return true;
                    }
                }
            }
            if (hit) {
                return true;
            }
        }

        return hit;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    sex(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }
}

class SandSim {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.sand = [];
        for (let i = 0; i < this.getWidth(); i++) {
            this.sand.push([]);
            for (let j = 0; j < this.getHeight(); j++) {
                this.sand[i].push(0);
            }
        }

        this.bitch = null;

        this.newBitch();
    }

    newBitch() {

        const tileCombos = [
            [
                new Milo.Vector(0,0),
                new Milo.Vector(1,0),
                new Milo.Vector(2,0),
                new Milo.Vector(2,1)
            ],
            [
                new Milo.Vector(0,1),
                new Milo.Vector(1,1),
                new Milo.Vector(2,1),
                new Milo.Vector(2,0)
            ],
            [
                new Milo.Vector(0,0),
                new Milo.Vector(1,0),
                new Milo.Vector(2,0),
                new Milo.Vector(3,0)
            ],
            [
                new Milo.Vector(0,0),
                new Milo.Vector(0,1),
                new Milo.Vector(0,2),
                new Milo.Vector(0,3)
            ],
            [
                new Milo.Vector(0,0),
                new Milo.Vector(1,0),
                new Milo.Vector(0,1),
                new Milo.Vector(1,1)
            ],
            [
                new Milo.Vector(0,0),
                new Milo.Vector(1,0),
                new Milo.Vector(2,0),
                new Milo.Vector(1,1)
            ],
            [
                new Milo.Vector(0,0),
                new Milo.Vector(0,1),
                new Milo.Vector(1,1),
                new Milo.Vector(1,2)
            ],
            [
                new Milo.Vector(1,0),
                new Milo.Vector(1,1),
                new Milo.Vector(0,1),
                new Milo.Vector(0,2)
            ],
        ]

        this.bitch = new Bitch(
            7*4,
            0,
            this,
            tileCombos[Math.floor(Math.random()*tileCombos.length)]
        )
    }

    frame() {

        let dir = 0;

        if (Milo.keyboard.isClicked("d")) {
            dir += 1;
        }

        if (Milo.keyboard.isClicked("a")) {
            dir -= 1;
        }

        const bitch = this.getBitch();
        if (bitch !== null) {
            const goalX = bitch.getX() + bitch.getTileSize() * dir;
            if (goalX >= 0 && goalX + (bitch.getWidth()+1) * bitch.getTileSize() < this.getWidth() + 1) {
                bitch.sex(goalX);
            }
        }
    }

    checkWin() {
        let lastColor = -1;
        for (let i = 0; i < this.getHeight(); i++) {
            const sand = this.getSand(0, i);

            if (sand !== 0 && sand !== lastColor) {

                lastColor = sand;

                const found = [];

                this.recur(0, i, sand, [], found, 1);
                if (found.length > 0) {
                    this.recur(0, i, sand, [], [], 2);
                }
            }
        }
    }

    recur(x, y, c, touching, found, type) {

        if (found.length > 0) {
            return;
        }

        if (touching.includes("" + x + "," + y)) {
            return;
        }

        touching.push("" + x + "," + y);

        if (!this.onGrid(x, y)) {
            return;
        }

        if (this.getSand(x, y) !== c) {
            return;
        }

        if (type === 2) {
            this.setSand(x, y, 0);
        }

        if (x === this.getWidth() - 1 && type === 1) {
            found.push(true);
        } else {
            this.recur(
                x + 1,
                y,
                c, touching, found, type
            );
            this.recur(
                x,
                y + 1,
                c, touching, found, type
            );
            this.recur(
                x,
                y - 1,
                c, touching, found, type
            );
            this.recur(
                x - 1,
                y,
                c, touching, found, type
            );
        }
    }

    tick() {
        for (let j = this.getHeight() - 1; j >= 0; j--) {
            for (let i = 0; i < this.getWidth(); i++) {

                const current = this.getSand(i, j);
                if (current !== 0) {
                    const under = new Milo.Vector(i, j + gravity);
                    const underLeft = new Milo.Vector(i - 1, j + gravity);
                    const underRight = new Milo.Vector(i + 1, j + gravity);

                    const options = [under];

                    if (Math.random() > 0.5) {
                        options.push(underLeft);
                        options.push(underRight);
                    } else {
                        options.push(underRight);
                        options.push(underLeft);
                    }



                    for (let  k= 0; k < options.length; k++) {
                        const dir = options[k];

                        if (!this.onGrid(dir.x, dir.y)) {
                            continue;
                        }

                        const dirType = this.getSand(dir.x, dir.y);

                        if (dirType === 0) {
                            this.swap(i, j, dir.x, dir.y);

                            break;
                        }
                    }
                }

            }
        }

        if (this.getBitch() !== null) {
            this.getBitch().spaghetti();
        }
    }

    setBitch(bitch) {
        this.bitch = bitch;
    }

    onGrid(x, y) {
        return x >= 0 && x < this.getWidth();
    }

    draw() {
        for (let i = 0; i < this.getWidth(); i++) {
            for (let j = 0; j < this.getHeight(); j++) {
                let color = "#333333";
                let type = this.getSand(i,j);
                if (type !== 0) {
                    color = colors[type-1];
                }
                Milo.pSet(i,j , color);
            }
        }

        if (this.getBitch() !== null) {
            this.getBitch().draw();
        }
    }

    getBitch() {
        return this.bitch;
    }

    swap(x1, y1, x2, y2) {
        const save = this.getSand(x1, y1);

        this.setSand(x1, y1, this.getSand(x2, y2));
        this.setSand(x2, y2, save);
    }

    getSand(x, y) {
        return this.sand[x][y];
    }

    setSand(x, y, c) {
        this.sand[x][y] = c;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

const sandSim = new SandSim(7 * 11, 120);

function _init() {
    // for (let i = 0; i < 500; i++) {
    //     let x = Math.floor(Math.random()*(sandSim.getWidth()));
    //     const y = Math.floor(Math.random()*30 + 90);
    //     const c = Math.floor(Math.random()*4 + 1);
    //     sandSim.setSand(x, y, c);
    // }
}

function _tick() {

    timer += 1;

    Milo.cls();

    sandSim.frame();

    if (timer % 3 === 0) {
        sandSim.tick();
        sandSim.checkWin();
    }

    sandSim.draw();

    // const tiles = sandSim.getBitch().getTiles();
    //
    // for (let i = 0; i < tiles.length; i++) {
    //     sandSim.getBitch().checkTile(tiles[i]);
    // }
}

function spawnLittleSand() {
    for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random()*(4) + 30);
        const y = Math.floor(Math.random()*4 + 50);
        const c = Math.floor(Math.random()*4 + 1);
        sandSim.setSand(x, y, c);
    }
}

Milo.functions(_init, _tick);

