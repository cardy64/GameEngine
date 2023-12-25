import Milo from "./oldEngines/main-8-30-2023.js";

const screen = {width: 890/2, height: 890/2};

class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 16;
        this.height = 16;

        this.x -= Math.floor(this.width/2);
        this.y -= Math.floor(this.height/2);
    }

    draw() {
        Milo.image("overtale/heart.png", this.getX(), this.getY());
    }

    getX() {
        return Math.floor(this.x);
    }

    getY() {
        return Math.floor(this.y);
    }
}

class BattleBox {
    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.goalWidth = width;
        this.goalHeight = height;
        this.goalX = x;
        this.goalY = y;
        this.startWidth = width;
        this.startHeight = height;
        this.startX = x;
        this.startY = y;

        this.frame = 0;
        this.animFrame = 0;

        this.heart = new Heart(this.x, this.y);
    }

    update() {
        this.updateSize();
        this.updateHeart();
    }

    updateHeart() {

        let move = new Milo.Vector(0, 0);

        let moveSpeed = 1;

        if (Milo.keyboard.isDown("w")) {
            move.y -= moveSpeed;
        }
        if (Milo.keyboard.isDown("s")) {
            move.y += moveSpeed;
        }
        if (Milo.keyboard.isDown("a")) {
            move.x -= moveSpeed;
        }
        if (Milo.keyboard.isDown("d")) {
            move.x += moveSpeed;
        }

        this.heart.x += move.getX();
        this.heart.y += move.getY();
    }

    updateSize() {
        if (this.frame >= this.animFrame) {
            this.frame = this.animFrame;
            this.width = this.goalWidth;
            this.startWidth = this.goalWidth;
            this.height = this.goalHeight;
            this.startHeight = this.goalHeight;
            this.x = this.goalX;
            this.startX = this.goalX;
            this.y = this.goalY;
            this.startY = this.goalY;
        } else {
            this.frame += 1;

            const t = this.frame / this.animFrame;
            
            this.width = Math.floor(this.lerp(this.startWidth, this.goalWidth, t));
            this.height = Math.floor(this.lerp(this.startHeight, this.goalHeight, t));
            this.x = Math.floor(this.lerp(this.startX, this.goalX, t));
            this.y = Math.floor(this.lerp(this.startY, this.goalY, t));
        }
    }

    lerp(v1, v2, t) {
        return (v2 - v1) * t + v1
    }

    draw() {
        let x = this.x - Math.floor(this.width/2);
        let y = this.y - Math.floor(this.height/2);

        Milo.rect(x, y, this.width, this.height, "#ffffff");
        Milo.rect(x - 1, y - 1, this.width + 2, this.height + 2, "#ffffff");
        console.log(this.goalHeight)

        this.heart.draw();
    }

    animate(frames, goalWidth, goalHeight, goalX, goalY) {
        this.frame = 0;
        this.animFrame = frames;
        if (goalWidth != null) {
            this.goalWidth = goalWidth;
            this.startWidth = this.width;
        }
        if (goalHeight != null) {
            this.goalHeight = goalHeight;
            this.startHeight = this.height;
        }
        if (goalX != null) {
            this.goalX = goalX;
            this.startX = this.x;
        }
        if (goalY != null) {
            this.goalY = goalY;
            this.startY = this.y;
        }
    }
}

const battleBox = new BattleBox(5, 5, Math.floor(screen.width/2), 150 + Math.floor(150/2));
battleBox.animate(100, 200, 150, null, null);

function _init() {

}

function _tick() {
    Milo.cls({coqlor:"#ff00ff"});
    battleBox.update()
    battleBox.draw();
}

 Milo.functions(_init, _tick);