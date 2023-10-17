import {_functions, _cls, _rect, _rectFill, _pSet, _mouse, _sprite, _drawText, _keyboard} from "./main.js";

const MouseMode = {
    NONE: Symbol("none"),
    DRAW_CONVEYS: Symbol("draw_conveys"),
}

const settings = {
    mouse:{
        customMouse: false
    }
}

const Direction = {
    UP: {x: 0, y: 1},
    DOWN: {x: 0, y: -1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0},
    get: (x,y)=> {
        if(x === 0 && y === 1) return Direction.UP;
        if(x === 0 && y === -1) return Direction.DOWN;
        if(x === -1 && y === 0) return Direction.LEFT;
        if(x === 1 && y === 0) return Direction.RIGHT;
        return null;
    }
}

let grid = null;

let customMouse = {
    mode: MouseMode.NONE,
    lastPosition: {x: 0, y: 0},
}

let global_timer = 0;

function conveyFrame() {
    return Math.floor(global_timer/6) % 8;
}

function _init() {

    Direction.UP.flip = Direction.DOWN;
    Direction.DOWN.flip = Direction.UP;
    Direction.LEFT.flip = Direction.RIGHT;
    Direction.RIGHT.flip = Direction.LEFT;

    Direction.UP.clockwise = Direction.RIGHT;
    Direction.RIGHT.clockwise = Direction.DOWN;
    Direction.DOWN.clockwise = Direction.LEFT;
    Direction.LEFT.clockwise = Direction.UP;

    Direction.UP.counterClockwise = Direction.LEFT;
    Direction.LEFT.counterClockwise = Direction.DOWN;
    Direction.DOWN.counterClockwise = Direction.RIGHT;
    Direction.RIGHT.counterClockwise = Direction.UP;

    if (settings.mouse.customMouse) {
        _mouse.hide();
    }

    grid = new Grid(15,14);

    grid.set(1,1,new Stove(true));

    grid.set(5,4,new Supply(true));

    grid.set(7,0,new Supply(true));

    grid.set(8,7,new Goal(true));

    grid.set(7,12,new Goal(true));
}

function _tick() {

    global_timer += 1;

    updateMouse();

    drawBackground();
    drawGrid();
    drawMouse();

    finalUpdateMouse();

}

function updateMouse() {
    if (_mouse.getClick()) {
        if (customMouse.mode === MouseMode.NONE) {
            if (grid.getHoveringMech() == null || grid.getHoveringMech().name === "Conveyor") {
                customMouse.mode = MouseMode.DRAW_CONVEYS;
            }
        }
    }

    if (!_mouse.getDown()) {
        customMouse.mode = MouseMode.NONE;
    }

    if (customMouse.mode === MouseMode.DRAW_CONVEYS) {
        let pos = grid.getMousePosition();
        if (pos.x >= 0 && pos.y >= 0 && pos.x < grid.width && pos.y < grid.height) {
            if (_mouse.getClick()) {
                if (grid.get(pos.x, pos.y) == null) {
                    grid.set(pos.x, pos.y, new Conveyor(Direction.UP));
                }
            } else {
                let lastMousePos = grid.screenToTile(customMouse.lastPosition.x, customMouse.lastPosition.y);
                if (pos.x !== lastMousePos.x || pos.y !== lastMousePos.y) {
                    let dir = Direction.get(pos.x - lastMousePos.x, pos.y - lastMousePos.y);
                    if (dir != null) {
                        if (grid.get(pos.x, pos.y) == null) {
                            grid.set(pos.x, pos.y, new Conveyor(dir));
                        }
                        let lastMousePosMech = grid.get(lastMousePos.x, lastMousePos.y);
                        if (lastMousePosMech != null && lastMousePosMech.name === "Conveyor") {
                            grid.get(lastMousePos.x, lastMousePos.y).setDirection(dir)
                        }
                    }
                }
            }
        }
    }
}

function finalUpdateMouse() {
    customMouse.lastPosition.x = _mouse.getX();
    customMouse.lastPosition.y = _mouse.getY();
}

function drawMouse() {
    if (settings.mouse.customMouse) {
        if (_mouse.getOnScreen()) {
            _sprite("mouse_sprites.png", _mouse.getX(), _mouse.getY(), 0, 0);
        }
    }
}

function drawBackground() {
    _cls("#83769C");
}

function drawGrid() {
    drawGridBorder();
    drawGridMechs();

    function drawGridBorder() {
        _rect(grid.offset.x - 2,
            grid.offset.y - 2,
            grid.width * 8 + 4,
            grid.height * 8 + 4,
            "#5F574F");
        _rect(grid.offset.x - 1,
            grid.offset.y - 1,
            grid.width * 8 + 2,
            grid.height * 8 + 2,
            "#000000");
        _rectFill(grid.offset.x,
            grid.offset.y,
            grid.width * 8,
            grid.height * 8,
            "#C2C3C7");
    }

    function drawGridMechs() {
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                let mech = grid.getDirect(x, y);
                if (mech != null) {
                    mech.draw(x, y); // problem with draw location
                }
            }
        }
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.calculateGridOffset();
        this.grid = [];
        for (let x = 0; x < this.width; x++) {
            this.grid.push([])
            for (let y = 0; y < this.height; y++) {
                this.grid[x].push(null);
            }
        }
    }

    calculateGridOffset() {
        let x = (128-this.width*8)/2;
        let y = (120-this.height*8)/2+8;

        this.offset = {x:x,y:y};
    }

    get(x,y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let mech = this.grid[i][j];
                if (mech == null) {
                    continue;
                }
                for (let i2 = 0; i2 < mech.width; i2++) {
                    for (let j2 = 0; j2 < mech.height; j2++) {
                        if (i+i2 === x && j+j2 === y) {
                            return mech;
                        }
                    }
                }
            }
        }
        return null;
    }

    getDirect(x,y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.grid[x][y];
    }

    set(x,y,mech) {
        this.grid[x][y] = mech;
    }

    getHoveringMech() {
        let pos = this.screenToTile(_mouse.getX(), _mouse.getY());
        return this.get(pos.x,pos.y);
    }

    getMousePosition() {
        let pos = this.screenToTile(_mouse.getX(), _mouse.getY());
        return pos;
    }

    screenToTile(inx,iny) {
        let x = Math.floor((inx - this.offset.x) / 8);
        let y = Math.floor((iny - this.offset.y) / 8);

        return {x:x,y:y};
    }

    tileToScreen(inx,iny) {
        let x = inx * 8 + this.offset.x;
        let y = iny * 8 + this.offset.y;

        return {x:x,y:y};
    }
}

class Mech {
    constructor(name, width, height, movable, inputs, outputs) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.movable = movable;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    draw(x,y) {
        //_rect(x,y,this.w*8,this.h*8,"#ff0000");

        this.drawAllDecoConveyors(x, y);

        let file = "mech_walls.png";

        _sprite(file, x, y, 0, 0, 1, 1);
        _sprite(file, x+(this.width-1)*8, y, 1, 0, 1, 1);
        _sprite(file,x+(this.width-1)*8, y+(this.height-1)*8, 2, 0, 1, 1);
        _sprite(file, x, y+(this.height-1)*8, 3, 0, 1, 1);

        for (let i = 1; i < this.width-1; i++) {
            this.drawWall(x, y, i, 0);
            this.drawWall(x, y, i, (this.height-1));
        }

        for (let i = 1; i < this.height-1; i++) {
            this.drawWall(x, y, 0, i);
            this.drawWall(x, y, (this.width-1), i);
        }

        _rectFill(x+8,y+8,(this.width-2)*8,(this.height-2)*8,"#5f574f");
    }

    drawAllDecoConveyors(x, y) {
        for (let i = 0; i < this.inputs.length; i++) {
            let newX = x + this.inputs[i].xPos * 8;
            let newY = y + this.inputs[i].yPos * 8;
            this.drawDecoConveyor(newX,newY,this.inputs[i].getDirection().clockwise.clockwise);
        }

        for (let i = 0; i < this.outputs.length; i++) {
            let newX = x + this.outputs[i].xPos * 8;
            let newY = y + this.outputs[i].yPos * 8;
            this.drawDecoConveyor(newX,newY,this.outputs[i].getDirection());
        }
    }

    drawDecoConveyor(x, y, direction) {
        let file = "conveys.png";

        let spriteX = 0;
        let spriteY = conveyFrame();
        if (direction.x === Direction.UP.x && direction.y === Direction.UP.y) {
            spriteX = 3;
        } else if (direction.x === Direction.DOWN.x && direction.y === Direction.DOWN.y) {
            spriteX = 1;
        } else if (direction.x === Direction.LEFT.x && direction.y === Direction.LEFT.y) {
            spriteX = 2;
        } else if (direction.x === Direction.RIGHT.x && direction.y === Direction.RIGHT.y) {
            spriteX = 0;
        }

        _sprite(file, x, y, spriteX, spriteY, 1, 1);
    }

    drawWall(x, y, xOff, yOff) {
        let file = "mech_walls.png";

        let spriteX = 0;
        if (xOff === 0) {
            spriteX = 0;
        } else if (xOff === this.width-1) {
            spriteX = 2;
        } else if (yOff === 0) {
            spriteX = 1;
        } else if (yOff === this.height-1) {
            spriteX = 3;
        }

        let spriteY = 1;
        if (isTileInOutPut(xOff, yOff, this)) {
            spriteY = 2;
        }

        _sprite(file, x+xOff*8, y+yOff*8, spriteX, spriteY, 1, 1);
    }
}

class Stove extends Mech {
    constructor(movable) {

        let inputs = [
            new InOutPut(0, 1, -1, 0)
        ];
        let outputs = [
            new InOutPut(2, 1, 1, 0)
        ];

        super("Stove", 3, 3, movable, inputs, outputs);
    }

    draw(x,y) {
        let pos = grid.tileToScreen(x, y);

        super.draw(pos.x, pos.y);

        _sprite("mech_deco.png", pos.x+8, pos.y+8, 0, 0);
    }
}

class Conveyor extends Mech {
    constructor(direction) {

        super("Conveyor", 1, 1, true,
            Conveyor.getInputs(direction),
            [new InOutPut(0, 0, direction.x, direction.y)]);
    }

    setDirection(direction) {
        this.inputs = Conveyor.getInputs(direction);
        this.outputs = [new InOutPut(0, 0, direction.x, direction.y)];
    }

    static getInputs(direction) {
        return [
            new InOutPut(0,0,direction.clockwise.x,direction.clockwise.y),
            new InOutPut(0,0,direction.clockwise.clockwise.x,direction.clockwise.clockwise.y),
            new InOutPut(0,0,direction.clockwise.clockwise.clockwise.x,direction.clockwise.clockwise.clockwise.y)
        ]
    }

    draw(x,y) {
        let pos = grid.tileToScreen(x, y);

        this.drawDecoConveyor(pos.x,pos.y,this.outputs[0].getDirection());
    }
}

class Supply extends Mech {
    constructor(movable) {

        let outputs = [
            new InOutPut(1, 1, 0, 1)
        ];

        super("Supply", 3, 2, movable, [], outputs);
    }

    draw(x,y) {
        let pos = grid.tileToScreen(x, y);

        this.drawAllDecoConveyors(pos.x, pos.y);

        let file = "mech_walls.png";

        _sprite(file,pos.x+(this.width-1)*8, pos.y+(this.height-1)*8,
            2, 3, 1, 1);
        _sprite(file, pos.x, pos.y+(this.height-1)*8,
            3, 3, 1, 1);

        for (let i = 1; i < this.width-1; i++) {
            //this.drawWall(x, y, i, 0);
            this.drawWall(pos.x, pos.y, i, (this.height-1));
        }

        for (let i = 0; i < this.height-1; i++) {
            this.drawWall(pos.x, pos.y, 0, i);
            this.drawWall(pos.x, pos.y, (this.width-1), i);
        }

        _rectFill(pos.x+8,pos.y,(this.width-2)*8,(this.height-1)*8,"#5f574f");

        if (y === 0) {
            _rect(pos.x + 3, pos.y-1, this.width * 8 - 6, 1, "#5f574f");
        }
    }
}

class Goal extends Mech {
    constructor(movable) {

        let inputs = [
            new InOutPut(1, 0, 0, -1)
        ];

        super("Goal", 3, 2, movable, inputs, []);
    }

    draw(x,y) {
        let pos = grid.tileToScreen(x, y);

        this.drawAllDecoConveyors(pos.x, pos.y);

        let file = "mech_walls.png";

        _sprite(file,pos.x+(this.width-1)*8, pos.y,
            1, 3, 1, 1);
        _sprite(file, pos.x, pos.y,
            0, 3, 1, 1);

        for (let i = 1; i < this.width-1; i++) {
            this.drawWall(pos.x, pos.y, i, 0);
            //this.drawWall(pos.x, pos.y, i, (this.height-1));
        }

        for (let i = 1; i < this.height; i++) {
            this.drawWall(pos.x, pos.y, 0, i);
            this.drawWall(pos.x, pos.y, (this.width-1), i);
        }

        _rectFill(pos.x+8,pos.y+8,(this.width-2)*8,(this.height-1)*8,"#5f574f");

        if (y === grid.height-2) {
            _rect(pos.x + 3, pos.y+this.height*8, this.width * 8 - 6, 1, "#5f574f");
        }
    }
}

class InOutPut {
    constructor(xPos, yPos, xDir, yDir) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDir = xDir;
        this.yDir = yDir;
    }

    // returns direction enum
    getDirection() {
        return Direction.get(this.xDir,this.yDir);
    }
}

function isTileInOutPut(x, y, mech) {
    for (let i = 0; i < mech.inputs.length; i++) {
        if (mech.inputs[i].xPos === x && mech.inputs[i].yPos === y) {
            return true;
        }
    }

    for (let i = 0; i < mech.outputs.length; i++) {
        if (mech.outputs[i].xPos === x && mech.outputs[i].yPos === y) {
            return true;
        }
    }

    return false;
}

_functions(_init,_tick);