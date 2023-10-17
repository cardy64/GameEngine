class GameEngineSettings {
    constructor(tileSize, mapSizeX, mapSizeY) {
        this.tileSize = tileSize;
        this.mapSizeX = mapSizeX;
        this.mapSizeY = mapSizeY ?? mapSizeX;
    }

    getTileSize() {
        return this.tileSize;
    }

    getFullSizeX() {
        return this.tileSize * this.mapSizeX;
    }

    getFullSizeY() {
        return this.tileSize * this.mapSizeY;
    }
}

let gameEngineSettings = new GameEngineSettings(1, 890/2); //55 //890/2
// let gameEngineSettings = new GameEngineSettings(8, 16);

let activeCamera = null;

class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
        } else if (y === undefined) {
            this.x = x;
            this.y = x;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    // Returns a new copy of this vector.
    clone() {
        return new Vector(this.x, this.y);
    }

    // Add two values or a vector to this vector.
    add(x, y) {
        if (x instanceof Vector) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
    }

    // Subtract two values or a vector from this vector.
    subtract(x, y) {
        if (x instanceof Vector) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
    }

    // Get the length of this vector.
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    // Normalize this vector.
    normalize() {
        const length = this.length();
        if (length !== 0) {
            this.x /= length;
            this.y /= length;
        }
    }

    // Multiply this vector by a scalar.
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    getAngle() {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    dotProduct(other) {
        return this.x * other.x + this.y * other.y;
    }
}

class InteractableManager {
    constructor() {
        this.interactables = [];
    }

    addInteractable(interactable) {
        this.interactables.push(interactable);
    }

    tick() {
        for (let i = 0; i < this.interactables.length; i++) {
            const interactable = this.interactables[i];
            interactable.tick();
        }
    }

    update() {
        for (let i = 0; i < this.interactables.length; i++) {
            const interactable = this.interactables[i];
            const done = interactable.update();
            if (done) {
                break;
            }
        }

        for (let i = 0; i < this.interactables.length; i++) {
            const interactable = this.interactables[i];
            interactable.setMouseOver(false);
        }

        for (let i = 0; i < this.interactables.length; i++) {
            const interactable = this.interactables[i];
            if (interactable.detectMouseOver()) {
                interactable.setMouseOver(true);
                break;
            }
        }
    }

    draw() {
        for (let i = 0; i < this.interactables.length; i++) {
            const interactable = this.interactables[i];
            interactable.draw();
        }
    }
}

// TODO make all x-y pairs into vectors
class Interactable {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.mouseOver = false;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getPos() {
        return new Vector(this.x, this.y);
    }

    detectMouseOver() {
        return false;
    }

    getMouseOver() {
        return this.mouseOver;
    }

    setMouseOver(mouseOver) {
        this.mouseOver = mouseOver;
    }

    update() {

    }

    tick() {

    }
}

class Button extends Interactable {
    constructor(x, y, settings) {
        super(x, y);

        settings = settings ?? {};

        this.buttonColor = settings.buttonColor ?? "#0044DD";
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    update() {

        if (this.getMouseOver()) {
            Milo.mouse.requestStyle("pointer");
        }

        if (this.detectMouseOver()) {
            if (_mouse.getClick()) {
                this.onClick();
            }
            return true;
        }
        return false;
    }

    onClick() {

    }

    getButtonColor() {
        return this.buttonColor;
    }
}

class RectangularButton extends Button {

    constructor(x, y, width, height, settings) {
        super(x, y, settings);

        this.width = width;
        this.height = height;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    detectMouseOver() {
        return _mouse.getX() >= this.x && _mouse.getX() <= this.x + this.width && _mouse.getY() >= this.y && _mouse.getY() <= this.y + this.height;
    }
}

class CheckBox extends RectangularButton {

    constructor(x, y, width, height, checked, settings) {
        super(x, y, width, height, settings);

        this.checked = checked;
    }

    draw() {
        _rectFill(this.x, this.y, this.width, this.height, this.getButtonColor());

        if (this.checked) {
            _rectFill(this.x + 2, this.y + 2, this.width - 4, this.height - 4, "#FFFFFF");
        }
    }

    onClick() {
        this.setChecked(!this.getChecked());
    }

    setChecked(checked) {
        this.checked = checked;
    }

    getChecked() {
        return this.checked;
    }
}

class TextRectangularButton extends RectangularButton {

    constructor(x, y, width, height, text, settings) {
        super(x, y, width, height, settings);

        this.text = text;

        settings = settings ?? {};

        this.textColor = settings.textColor ?? "#FFFFFF";
    }

    draw() {
        _rectFill(this.x, this.y, this.width, this.height, this.getButtonColor());


        _drawText(
            this.text,
            this.x + Math.floor(this.width / 2 - (this.text.length*4/2-1)),
            this.y + Math.floor(this.height / 2) - 2,
            this.getTextColor());
    }

    getTextColor() {
        return this.textColor;
    }
}

class ImageRectangularButton extends RectangularButton {

    constructor(x, y, width, height, image, imageWidth, imageHeight, settings) {
        super(x, y, width, height, settings);

        this.image = image;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        settings = settings ?? {};
    }

    draw() {
        _rectFill(this.x, this.y, this.width, this.height, this.getButtonColor());

        _image(
            this.image,
            this.x + Math.floor(this.width / 2 - this.imageWidth / 2),
            this.y + Math.floor(this.height / 2 - this.imageHeight / 2),
            this.imageWidth,
            this.imageHeight
        );
    }

    getImage() {
        return this.image;
    }

    getImageWidth() {
        return this.imageWidth;
    }

    getImageHeight() {
        return this.imageHeight;
    }
}

class CircularButton extends Button {

    constructor(x, y, radius, settings) {
        super(x, y, settings);

        this.radius = radius;
    }

    detectMouseOver() {
        return new Vector(this.x, this.y).distanceTo(_mouse) <= this.radius;
    }
}

class Grid extends Interactable {
    constructor(x, y, gridCountX, gridCountY, tileSizeX, tileSizeY, extras) {

        super(x, y);

        extras = extras ?? {};

        const tileSpacingX = extras.tileSpacingX ?? 0;
        const tileSpacingY = extras.tileSpacingY ?? 0;
        const outerSpacingX = extras.outerSpacingX ?? 0;
        const outerSpacingY = extras.outerSpacingY ?? 0;

        this.settings = {
            visual: {
                tileSize: {
                    x: tileSizeX,
                    y: tileSizeY
                },
                tileSpacing: {
                    x: tileSpacingX,
                    y: tileSpacingY
                },
                outerSpacing: {
                    x: outerSpacingX,
                    y: outerSpacingY
                }
            },
            gameplay: {
                gridCount: {
                    x: gridCountX,
                    y: gridCountY
                }
            }
        }

        this.tiles = [];

        for (let i = 0; i < this.getGridCount().x; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.getGridCount().y; j++) {
                this.tiles[i].push(null);
            }
        }
    }

    update() {

        const mousePos = this.getMouseTilePos();
        if (mousePos !== null) {
            if (_mouse.getClick()) {
                this.tileClicked(mousePos.x, mousePos.y);
                return true;
            }
            if (_mouse.getDown()) {
                this.tileHeld(mousePos.x, mousePos.y);
                return true;
            }
        }
        return false;
    }

    tileClicked(x, y) {}

    tileHeld(x, y) {}

    draw() {

        this.drawBackground();

        for (let x = 0; x < this.getGridCount().x; x++) {
            for (let y = 0; y < this.getGridCount().y; y++) {

                this.drawTile(x, y);
            }
        }



        for (let x = 0; x < this.getGridCount().x; x++) {
            for (let y = 0; y < this.getGridCount().y; y++) {
                if (this.getMouseOver()) {
                    const mousePos = this.getMouseTilePos();
                    if (mousePos !== null && mousePos.x === x && mousePos.y === y) {
                        this.drawHoveredTile(x, y);
                    }
                }

            }
        }
    }

    drawBackground() {}

    drawTile(x, y) {}

    drawHoveredTile(x, y) {}

    tileToScreenPos(x, y) {
        return {
            x: x * (this.getTileSize().x + this.getTileSpacing().x) + this.getX() + this.getOuterSpacing().x,
            // x2 - this.getX() - this.getOuterSpacing().x = x * (this.getTileSize().x + this.getTileSpacing().x)
            // (x2 - this.getX() - this.getOuterSPacing().x) / (this.getTileSize().x + this.getTileSpacing().x) = x
            y: y * (this.getTileSize().y + this.getTileSpacing().y) + this.getY() + this.getOuterSpacing().y
        }
    }

    screenToTilePos(x, y) {

        const maybeTile = {
            x: Math.floor((x - this.getX() - this.getOuterSpacing().x) / (this.getTileSize().x + this.getTileSpacing().x)),
            y: Math.floor((y - this.getY() - this.getOuterSpacing().y) / (this.getTileSize().y + this.getTileSpacing().y))
        }

        if (maybeTile.x < 0 || maybeTile.x >= this.getGridCount().x ||
            maybeTile.y < 0 || maybeTile.y >= this.getGridCount().y) {
            return null;
        }

        const screenPos = this.tileToScreenPos(maybeTile.x, maybeTile.y);
        if (x > screenPos.x + this.getTileSize().x - 1 ||
            y > screenPos.y + this.getTileSize().y - 1) {
            return null;
        }

        // if (x  + this.getTileSpacing().x) >= this.getTileSize().x ||
        //     y % (this.getTileSize().y + this.getTileSpacing().y) >= this.getTileSize().y) {
        //     return null;
        // }

        return maybeTile;
    }

    getTile(x, y) {
        if (x < 0 || x >= this.tiles.length ||
            y < 0 || y >= this.tiles[x].length) {
            return null;
        }
        return this.tiles[x][y];
    }

    setTile(x, y, tile) {
        if (!(x < 0 || x >= this.tiles.length ||
            y < 0 || y >= this.tiles[x].length)) {
            this.tiles[x][y] = tile;
        }
    }

    fillBucketTile(x, y, tile, tileToReplace) {

        const newTile = this.getTile(x, y);

        if (x < 0 || x >= this.tiles.length ||
            y < 0 || y >= this.tiles[x].length ||
            newTile === tile ||
            newTile !== tileToReplace) {
            return;
        }

        this.setTile(x, y, tile);
        this.fillBucketTile(x + 1, y, tile, tileToReplace);
        this.fillBucketTile(x - 1, y, tile, tileToReplace);
        this.fillBucketTile(x, y + 1, tile, tileToReplace);
        this.fillBucketTile(x, y - 1, tile, tileToReplace);

    }

    getMouseTilePos() {
        return this.screenToTilePos(Milo.mouse.x, Milo.mouse.y);
    }

    getTileSize() {
        return this.settings.visual.tileSize;
    }

    getGridCount() {
        return this.settings.gameplay.gridCount;
    }

    getTileSpacing() {
        return this.settings.visual.tileSpacing;
    }

    getOuterSpacing() {
        return this.settings.visual.outerSpacing;
    }

    getGridSize() {
        return {
            x: this.getGridCount().x * this.getTileSize().x + (this.getGridCount().x - 1) * this.getTileSpacing().x + this.getOuterSpacing().x * 2,
            y: this.getGridCount().y * this.getTileSize().y + (this.getGridCount().y - 1) * this.getTileSpacing().y + this.getOuterSpacing().y * 2
        }
    }

    detectMouseOver() {
        return _mouse.getX() >= this.getPos().x && _mouse.getX() <= this.getPos().x + this.getGridSize().x && _mouse.getY() >= this.getPos().y && _mouse.getY() <= this.getPos().y + this.getGridSize().y;
    }
}

class ParticleSystem {
    constructor(gravity) {
        this.particles = [];
        this.gravity = gravity;
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update(this.gravity);
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color, life, size, gravity) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(vx, vy);
        this.color = color;
        this.life = life;
        this.size = size;
        this.gravity = gravity;
    }

    update(gravity) {
        this.pos.add(this.vel);
        if (this.gravity !== undefined) {
            this.vel.add(this.gravity);
        } else if(gravity !== undefined) {
            this.vel.add(gravity);
        }
        this.life--;
    }

    draw() {
        ge.ctx.fillStyle = this.color;
        ge.ctx.fillRect(
            Math.floor(this.pos.x) - activeCamera.display.x,
            Math.floor(this.pos.y) - activeCamera.display.y,
            this.size,
            this.size);
    }

}

class Camera {
    real = new Milo.Vector(0, 0);
    display = new Milo.Vector(0, 0);
    moveSpeed = 4;

    constructor(x, y) {
        this.real = new Milo.Vector(x, y);
        this.display = new Milo.Vector(x, y);
    }

    update() {
        // Split weirdly to avoid intellij bug

        if (this.display.x < this.real.x) {
            this.display.x = Math.min(this.real.x, this.display.x + this.moveSpeed);
        } else if (this.display.x > this.real.x) {
            this.display.x = Math.max(this.real.x, this.display.x - this.moveSpeed);
        }
        if (this.display.y < this.real.y) {
            this.display.y = Math.min(this.real.y, this.display.y + this.moveSpeed);
        }
        if (this.display.y > this.real.y) {
            this.display.y = Math.max(this.real.y, this.display.y - this.moveSpeed);
        }
    }
}

class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.clicked = false;
        this.onScreen = false;
        this.newStyle = "default";
    }

    getDown() {
        return this.down;
    }

    getClick() {
        return this.clicked;
    }

    getOnScreen() {
        return this.onScreen;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    show() {
        this.style("auto");
    }

    hide() {
        this.style("none");
    }

    requestStyle(style) {
        this.newStyle = style;
    }

    getNewStyle() {
        return this.newStyle;
    }

    style() {
        ge.canvas.style.cursor = this.getNewStyle();
    }

    update() {
        this.clicked = false;
        this.style(this.newStyle);
    }
}

export const _mouse = new Mouse();

class Keyboard {
    constructor() {
        this.downKeys = [];
        this.clickedKeys = [];

        window.addEventListener("keypress", e => {
            const downIndex = this.downKeys.indexOf(e.key);
            if (downIndex === -1) {
                this.downKeys.push(e.key);
            }
            const clickedIndex = this.clickedKeys.indexOf(e.key);
            if (clickedIndex === -1) {
                this.clickedKeys.push(e.key);
            }
        });

        window.addEventListener("keyup", e => {
            const index = this.downKeys.indexOf(e.key);
            if (index > -1) {
                this.downKeys.splice(index, 1);
            }
        });
    }

    update() {
        this.clickedKeys = []
    }

    isDown(key) {
        return this.downKeys.includes(key);
    }

    isClicked(key) {
        return this.clickedKeys.includes(key);
    }
}

export const _keyboard = new Keyboard();

class GameEngine {
    constructor() {

        this.mainCanvas = this.createNewCanvas()
        this.calculateSize();

        document.body.appendChild(this.mainCanvas);

        document.body.style.margin = "0px";
        document.body.style.backgroundColor = "#000000";

        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.canvas.addEventListener("mousemove", e => {
            _mouse.x = Math.floor(e.offsetX/this.scale + activeCamera.display.x);
            _mouse.y = Math.floor(e.offsetY/this.scale + activeCamera.display.y);
        });
        this.canvas.addEventListener("mousedown", e => {
            _mouse.down = true;
            _mouse.clicked = true;
        });
        this.canvas.addEventListener("mouseup", e => {
            _mouse.down = false;
        });
        this.canvas.addEventListener("mouseout", e => {
            _mouse.onScreen = false;
        });
        this.canvas.addEventListener("mouseover", e => {
            _mouse.onScreen = true;
        });
    }

    addMouseClickListeners(runnable) {
        this.canvas.addEventListener("mousedown", e => {
            if (e.button === 0) {
                runnable();
            }
        });

    }

    createNewCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = gameEngineSettings.getFullSizeX();
        canvas.height = gameEngineSettings.getFullSizeY();
        canvas.style.imageRendering = "pixelated";
        canvas.ctx.imageSmoothingEnabled = false;

        return canvas;
    }

    getMainCanvas() {
        return this.mainCanvas;
    }

    setAndCalculateCanvasSize(canvas) {
        let height = window.innerHeight-window.innerHeight%canvas.height;
        let width = window.innerWidth-window.innerWidth%canvas.width;

        let finalSize = Math.min(height, width);

        // finalSize = Math.max(finalSize,gameEngineSettings.getFullSize()*2);

        this.scale = finalSize/canvas.width;

        canvas.style.width = finalSize + "px";
        canvas.style.height = finalSize + "px";

        canvas.style.marginTop = window.innerHeight/2-finalSize/2 + "px";
        canvas.style.marginLeft = window.innerWidth/2-finalSize/2 + "px";
        canvas.style.position = "absolute";
    }
}

window.onresize = function() {
    ge.calculateSize();
}

const ge = new GameEngine();

export function _cls(settings) {
    settings = settings ?? {};
    let color = settings.color ?? "#000";
    ge.ctx.fillStyle = color;
    ge.ctx.fillRect(0, 0, ge.canvas.width, ge.canvas.height);
}

export function _pSet(x,y,color) {
    ge.ctx.fillStyle = color;
    ge.ctx.fillRect(x - activeCamera.display.x, y - activeCamera.display.y, 1, 1);
}

export function _rectFill(x,y,w,h,color) {
    ge.ctx.fillStyle = color;
    ge.ctx.fillRect(x - activeCamera.display.x, y - activeCamera.display.y, w, h);
}

export function _rect(x,y,w,h,color) {
    ge.ctx.fillStyle = color;

    if (w === 1 || h === 1) {
        ge.ctx.fillRect(x - activeCamera.display.x, y - activeCamera.display.y, w, h);
        return;
    }

    ge.ctx.fillRect(x - activeCamera.display.x + 1, y - activeCamera.display.y, w - 2, 1);
    ge.ctx.fillRect(x - activeCamera.display.x + 1, y + h - 1 - activeCamera.display.y, w - 2, 1);
    ge.ctx.fillRect(x - activeCamera.display.x, y - activeCamera.display.y, 1, h);
    ge.ctx.fillRect(x+w-1 - activeCamera.display.x, y - activeCamera.display.y, 1, h);
}

export function _circleFill(x_center, y_center, radius, color) {
    let x = 0;
    let y = radius;
    let p = 3 - 2 * radius;

    const touchedPoints = [];

    while (x <= y) {
        // Draw horizontal lines between the points with transparency
        for (let i = x_center - x; i <= x_center + x; i++) {
            setPointForCircle(i, y_center + y, color, touchedPoints);
            setPointForCircle(i, y_center - y, color, touchedPoints);
        }
        for (let i = x_center - y; i <= x_center + y; i++) {
            setPointForCircle(i, y_center + x, color, touchedPoints);
            setPointForCircle(i, y_center - x, color, touchedPoints);
        }

        if (p < 0) {
            p += 4 * x + 6;
        } else {
            p += 4 * (x - y) + 10;
            y--;
        }
        x++;
    }
}

function setPointForCircle(x, y, color, touchedPoints) {
    if (touchedPoints.includes(x + "," + y)) {
        return;
    }
    _pSet(x, y, color);
    touchedPoints.push(x + "," + y);
}

export function _circle(x_center, y_center, r, color) {
    let x = 0;
    let y = r;
    let p = 3 - 2 * r;

    const touchedPoints = [];

    while (x <= y) {
        setPointForCircle(x_center + x, y_center + y, color, touchedPoints);
        setPointForCircle(x_center - x, y_center + y, color, touchedPoints);
        setPointForCircle(x_center + x, y_center - y, color, touchedPoints);
        setPointForCircle(x_center - x, y_center - y, color, touchedPoints);
        setPointForCircle(x_center + y, y_center + x, color, touchedPoints);
        setPointForCircle(x_center - y, y_center + x, color, touchedPoints);
        setPointForCircle(x_center + y, y_center - x, color, touchedPoints);
        setPointForCircle(x_center - y, y_center - x, color, touchedPoints);

        if (p < 0) {
            p += 4 * x + 6;
        } else {
            p += 4 * (x - y) + 10;
            y--;
        }
        x++;
    }
}

function _hexagon(x, y, radius, color) {
    const hexagonPoints = [
        [x + radius, y],
        [x + radius / 2, y + radius * Math.sqrt(3) / 2],
        [x - radius / 2, y + radius * Math.sqrt(3) / 2],
        [x - radius, y],
        [x - radius / 2, y - radius * Math.sqrt(3) / 2],
        [x + radius / 2, y - radius * Math.sqrt(3) / 2],
    ];

    for (let i = 0; i < hexagonPoints.length; i++) {
        const point1 = hexagonPoints[i];
        const point2 = hexagonPoints[(i + 1) % hexagonPoints.length];
        _line(point1[0], point1[1], point2[0], point2[1], color);
    }
}

// Pathname to HTMLImageElement.
const imageCache = new Map();

export function _sprite(filename, x, y, sx, sy, sw, sh) {
    const pathname = "assets/" + filename;

    let image = imageCache.get(pathname);
    if (!image) {
        image = new Image();
        image.src = pathname;
        imageCache.set(pathname, image);
    }

    if (image.complete) {
        if (sx === undefined || sy === undefined) {
            if (sx !== undefined) {
                throw new Error("must specify both sx and sy");
            }

            sx = 0;
            sy = 0;
            sw = Math.floor(image.width/gameEngineSettings.getTileSize()) - sx;
            sh = Math.floor(image.height/gameEngineSettings.getTileSize()) - sy;
        } else {
            if (sw === undefined || sh === undefined) {
                if (sw !== undefined) {
                    throw new Error("must specify both sw and sh");
                }
                sw = 1;
                sh = 1;
            }
        }

        ge.ctx.drawImage(image,
            sx * gameEngineSettings.getTileSize(),
            sy * gameEngineSettings.getTileSize(),
            sw * gameEngineSettings.getTileSize(),
            sh * gameEngineSettings.getTileSize(),
            x - activeCamera.display.x,
            y - activeCamera.display.y,
            sw * gameEngineSettings.getTileSize(),
            sh * gameEngineSettings.getTileSize());
    }
}

export function _image(filename, x, y, settings) {

    settings = settings ?? {};

    const pathname = "assets/" + filename;

    let image = imageCache.get(pathname);
    if (!image) {
        image = new Image();
        image.src = pathname;
        imageCache.set(pathname, image);
    }

    if (image.complete) {

        const scale = settings.scale ?? 1;

        const offsetX = settings.offsetX ?? 0;
        const offsetY = settings.offsetY ?? 0;

        const maxWidth = image.width - offsetX;
        const maxHeight = image.height - offsetY;

        const width = Math.min(settings.width ?? image.width, maxWidth);
        const height = Math.min(settings.height ?? image.height, maxHeight);

        ge.ctx.drawImage(
            image,
            offsetX,
            offsetY,
            width,
            height,
            x - activeCamera.display.x,
            y - activeCamera.display.y,
            width * scale,
            height * scale);
    }
}

function ME_tick(tickFunc) {
    _mouse.requestStyle("default");
    _mouse.style();
    tickFunc();
    _mouse.update();
    _keyboard.update();
    requestAnimationFrame(() => ME_tick(tickFunc));
}

export function _functions(initFunc,tickFunc) {
    initFunc();
    ME_tick(tickFunc);

    // _uploadFile()
}

export function _drawText(text, x, y, settings) {

    settings = settings ?? {};

    let color = settings.color ?? "#fff";
    let size = settings.size ?? 1;
    let wrap = settings.wrap ?? 0;
    let borderColor = settings.borderColor ??"#000";
    let borderThickness = settings.borderThickness ?? 0; // TODO something wrong here

    let textLines = [];
    let textLineWidth = 0;
    let textLine = "";

    let words = text.split(" ");

    if (wrap === 0) {
        textLines.push(text);
    } else {
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let wordWidth = word.length * 4 * size;
            if (textLineWidth + wordWidth + 3 > wrap) {
                textLines.push(textLine);
                textLine = "";
                textLineWidth = 0;
            }
            textLine += word + " ";
            textLineWidth += wordWidth;
        }
        textLines.push(textLine);
    }


    for (let currentLine = 0; currentLine < textLines.length; currentLine++) {
        let line = textLines[currentLine];
        if (borderThickness > 0) {
            for (let i = 0; i < line.length; i++) {
                for (let j = -borderThickness; j <= borderThickness; j++) {
                    for (let k = -borderThickness; k <= borderThickness; k++) {
                        if (j !== 0 || k !== 0) {
                            drawChar(line[i].toString(), x + i * 4 * size + j, y + k + currentLine*size*6, borderColor, size);
                        }
                    }
                }
            }
        }

        for (let i = 0; i < line.length; i++) {
            drawChar(line[i].toString(), x + i * 4 * size, y + currentLine*size*6, color, size);
        }
    }
}

function drawChar(char,x ,y , color, size) {

    let charObj = getFontObj(char);
    if (charObj === undefined || charObj === null) {
        charObj = getFontObj("?");
    }
    for (let i = 0; i < charObj.img.length; i++) {
        if (charObj.img[i] === 1) {
            for (let j = 0; j < size; j++) {
                for (let k = 0; k < size; k++) {
                    _pSet(x + (i % 3)*size + j, y + Math.floor(i / 3)*size + k, color);
                }
            }
        }
    }
}

// TODO Add thickness
function _line(x1, y1, x2, y2, color, settings) {

    settings = settings ?? {};

    x1 = Math.floor(x1);
    y1 = Math.floor(y1);
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while(true) {
        _pSet(x1, y1, color);

        if ((x1 === x2) && (y1 === y2)) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}

export function _downloadFile(csv, filename) {
    let file = new Blob([csv], {type:"text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// export function _uploadFile() {
//     document.addEventListener('DOMContentLoaded', function() {
//         document.getElementById("imgload").change(function () {
//             if (this.files && this.files[0]) {
//                 let reader = new FileReader();
//                 reader.onload = function (e) {
//                     document.getElementById("imgload").src = e.target.result;
//                 }
//                 reader.readAsDataURL(this.files[0]);
//             }
//         });
//     });
// }

function getFontObj(char) {
    for (let i = 0; i < font.length; i++) {
        if (font[i].ch.toLowerCase() === char.toLowerCase()) {
            return font[i];
        }
    }
}

const font = [
    {ch:" ",
        img:[
            0,0,0,
            0,0,0,
            0,0,0,
            0,0,0,
            0,0,0,]},
    {ch:"0",
        img:[
            1,1,1,
            1,0,1,
            1,0,1,
            1,0,1,
            1,1,1,]},
    {ch:"1",
        img:[
            1,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            1,1,1,]},
    {ch:"2",
        img:[
            1,1,1,
            0,0,1,
            1,1,1,
            1,0,0,
            1,1,1,]},
    {ch:"3",
        img:[
            1,1,1,
            0,0,1,
            0,1,1,
            0,0,1,
            1,1,1,]},
    {ch:"4",
        img:[
            1,0,1,
            1,0,1,
            1,1,1,
            0,0,1,
            0,0,1,]},
    {ch:"5",
        img:[
            1,1,1,
            1,0,0,
            1,1,1,
            0,0,1,
            1,1,1,]},
    {ch:"6",
        img:[
            1,0,0,
            1,0,0,
            1,1,1,
            1,0,1,
            1,1,1,]},
    {ch:"7",
        img:[
            1,1,1,
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1,]},
    {ch:"8",
        img:[
            1,1,1,
            1,0,1,
            1,1,1,
            1,0,1,
            1,1,1,]},
    {ch:"9",
        img:[
            1,1,1,
            1,0,1,
            1,1,1,
            0,0,1,
            0,0,1,]},
    {ch:"!",
        img:[
            0,1,0,
            0,1,0,
            0,1,0,
            0,0,0,
            0,1,0,]},
    {ch:"#",
        img:[
            1,0,1,
            1,1,1,
            1,0,1,
            1,1,1,
            1,0,1,]},
    {ch:"%",
        img:[
            1,0,1,
            0,0,1,
            0,1,0,
            1,0,0,
            1,0,1,]},
    {ch:"^",
        img:[
            0,1,0,
            1,0,1,
            0,0,0,
            0,0,0,
            0,0,0,]},
    {ch:"*",
        img:[
            1,0,1,
            0,1,0,
            1,1,1,
            0,1,0,
            1,0,1,]},
    {ch:"-",
        img:[
            0,0,0,
            0,0,0,
            1,1,1,
            0,0,0,
            0,0,0,]},
    {ch:"_",
        img:[
            0,0,0,
            0,0,0,
            0,0,0,
            0,0,0,
            1,1,1,]},
    {ch:"=",
        img:[
            0,0,0,
            1,1,1,
            0,0,0,
            1,1,1,
            0,0,0,]},
    {ch:"+",
        img:[
            0,0,0,
            0,1,0,
            1,1,1,
            0,1,0,
            0,0,0,]},
    {ch:"(",
        img:[
            0,1,0,
            1,0,0,
            1,0,0,
            1,0,0,
            0,1,0,]},
    {ch:")",
        img:[
            0,1,0,
            0,0,1,
            0,0,1,
            0,0,1,
            0,1,0,]},
    {ch:"[",
        img:[
            1,1,0,
            1,0,0,
            1,0,0,
            1,0,0,
            1,1,0,]},
    {ch:"]",
        img:[
            0,1,1,
            0,0,1,
            0,0,1,
            0,0,1,
            0,1,1,]},
    {ch:"{",
        img:[
            0,1,1,
            0,1,0,
            1,1,0,
            0,1,0,
            0,1,1,]},
    {ch:"}",
        img:[
            1,1,0,
            0,1,0,
            0,1,1,
            0,1,0,
            1,1,0,]},
    {ch:"<",
        img:[
            0,0,1,
            0,1,0,
            1,0,0,
            0,1,0,
            0,0,1,]},
    {ch:">",
        img:[
            1,0,0,
            0,1,0,
            0,0,1,
            0,1,0,
            1,0,0,]},
    {ch:"\\",
        img:[
            1,0,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,0,1,]},
    {ch:"|",
        img:[
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,]},
    {ch:";",
        img:[
            0,0,0,
            0,1,0,
            0,0,0,
            0,1,0,
            1,0,0,]},
    {ch:":",
        img:[
            0,0,0,
            0,1,0,
            0,0,0,
            0,1,0,
            0,0,0,]},
    {ch:"'",
        img:[
            0,0,1,
            0,1,0,
            0,0,0,
            0,0,0,
            0,0,0,]},
    {ch:"\"",
        img:[
            1,0,1,
            1,0,1,
            0,0,0,
            0,0,0,
            0,0,0,]},
    {ch:"/",
        img:[
            0,0,1,
            0,1,0,
            0,1,0,
            0,1,0,
            1,0,0,]},
    {ch:"?",
        img:[
            1,1,1,
            0,0,1,
            0,1,1,
            0,0,0,
            0,1,0,]},
    {ch:",",
        img:[
            0,0,0,
            0,0,0,
            0,0,0,
            0,1,0,
            1,0,0,]},
    {ch:".",
        img:[
            0,0,0,
            0,0,0,
            0,0,0,
            0,0,0,
            0,1,0,]},
    {ch:"a",
        img:[
            1,1,1,
            1,0,1,
            1,1,1,
            1,0,1,
            1,0,1,]},
    {ch:"b",
        img:[
            1,1,1,
            1,0,1,
            1,1,0,
            1,0,1,
            1,1,1,]},
    {ch:"c",
        img:[
            0,1,1,
            1,0,0,
            1,0,0,
            1,0,0,
            0,1,1,]},
    {ch:"d",
        img:[
            1,1,0,
            1,0,1,
            1,0,1,
            1,0,1,
            1,1,1,]},
    {ch:"e",
        img:[
            1,1,1,
            1,0,0,
            1,1,0,
            1,0,0,
            1,1,1,]},
    {ch:"f",
        img:[
            1,1,1,
            1,0,0,
            1,1,0,
            1,0,0,
            1,0,0,]},
    {ch:"g",
        img:[
            0,1,1,
            1,0,0,
            1,0,0,
            1,0,1,
            1,1,1,]},
    {ch:"h",
        img:[
            1,0,1,
            1,0,1,
            1,1,1,
            1,0,1,
            1,0,1,]},
    {ch:"i",
        img:[
            1,1,1,
            0,1,0,
            0,1,0,
            0,1,0,
            1,1,1,]},
    {ch:"j",
        img:[
            1,1,1,
            0,1,0,
            0,1,0,
            0,1,0,
            1,1,0,]},
    {ch:"k",
        img:[
            1,0,1,
            1,0,1,
            1,1,0,
            1,0,1,
            1,0,1,]},
    {ch:"l",
        img:[
            1,0,0,
            1,0,0,
            1,0,0,
            1,0,0,
            1,1,1,]},
    {ch:"m",
        img:[
            1,1,1,
            1,1,1,
            1,0,1,
            1,0,1,
            1,0,1,]},
    {ch:"n",
        img:[
            1,1,0,
            1,0,1,
            1,0,1,
            1,0,1,
            1,0,1,]},
    {ch:"o",
        img:[
            0,1,1,
            1,0,1,
            1,0,1,
            1,0,1,
            1,1,0,]},
    {ch:"p",
        img:[
            1,1,1,
            1,0,1,
            1,1,1,
            1,0,0,
            1,0,0,]},
    {ch:"q",
        img:[
            0,1,0,
            1,0,1,
            1,0,1,
            1,1,0,
            0,1,1,]},
    {ch:"r",
        img:[
            1,1,1,
            1,0,1,
            1,1,0,
            1,0,1,
            1,0,1,]},
    {ch:"s",
        img:[
            0,1,1,
            1,0,0,
            1,1,1,
            0,0,1,
            1,1,0,]},
    {ch:"t",
        img:[
            1,1,1,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,]},
    {ch:"u",
        img:[
            1,0,1,
            1,0,1,
            1,0,1,
            1,0,1,
            0,1,1,]},
    {ch:"v",
        img:[
            1,0,1,
            1,0,1,
            1,0,1,
            1,1,1,
            0,1,0,]},
    {ch:"w",
        img:[
            1,0,1,
            1,0,1,
            1,0,1,
            1,1,1,
            1,1,1,]},
    {ch:"x",
        img:[
            1,0,1,
            1,0,1,
            0,1,0,
            1,0,1,
            1,0,1,]},
    {ch:"y",
        img:[
            1,0,1,
            1,0,1,
            1,1,1,
            0,0,1,
            1,1,1,]},
    {ch:"z",
        img:[
            1,1,1,
            0,0,1,
            0,1,0,
            1,0,0,
            1,1,1,]}
];

// _functions, _cls, _rect, _rectFill, _pSet, _mouse, _sprite, _drawText, _keyboard}


function _setActiveCamera(camera) {
    if (camera == null) {
        activeCamera = new Camera(0, 0);
        return;
    }
    activeCamera = camera;
}

const Milo = {
    functions: function(initFunc, tickFunc) {
        _functions(initFunc, tickFunc);
    },
    cls: function(settings) {
        _cls(settings);
    },
    rect: function(x, y, w, h, color) {
        _rect(x, y, w, h, color);
    },
    rectFill: function(x, y, w, h, color) {
        _rectFill(x, y, w, h, color);
    },
    circle: function(x, y, r, color) {
        _circle(x, y, r, color);
    },
    circleFill: function(x, y, r, color) {
        _circleFill(x, y, r, color);
    },
    pSet: function(x, y, color) {
        _pSet(x, y, color);
    },
    mouse: _mouse,
    sprite: function(filename, x, y, sx, sy, sw, sh) {
        _sprite(filename, x, y, sx, sy, sw, sh);
    },
    image: function(filename, x, y, settings) {
        _image(filename, x, y, settings);
    },
    text: function(text, x, y, settings) {
        _drawText(text, x, y, settings);
    },
    line: function(x1, y1, x2, y2, color) {
        _line(x1, y1, x2, y2, color);
    },
    downloadFile: function(filename, text) {
        _downloadFile(filename, text);
    },
    keyboard: _keyboard,
    ParticleSystem: ParticleSystem,
    Particle: Particle,
    Vector: Vector,
    Camera: Camera,
    InteractableManager: InteractableManager,
    Interactable: Interactable,
    RectangularButton: RectangularButton,
    CheckBox: CheckBox,
    TextRectangularButton: TextRectangularButton,
    ImageRectangularButton: ImageRectangularButton,
    Grid: Grid,
    setActiveCamera: function(camera) {
        _setActiveCamera(camera);
    },
    gameEngineSettings: gameEngineSettings,
};

export default Milo;

activeCamera = new Camera(0, 0);