import Milo from "./main.js";

const GameStage = Object.freeze({
    moving: {
        name: "Moving"
    },
    attacking: {
        name: "Attacking"
    }
});

class Game {
    constructor() {
        this.grid = new MTGGrid(this);

        this.selectedCardPos = null;

        this.gameStage = GameStage.moving;
    }

    getGameStage() {
        return this.gameStage;
    }

    getGrid() {
        return this.grid;
    }

    getSelectedCardPos() {
        return this.selectedCardPos;
    }

    setSelectedCardPos(x, y) {
        if (x === null) {
            this.selectedCardPos = null;
            return;
        }
        this.selectedCardPos = {x: x, y: y};
    }

    getSelectedCard() {
        if (this.selectedCardPos === null) {
            return null;
        }

        return this.grid.getTile(this.selectedCardPos.x, this.selectedCardPos.y);
    }

    update() {

        if (Milo.mouse.getClick()) {
            const mousePos = this.grid.getMouseTilePos();
            if (mousePos === null) {
                this.setSelectedCardPos(null);
            } else {
                if (this.getGrid().getTile(mousePos.x, mousePos.y) === null) {
                    this.setSelectedCardPos(null);
                } else {
                    if (this.getSelectedCardPos() !== null &&
                        this.getSelectedCardPos().x === mousePos.x &&
                        this.getSelectedCardPos().y === mousePos.y) {
                        this.setSelectedCardPos(null);
                    } else {
                        this.setSelectedCardPos(mousePos.x, mousePos.y);
                    }
                }
            }
        }
    }

    draw() {
        Milo.cls();
        this.getGrid().draw();

        const pos = this.getGrid().getMouseTilePos();
        const message = pos === null ? "null" : "" + pos.x + ", " + pos.y;
        Milo.text(message, 10, 10, "white");
    }
}

class Card {
    constructor(grid) {
        this.settings = {
            visual: {
                size: {
                    x: 28,
                    y: 28
                }
            }
        }

        this.grid = grid;
    }

    getGrid() {
        return this.grid;
    }

    getCenteredPos(gridX, gridY) {
        const screenPos = this.getGrid().tileToScreenPos(gridX, gridY);
        const drawX = screenPos.x + Math.floor((this.getGrid().getTileSize().x - this.settings.visual.size.x)/2);
        const drawY = screenPos.y  + Math.floor((this.getGrid().getTileSize().y - this.settings.visual.size.y)/2);

        return {x: drawX, y: drawY};
    }

    draw(gridX, gridY) {

        const centeredPos = this.getCenteredPos(gridX, gridY);
        const drawX = centeredPos.x;
        const drawY = centeredPos.y;
        const width = this.settings.visual.size.x;
        const height = this.settings.visual.size.y;

        // Milo.rect(
        //     drawX,
        //     drawY,
        //     width,
        //     height,
        //     "white"
        // );

        Milo.image(
            "mtg/covers/test-image.png",
            drawX,
            drawY,
            {width: width, height: height}
        );

        if (this.getGrid().getGame().getSelectedCard() === this) {
            if (this.getGrid().getGame().getGameStage() === GameStage.moving) {
                for (let i = 0; i < 3; i++) {

                    const decalCenteredPos = this.getCenteredPos(gridX + 1, gridY + i - 1);

                    Milo.circleFill(
                        Math.floor(decalCenteredPos.x + width / 2) - 1,
                        Math.floor(decalCenteredPos.y + height / 2) - 1,
                        Math.floor(width / 2 * 0.75),
                        "rgba(255, 255, 255, 0.2)"
                    )
                }
            }
        }
    }
}

class TroopBuilding extends Card {
    constructor(grid) {
        super(grid);
    }

    draw(grid, gridX, gridY) {
        super.draw(gridX, gridY);
    }
}

class MTGGrid extends Milo.Grid {
    constructor(game) {
        // TODO Added X and Y which might mess it up
        super(0, 0, 7, 5, 32, 32, {tileSpacingX: 5, tileSpacingY: 5});
        this.game = game;
    }

    drawTile(x, y) {

        const mousePos = this.getMouseTilePos();

        const selectedCardPos = this.game.getSelectedCardPos();
        if (selectedCardPos !== null && selectedCardPos.x === x && selectedCardPos.y === y) {
            Milo.rect(
                this.tileToScreenPos(x, y).x - 1,
                this.tileToScreenPos(x, y).y - 1,
                this.getTileSize().x + 2,
                this.getTileSize().x + 2,
                "red");
            Milo.rect(
                this.tileToScreenPos(x, y).x - 2,
                this.tileToScreenPos(x, y).y - 2,
                this.getTileSize().x + 4,
                this.getTileSize().x + 4,
                "red");
        }
        Milo.rect(
            this.tileToScreenPos(x, y).x,
            this.tileToScreenPos(x, y).y,
            this.getTileSize().x,
            this.getTileSize().x,
            "rgba(255, 255, 255, 0.2)");

        const card = this.getTile(x, y);
        if (card !== null) {
            card.draw(this, x, y);
        }

        if (mousePos !== null && mousePos.x === x && mousePos.y === y) {
            Milo.rectFill(
                this.tileToScreenPos(x, y).x - 2,
                this.tileToScreenPos(x, y).y - 2,
                this.getTileSize().x + 4,
                this.getTileSize().x + 4,
                "rgba(255, 255, 255, 0.5)");
        }
    }

    getGame() {
        return this.game;
    }
}

const game = new Game();

function _init() {
    game.getGrid().setTile(3, 3, new TroopBuilding(game.getGrid()));
}

function _tick() {
    game.update();
    game.draw();
}


Milo.functions(_init, _tick);