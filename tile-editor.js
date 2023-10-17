import Milo from "./oldEngines/main-8-30-2023.js";



// document.getElementById("OpenImgUpload").click(function(){ document.getElementById("OpenImgUpload").click(); });

class TileGridButtons {
    constructor(tileGrid, interactableManager, layer) {
        this.tileGrid = tileGrid;

        this.layer = layer;

        this.spacing = {x: 3, y: 5};
        this.x = 280;
        this.y = 50 + (gridCount - this.getLayer() - 1) * (11 + this.getSpacing().y);

        this.buttons = [];

        this.editCheckBox = new EditCheckBox(0, 0, this.getTileGrid(), layer === 2);
        this.addItem(this.getEditCheckBox());
        this.showCheckBox = new ShowCheckBox(0, 0, this.getTileGrid());
        this.addItem(this.getShowCheckBox());
        this.uploadButton = new UploadButton(0, 0, this.getTileGrid());
        this.addItem(this.getUploadButton());
        this.downloadButton = new DownloadButton(0, 0, this.getTileGrid());
        this.addItem(this.getDownloadButton());
        this.clearButton = new ClearButton(0, 0, this.getTileGrid());
        this.addItem(this.getClearButton());
    }

    getEditCheckBox() {
        return this.editCheckBox;
    }

    getShowCheckBox() {
        return this.showCheckBox;
    }

    getUploadButton() {
        return this.uploadButton;
    }

    getDownloadButton() {
        return this.downloadButton;
    }

    getClearButton() {
        return this.clearButton;
    }

    getLayer() {
        return this.layer;
    }

    addItem(item) {

        let shift = 0;
        const buttons = this.getButtons();
        shift += "layer 1".length * 4 + this.getSpacing().x;
        for (let i = 0; i < buttons.length; i++) {
            shift += buttons[i].getWidth() + this.getSpacing().x;
        }

        item.setX(this.x + shift);
        item.setY(this.y);
        interactableManager.addInteractable(item);

        this.addButton(item);
    }

    getTileGrid() {
        return this.tileGrid;
    }

    getButtons() {
        return this.buttons;
    }

    addButton(button) {
        this.getButtons().push(button);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getSpacing() {
        return this.spacing;
    }

    draw() {

        let layerName = "" + (this.getLayer() + 1);

        Milo.text(
            "layer " + layerName,
            this.getX() - (layerName.length - 1) * 4,
            (this.getY() + 3),
            {color: "white"}
        );
    }
}

class TileGrid extends Milo.Grid {
    constructor(x, y, gridCountX, gridCountY, tileSizeX, tileSizeY, spriteSheet, interactableManager, layer) {
        super(x, y, gridCountX, gridCountY, tileSizeX, tileSizeY);

        this.spriteSheet = spriteSheet;
        this.tileGridButtons = new TileGridButtons(this, interactableManager, layer);

        this.showGrid = true;

        this.layer = layer;
    }

    update() {
        if (!this.getTileGridButtons().getEditCheckBox().getChecked()) {
            return false;
        }

        if (!this.getTileGridButtons().getShowCheckBox().getChecked()) {
            return false;
        }

        const mousePos = this.getMouseTilePos();
        if (mousePos !== null) {
            if (Milo.mouse.getClick()) {
                this.tileClicked(mousePos.x, mousePos.y);
                return true;
            }
            if (Milo.mouse.getDown()) {
                this.tileHeld(mousePos.x, mousePos.y);
                return true;
            }
        }
        return false;
    }

    getTileGridButtons() {
        return this.tileGridButtons;
    }

    setShowGrid(showGrid) {
        this.showGrid = showGrid;
    }

    getShowGrid() {
        return this.showGrid;
    }

    drawBackground() {
        this.getTileGridButtons().draw();
    }

    getLayer() {
        return this.layer;
    }

    drawTile(x, y) {

        if (!this.getShowGrid()) {
            return;
        }

        const ID = this.getTile(x, y);

        const screenPos = this.tileToScreenPos(x, y);

        if (ID !== null) {

            // Milo.rect(
            //     screenPos.x,
            //     screenPos.y,
            //     this.getTileSize().x,
            //     this.getTileSize().x,
            //     "rgba(255, 255, 255, 0.2)");

            this.getSpriteSheet().drawSprite(
                screenPos.x,
                screenPos.y,
                ID
            );

        } else {
            // Milo.rect(
            //     screenPos.x,
            //     screenPos.y,
            //     this.getTileSize().x,
            //     this.getTileSize().x,
            //     "rgba(255, 255, 255, 0.03)");
        }
    }

    drawHoveredTile(x, y) {
        Milo.mouse.requestStyle("crosshair");
        const screenPos = this.tileToScreenPos(x, y);
        Milo.rectFill(
            screenPos.x,
            screenPos.y,
            this.getTileSize().x,
            this.getTileSize().x,
            "rgba(255, 255, 255, 0.03)");
    }

    getSpriteSheet() {
        return this.spriteSheet;
    }

    tileHeld(x, y) {

        const tool = this.getSpriteSheet().getToolPicker().getSelectedTool();

        if (tool === 0) {
            this.setTile(x, y, this.spriteSheet.getSelectedTileID());
        }

        if (tool === 1) {
            this.setTile(x, y, null);
        }

        if (tool === 2) {
            this.fillBucketTile(x, y, this.spriteSheet.getSelectedTileID(), this.getTile(x, y));
        }
    }
}

class ClearButton extends Milo.ImageRectangularButton {
    constructor(x, y, grid) {
        super(x, y, 11, 11, "tile-editor/icons/clear.png", 7, 7, {buttonColor: "#EE3333"});

        this.grid = grid;
    }

    getGrid() {
        return this.grid;
    }

    onClick() {
        const grid = this.grid;

        for (let y = 0; y < grid.getGridCount().y; y++) {
            for (let x = 0; x < grid.getGridCount().x; x++) {
                grid.setTile(x, y, null);
            }
        }
    }
}

class DownloadButton extends Milo.ImageRectangularButton {
    constructor(x, y, grid) {
        super(x, y, 11, 11, "tile-editor/icons/download.png", 7, 7);

        this.grid = grid;
    }

    onClick() {
        const grid = this.getGrid();

        let output = "";

        for (let y = 0; y < grid.getGridCount().y; y++) {
            for (let x = 0; x < grid.getGridCount().x; x++) {
                const ID = grid.getTile(x, y);
                if (ID !== null) {
                    output += ID + ",";
                } else {
                    output += "-1,";
                }
            }
            output = output.slice(0, -1);
            output += "\n";
        }

        Milo.downloadFile(output, "tilesheet-" + this.getGrid().getLayer() + ".csv");
    }

    getGrid() {
        return this.grid;
    }
}

class UploadButton extends Milo.ImageRectangularButton {
    constructor(x, y, grid) {
        super(x, y, 11, 11, "tile-editor/icons/upload.png", 7, 7, {buttonColor: "#37b20d"});

        this.grid = grid;
    }

    onClick() {

    }

    getGrid() {
        return this.grid;
    }
}

class IconCheckBox extends Milo.CheckBox {
    constructor(x, y, imageTrue, imageFalse, checked, extras) {
        super(x, y, 11, 11, checked, extras);

        this.imageTrue = imageTrue;
        this.imageFalse = imageFalse;
    }

    draw() {
        Milo.rect(
            this.getX(),
            this.getY(),
            this.getWidth(),
            this.getHeight(),
            "rgb(50, 50, 50)"
        )

        if (this.getChecked()) {
            this.drawImage(this.getImageTrue());
        } else {
            this.drawImage(this.getImageFalse());
        }
    }

    getImageTrue() {
        return this.imageTrue;
    }

    getImageFalse() {
        return this.imageFalse;
    }

    drawImage(image) {
        if (image === null) {
            return;
        }
        Milo.image(
            image,
            this.getX() + 2,
            this.getY() + 2
        )
    }
}

class ShowCheckBox extends IconCheckBox {
    constructor(x, y, grid) {
        super(x, y, "tile-editor/icons/open-eye.png", "tile-editor/icons/closed-eye.png", true);

        this.grid = grid;
    }

    getGrid() {
        return this.grid;
    }

    onClick() {
        this.setChecked(!this.getChecked());
        this.getGrid().setShowGrid(this.getChecked());
    }
}

class EditCheckBox extends IconCheckBox {
    constructor(x, y, grid, checked) {
        super(x, y, "tile-editor/icons/draw.png", null, checked);

        this.grid = grid;
    }

    getGrid() {
        return this.grid;
    }

    onClick() {
        if (!this.getChecked()) {
            this.setChecked(true);
            editCheckBoxChecked(this);
        }
    }
}

class SpriteSheet extends Milo.Grid {

    constructor(x, y, gridCountX, gridCountY, tileSizeX, tileSizeY, image, toolPicker, extras) {

        super(x, y, gridCountX, gridCountY, tileSizeX, tileSizeY, extras);

        this.image = image;

        this.toolPicker = toolPicker;

        this.selectedTile = {x: 0, y: 0};
    }

    getSelectedTileID() {
        return this.selectedTile.x + this.selectedTile.y * this.getGridCount().x;
    }

    tick() {
        const totalMove = new Milo.Vector(0, 0);
        if (Milo.keyboard.isClicked("w")) {
            totalMove.y -= 1;
        }
        if (Milo.keyboard.isClicked("a")) {
            totalMove.x -= 1;
        }
        if (Milo.keyboard.isClicked("s")) {
            totalMove.y += 1;
        }
        if (Milo.keyboard.isClicked("d")) {
            totalMove.x += 1;
        }

        this.selectedTile.x = Math.min(this.getGridCount().x - 1, Math.max(0, this.selectedTile.x + totalMove.x));
        this.selectedTile.y = Math.min(this.getGridCount().y - 1, Math.max(0, this.selectedTile.y + totalMove.y));
    }

    drawSprite(x, y, ID) {
        Milo.image(
            this.image,
            x,
            y,
            {
                width: this.getTileSize().x,
                height: this.getTileSize().y,
                offsetX: ID % this.getGridCount().x * this.getTileSize().x,
                offsetY: Math.floor(ID / this.getGridCount().x) * this.getTileSize().y
            }
        );
    }

    drawTile(x, y) {
        if (this.selectedTile.x === x && this.selectedTile.y === y) {
            const screenPos = this.tileToScreenPos(x, y);

            Milo.rect(
                screenPos.x-1,
                screenPos.y-1,
                this.getTileSize().x+2,
                this.getTileSize().y+2,
                "#000");
        }
    }

    drawHoveredTile(x, y) {
        Milo.mouse.requestStyle("crosshair"); // sprite sheet
        const screenPos = this.tileToScreenPos(x, y);
        Milo.rectFill(
            screenPos.x,
            screenPos.y,
            this.getTileSize().x,
            this.getTileSize().x,
            "rgba(255, 255, 255, 0.5)");
    }

    drawBackground() {
        Milo.rectFill(
            this.getPos().x,
            this.getPos().y,
            this.getGridSize().x,
            this.getGridSize().y,
            "rgb(133, 133, 133)"
        );

        Milo.image(
            this.image,
            this.getPos().x + this.getOuterSpacing().x,
            this.getPos().y + this.getOuterSpacing().y,
            {
                width: this.getGridSize().x - this.getOuterSpacing().x * 2,
                height: this.getGridSize().y - this.getOuterSpacing().y * 2,
                offsetX: 0,
                offsetY: 0
            }
        );
    }

    getToolPicker() {
        return this.toolPicker;
    }

    tileHeld(x, y) {
        this.selectedTile = {x: x, y: y};
    }
}

class ToolPicker extends Milo.Grid {

    constructor(x, y, extras) {

        super(x, y, 3, 1, 8, 7, extras);

        this.selectedTool = 0;

        this.tools = [
            "draw.png",
            "eraser.png",
            "fill.png"
        ];
    }

    getSelectedTool() {
        return this.selectedTool;
    }

    setSelectedTool(tool) {
        this.selectedTool = tool;
    }

    tick() {
        if (Milo.keyboard.isClicked("b")) {
            this.setSelectedTool(0);
        }
        if (Milo.keyboard.isClicked("e")) {
            this.setSelectedTool(1);
        }
        if (Milo.keyboard.isClicked("f")) {
            this.setSelectedTool(2);
        }
    }

    drawSprite(x, y, ID) {
        Milo.image(
            this.image,
            x,
            y,
            {
                width: this.getTileSize().x,
                height: this.getTileSize().y,
                offsetX: ID % this.getGridCount().x * this.getTileSize().x,
                offsetY: Math.floor(ID / this.getGridCount().x) * this.getTileSize().y
            }
        );
    }

    drawTile(x, y) {

        const screenPos = this.tileToScreenPos(x, y);

        Milo.image(
            "tile-editor/icons/" + this.tools[x],
            screenPos.x,
            screenPos.y,
            {
                width: this.getTileSize().x,
                height: this.getTileSize().y,
                offsetX: 0,
                offsetY: 0
            }
        );

        if (this.selectedTool === x) {
            Milo.rect(
                screenPos.x-1,
                screenPos.y-1,
                this.getTileSize().x+2,
                this.getTileSize().y+2,
                "#000");
        }
    }

    drawHoveredTile(x, y) {
        Milo.mouse.requestStyle("pointer"); // tool picker
        const screenPos = this.tileToScreenPos(x, y);
        Milo.rectFill(
            screenPos.x,
            screenPos.y,
            this.getTileSize().x,
            this.getTileSize().y,
            "rgba(255, 255, 255, 0.5)");
    }

    drawBackground() {
        Milo.rectFill(
            this.getPos().x,
            this.getPos().y,
            this.getGridSize().x,
            this.getGridSize().y,
            "rgb(133, 133, 133)"
        );
    }

    tileHeld(x, y) {
        this.setSelectedTool(x);
    }
}

const toolPicker = new ToolPicker(40, 20, {outerSpacingX: 2, outerSpacingY: 2, tileSpacingX: 3});
const spriteSheet = new SpriteSheet(40, 30, 12, 7, 16, 16, "tile-editor/ski.png", toolPicker, {outerSpacingX: 2, outerSpacingY: 2});
const grids = [];

const interactableManager = new Milo.InteractableManager();

const gridCount = 5;

for (let i = 0; i < gridCount; i++) {
    const grid = new TileGrid(40, 160, 23, 15, 16, 16, spriteSheet, interactableManager, i);
    grids.push(grid);
}

function editCheckBoxChecked(editCheckBox) {
    for (let i = 0; i < grids.length; i++) {
        const grid = grids[i];
        const otherEditCheckBox = grid.getTileGridButtons().getEditCheckBox();
        if (otherEditCheckBox !== editCheckBox) {
            otherEditCheckBox.setChecked(false);
        }
    }
}

interactableManager.addInteractable(toolPicker);
interactableManager.addInteractable(spriteSheet);
for (let i = 0; i < grids.length; i++) {
    const grid = grids[i];
    interactableManager.addInteractable(grid);
}

function _init() {

}

function _tick() {
    interactableManager.tick();
    interactableManager.update();

    Milo.cls({color: "#111"});

    const grid = grids[0];
    Milo.rectFill(grid.getX(), grid.getY(), grid.getGridSize().x, grid.getGridSize().y, "#071236");

    interactableManager.draw();
}


Milo.functions(_init, _tick);