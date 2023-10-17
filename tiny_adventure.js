import Milo from "./main.js";

let time = 0;

class SVG {
    constructor(points, connections, fills) {
        this.points = points;
        this.connections = connections;
        this.fills = fills;
    }

    draw(translation, rotation) {
        for (let i = 0; i < this.connections.length; i++) {
            const connection = this.connections[i];
            const point1 = this.rotatePoint(this.points[connection[0]], rotation);
            const point2 = this.rotatePoint(this.points[connection[1]], rotation);
            Milo.line(
                point1.x + translation.x,
                point1.y + translation.y,
                point2.x + translation.x,
                point2.y + translation.y,
                connection[2]);
        }
    }

    rotatePoint(point, rotation) {
        const cos = Math.cos(rotation/180*Math.PI);
        const sin = Math.sin(rotation/180*Math.PI);

        const x = point.x * cos - point.y * sin;
        const y = point.x * sin + point.y * cos;

        return new Milo.Vector(x, y);
    }
}

class Weapon {
    constructor(name, damage) {
        this.name = name;
        this.damage = damage;
    }
}

class Sword extends Weapon {
    constructor() {
        super("Sword", 10);
        this.angle = 0;
        this.angleGoal = 0;
    }

    update() {
        let desiredRotationSpeed = 15;

        let difference = this.angleGoal - this.angle;

        if (Math.abs(difference) > 180) {
            if (difference > 0) {
                difference -= 360
            } else {
                difference += 360
            }
        }

        let direction;

        if (difference > 0) {
            direction = 1
        } else {
            direction = -1
        }

        if (Math.abs(difference) < desiredRotationSpeed) {
            this.angle = this.angleGoal;
        } else {
            this.angle += desiredRotationSpeed * direction;
        }
    }

    setAngleGoal(angle) {
        this.angleGoal = angle;
    }

    draw(location) {
        const swordMetalEdge = "#acacac";
        const swordMetalInside = "#757575";
        const swordWood = "#774719";


        const svg = new SVG(
            [
                new Milo.Vector(0, 10),
                new Milo.Vector(0, 15),
                new Milo.Vector(-4, 15),
                new Milo.Vector(4, 15),
                new Milo.Vector(-2, 15),
                new Milo.Vector(-2, 30),
                new Milo.Vector(2, 15),
                new Milo.Vector(2, 30),
                new Milo.Vector(0, 32),
            ],
            [
                [0, 1, swordWood],
                [2, 3, swordMetalEdge],
                [4, 5, swordMetalEdge],
                [6, 7, swordMetalEdge],
                [5, 8, swordMetalEdge],
                [7, 8, swordMetalEdge],
            ],
            [
                [5, 7, 8, swordMetalInside]
            ]
        );

        svg.draw(
            new Milo.Vector(
                location.x,
                location.y),
            this.angle);
    }
}

class Entity {
    real = new Milo.Vector(0, 0);
    display = new Milo.Vector(0, 0);
    speed = 0;
    sprite = "Character-Base.png"
    animator = new DirectionalCharacterAnimator(new Milo.Vector(0, -1), 10);

    constructor(x, y, speed, sprite) {
        this.real = new Milo.Vector(x, y);
        this.display = new Milo.Vector(x, y);
        this.speed = speed;
        this.sprite = sprite;
        this.animator.speed = Math.floor(1/speed*2+5);
    }

    setX(x) {
        this.real.x = x;
        this.display.x = Math.floor(x);
    }
    setY(y) {
        this.real.y = y;
        this.display.y = Math.floor(y);
    }

    move(x, y) {
        this.real.x += x;
        this.real.y += y;

        this.display.x = Math.floor(this.real.x);
        this.display.y = Math.floor(this.real.y);
    }

    getReal() {
        return this.real;
    }
    getDisplay() {
        return this.display;
    }
}

class Humanoid extends Entity {
    constructor(x, y, speed, spriteSheet) {
        super(x, y, speed);
        this.spriteSheet = spriteSheet;
        this.lastReal = this.real.clone();
    }

    move(x, y) {
        this.lastReal = this.real.clone();

        super.move(x, y);

        this.animator.setDirection(new Milo.Vector(x, y));

        this.animator.tick();
    }

    draw() {
        Milo.text("" + this.animator.frame, 50,50, "#ffffff");

        let frame = 4;

        if (this.real.x !== this.lastReal.x || this.real.y !== this.lastReal.y) {
            frame = this.animator.frame * 4;
        }

        Milo.sprite(
            this.spriteSheet,
            this.getDisplay().x - 8,
            this.getDisplay().y - 8,
            frame,
            this.animator.facing * 4,
            4,
            4);
    }
}

class Player extends Humanoid {

    constructor(x, y, speed, weapon) {
        super(x, y, speed, "tiny_adventure/puny/Human-Worker-Red.png");
        this.weapon = weapon;
    }

    vectorToMouse() {
        const playerCenter = new Milo.Vector(player.getDisplay().x + 8, player.getDisplay().y + 8);
        const mousePos = new Milo.Vector(Milo.mouse.getX(), Milo.mouse.getY());
        const vectorToMouse = mousePos.clone();
        vectorToMouse.subtract(playerCenter);
        vectorToMouse.normalize();
        return vectorToMouse;
    }

    draw() {

        const vectorToMouse = this.vectorToMouse();

        this.animator.setDirection(vectorToMouse);

        super.draw();

        this.weapon.draw(
            new Milo.Vector(
                this.getDisplay().x+8,
                this.getDisplay().y+8
            ),
            vectorToMouse.getAngle() - 90
        );
    }

    update() {
        const playerMove = new Milo.Vector();

        if (Milo.keyboard.isDown("d")) {
            playerMove.add(1, 0);
        }
        if (Milo.keyboard.isDown("a")) {
            playerMove.add(-1, 0);
        }
        if (Milo.keyboard.isDown("w")) {
            playerMove.add(0, -1);
        }
        if (Milo.keyboard.isDown("s")) {
            playerMove.add(0, 1);
        }

        playerMove.normalize();

        playerMove.multiply(this.speed);

        player.move(playerMove.x, playerMove.y);

        if (playerMove.length() > 0) {
            particleSystem.addParticle(
                new Milo.Particle(
                    player.display.x+8 + Math.random()*4-2,
                    player.display.y+14,
                    Math.random()-0.5,
                    0.2,
                    "#dcc0b0",
                    30,
                    1)
            );
        }

        const vectorToMouse = this.vectorToMouse();

        this.weapon.setAngleGoal(vectorToMouse.getAngle() - 90);

        this.weapon.update();
    }
}

class Enemy extends Humanoid {

    constructor(x, y, speed) {
        super(x, y, speed, "tiny_adventure/puny/Orc-Peon-Red.png");
    }

    update() {

        const playerCenter = new Milo.Vector(player.getDisplay().x + 8, player.getDisplay().y + 8);
        const enemyCenter = new Milo.Vector(this.getDisplay().x + 8, this.getDisplay().y + 8);
        const vectorToPlayer = playerCenter.clone();
        vectorToPlayer.subtract(enemyCenter);
        vectorToPlayer.normalize();
        vectorToPlayer.multiply(this.speed);

        this.move(vectorToPlayer.x, vectorToPlayer.y);
    }

    // draw() {
    //     // Milo.rect(this.getDisplay().x, this.getDisplay().y, 24, 32, "#ff0000");
    // }
}

class DirectionalCharacterAnimator {

    vector = new Milo.Vector(0, -1);
    facing = 4;
    time = 0;
    frame = 0;
    frameList = [1, 2, 3, 4];

    constructor(vector, speed) {
        this.vector = vector;
        this.facing = this.getClosestDirectionImage(vector);

        this.speed = speed;
        this.frame = 0;
    }

    tick() {
        this.time += 1;
        this.frame = this.frameList[Math.floor(this.time / this.speed) % this.frameList.length];
    }

    getClosestDirectionImage(vector) {
        // Ignore the case of a vector (0, 0)
        if (vector.x === 0 && vector.y === 0) {
            return this.facing; // Return a value to indicate no direction
        }

        // Calculate the angle of the vector in radians
        const angle = Math.atan2(vector.y, vector.x);

        // Convert radians to degrees and ensure the angle is positive
        const degrees = (angle >= 0 ? angle : (2 * Math.PI + angle)) * (180 / Math.PI);

        // Map the angle to one of the 8 sectors
        const sector = (7 - (Math.round(degrees / 45) + 5) % 8);

        return sector;
    }

    setDirection(vector) {
        this.vector = vector;
        this.facing = this.getClosestDirectionImage(vector);
    }
}

const camera = new Milo.Camera(0, 0);

const player = new Player(0, 0, 0.8, new Sword());

const enemies = [
    new Enemy(50, 50, 0.25),
];

const particleSystem = new Milo.ParticleSystem(new Milo.Vector(0, 0));

function _init() {
    Milo.setActiveCamera(camera);
}

function _tick() {

    time += 1;

    particleSystem.update();

    player.update();

    enemies.forEach(enemy => {
        enemy.update();
    });

    if (player.getDisplay().y - camera.real.y < 0) {
        camera.real.y -= 96;
    }

    camera.update();

    Milo.cls("#000000");

    for (let i = 0; i < 8; i++) {
        for (let j = -1; j < 8; j++) {
            Milo.sprite(
                "tiny_adventure/grass.png",
                i * 16,
                j * 16 + camera.display.y - camera.display.y % 16,
                0,
                0,
                2,
                2);
        }
    }

    for (let i = -8; i < 40; i++) {
        Milo.text("" + i, 2, -i * 16, "#ff0000");
    }

    // Milo.rect(player.getDisplayX(), player.getDisplayY(), 16, 16, "#ff0000");

    Milo.text("time: " + time, 10, 1, "#ffffff");

    enemies.forEach(enemy => {
        enemy.draw();
    });

    particleSystem.draw();

    player.draw();
}

Milo.functions(_init,_tick);



