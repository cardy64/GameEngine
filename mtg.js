import Milo from "./main.js";

const deck = [];

let cursor = "default";

let animation = null;

function _init() {
    const card1 = new Card("wall", "mtg/covers/test-image.png", {type: "build", desc: "Ayo wassup"});
    deck.push(card1);

    const card2 = new Card("skeleton", "mtg/covers/test-image.png", {type: "troop", desc: "Click clack"});
    deck.push(card2);

    const card3 = new Card("sheeeesh", "mtg/covers/test-image.png", {type: "build", desc: "Sheeeesh"});
    deck.push(card3);

    const card4 = new Card("last one", "mtg/covers/test-image.png", {type: "spell", desc: "kaboom sheeesh here we go even more yayy lolz"});
    deck.push(card4);

    for (let i = 0; i < deck.length; i++) {
        deck[i] = {card: deck[i], y: 0}
    }
}

class Card {

    constructor(name, image, extras) {
        this.name = name;
        this.image = image;
        extras = extras ?? {};
        this.type = extras.type ?? null;
        this.desc = extras.desc ?? null;
        this.attack = extras.attack ?? null;
        this.health = extras.health ?? null;
        this.cost = extras.cost ?? null;
    }

    getCardHeight(type) {
        if (type < 0) {
            return 69 + this.getEdgeRadius(type)*2;
        }
        return 130;
    }
    getCardWidth(type) {
        if (type < 0) {
            return 69 + this.getEdgeRadius(type)*2;
        }
        return 81;
    }
    getEdgeRadius(type) {
        if (type < 0) {
            return 2;
        }
        return 2;
    }

    mouseOver(x, y, settings, type) {
        let cardHeight = this.getCardHeight(type);
        let cardWidth = this.getCardWidth(type);
        let edgeRadius = this.getEdgeRadius(type);

        if (Milo.mouse.getX() >= x &&
            Milo.mouse.getX() <= x + cardWidth &&
            Milo.mouse.getY() >= y) {
            if (
                Milo.mouse.getY() <= y + cardHeight ||
                settings.ignoreDown === true) {
                return true;
            }
        }
        return false;
    }

    draw(x, y, type) {

        const that = this;

        let drawY = 0;

        const colors = {
            boxEdge: "#35522d",
            boxBackground: "#fff",
        }

        let cardHeight = this.getCardHeight(type);
        let cardWidth = this.getCardWidth(type);
        let edgeRadius = this.getEdgeRadius(type);

        Milo.text("" + type, x - 5, y + 5, "red");

        drawEdge();

        if (type === -1) {


            drawBackground("mtg/covers/wall-background.png");
            drawImage({edgeGap: -1});
            drawTextBox(2, "auto", {text: ["wall","b"], textPadding: 1});
            // drawDescription({edgeGap: 1});

            return;
        }
        if (type === 0) {
            drawBackground("#66935b");
            drawImage({borderBoxImageOrColor: "mtg/covers/wall-background.png", edgeColor: colors.boxEdge});
            drawTextBox(1, 11);
            drawDescription();
        }
        if (type === 1) {
            drawBackground("mtg/covers/wall-background.png");
            drawImage();
            drawTextBox(1, 11);
            drawDescription();
        }
        if (type === 2) {
            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(1, 11);
            drawImage();
            drawDescription();
        }
        if (type === 3) {
            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(3, 11);
            drawImage();
            drawDescription();
        }
        if (type === 4) {
            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(1, 11, {bgColor: "rgba(0,0,0,0)", edgeColor:"rgba(0,0,0,0)"});
            drawImage();
            drawDescription();
        }
        if (type === 5) {
            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(3, 11, {bgColor: "rgba(0,0,0,0)", edgeColor:"rgba(0,0,0,0)"});
            drawImage();
            drawDescription();
        }
        if (type === 6) {
            colors.boxBackground = "#66935b";

            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(3, 11);
            drawImage();
            drawDescription();
        }
        if (type === 7) {
            colors.boxBackground = "#b6dca9";

            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(3, 11);
            drawImage();
            drawDescription();
        }
        if (type === 8) {
            drawBackground("#b6dca9");
            drawTextBox(3, 11);
            drawImage({borderBoxImageOrColor: "mtg/covers/wall-background.png", edgeColor: colors.boxEdge});
            drawDescription();
        }
        if (type === 9) {
            drawBackground("#b6dca9");
            drawTextBox(2, 11);
            drawImage({borderBoxImageOrColor: "mtg/covers/wall-background.png", edgeColor: colors.boxEdge});
            drawDescription({edgeGap: 2});
        }
        if (type === 10) {
            colors.boxBackground = "#b6dca9";

            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(1, 11);
            drawImage();
            drawDescription({edgeGap: 1});
        }
        if (type === 11) {
            colors.boxBackground = "#b6dca9";

            drawBackground("mtg/covers/wall-background.png");
            drawTextBox(2, 11);
            drawImage();
            drawDescription({edgeGap: 2});
        }

        function drawDescription(settings) {

            settings = settings ?? {};

            let bgColor = settings.bgColor ?? colors.boxBackground;
            let edgeColor = settings.edgeColor ?? colors.boxEdge;
            let edgeGap = settings.edgeGap ?? 3;

            let ret = drawRect(edgeGap, "auto", bgColor, edgeColor);
            const textX = x + edgeRadius + edgeGap - 3 + 6;

            if (that.desc !== null) {
                Milo.text(that.desc,
                    textX,
                    ret.y + 3,
                    "black",
                    {
                        size: 1,
                        wrap: cardWidth - edgeRadius * 2 - 11,
                    });
            }
        }

        function drawImage(settings) {

            settings = settings ?? {};

            let borderBoxImageOrColor = settings.borderBoxImageOrColor ?? "rgba(255,255,255,0)";
            let edgeColor = settings.edgeColor ?? "rgba(255,255,255,0)";
            let edgeGap = settings.edgeGap ?? 3;

            let ret;

            if (borderBoxImageOrColor !== undefined) {
                ret = drawRect(edgeGap, 50, borderBoxImageOrColor, edgeColor);
            } else {
                ret = drawRect(edgeGap, 50, "", "rgba(255,255,255,0)");
            }

            Milo.image(
                that.image,
                ret.x + 1,
                ret.y + 1,
                {
                    // width: cardWidth - edgeRadius * 2 - 8,
                    // height: 48
                }
            );
        }

        function drawBackground(imageOrColor) {
            if (imageOrColor.startsWith("#") || imageOrColor.startsWith("rgb")) {
                Milo.rectFill(
                    x + edgeRadius,
                    y + edgeRadius,
                    cardWidth - edgeRadius * 2,
                    cardHeight - edgeRadius * 2,
                    imageOrColor);
            } else {
                Milo.image(imageOrColor,
                    x + edgeRadius,
                    y + edgeRadius,
                    {
                        width: cardWidth - edgeRadius * 2,
                        height: cardHeight - edgeRadius * 2
                    }
                    );
            }
        }

        function drawTextBox(edgeGap, height, settings) {

            settings = settings ?? {};

            let bgColor = settings.bgColor ?? colors.boxBackground;
            let edgeColor = settings.edgeColor ?? colors.boxEdge;
            let text = settings.text ?? [];
            let textPadding = settings.textPadding ?? null;

            if (height !== "auto") {
                height = height + Math.max(0, text.length - 1) * 7;
            }

            const ret = drawRect(edgeGap, height, bgColor, edgeColor);

            height = ret.height;
            let textHeight = Math.round(0.5 * height + 1.5);
            if (textPadding !== null) {
                textHeight = height + textPadding - 5;
            }
            const textY = y + drawY - textHeight;

            const textX = x + edgeRadius + edgeGap - 3 + 6;

            if (text.length === 0) {
                Milo.text(
                    that.name,
                    textX,
                    textY,
                    "black");

                if (that.type !== null) {
                    Milo.text(
                        " - ",
                        textX + that.name.length * 4 - 2,
                        textY,
                        "#838383");
                    Milo.text(
                        that.type,
                        textX + that.name.length * 4 + 8,
                        textY,
                        "#838383");
                }
            } else {
                for (let i = 0; i < text.length; i++) {
                    Milo.text(
                        text[i],
                        textX,
                        textY + i * 7,
                        "black");
                }
            }

            const icons = [
                {icon: "health", width: 7},
                {icon: "damage", width: 9},
                {icon: "cost", width: 7},
            ]

            let textPush = 1;
            for (let i = 0; i < icons.length; i++) {
                textPush += icons[i].width + 1;
                Milo.image(
                    "mtg/icons/" + icons[i].icon + ".png",
                    textX + ret.width - textPush - 2 - 1, // Math.round(0.5 * height - 4.5) -
                    ret.y + Math.round(0.5 * height - 4.5) + 1
                );
                Milo.text(
                    "3",
                    textX + ret.width - textPush - 2 - 1 + Math.round(0.5 * icons[i].width - 1.5), // Math.round(0.5 * height - 4.5) -
                    ret.y + Math.round(0.5 * height - 4.5) + 2,
                    "#fff"
                )
            }
        }

        function drawRect(edgeGap, height, colorOrImage, edgeColor) {

            if (height === "auto") {
                height = cardHeight - drawY - edgeGap - edgeRadius;
            }

            let width = cardWidth - edgeGap * 2 - edgeRadius * 2;

            if (drawY === 0) {
                drawY = edgeGap + edgeRadius;
            }

            const tempX = x + edgeGap + edgeRadius;
            const tempY = y + drawY;

            Milo.rectFill(
                tempX,
                tempY,
                width,
                height,
                edgeColor);

            rectColorOrImage(
                tempX + 1,
                tempY + 1,
                width - 2,
                height - 2,
                colorOrImage
            );

            drawY += height - 1;

            return {
                x: tempX,
                y: tempY,
                width: width,
                height: height
            };
        }

        function drawEdge() {
            Milo.rectFill(
                x + edgeRadius,
                y,
                cardWidth - edgeRadius * 2,
                edgeRadius,
                "black");

            Milo.rectFill(
                x + edgeRadius,
                y + cardHeight - edgeRadius,
                cardWidth - edgeRadius * 2,
                edgeRadius,
                "black");

            Milo.rectFill(
                x,
                y + edgeRadius,
                edgeRadius,
                cardHeight - edgeRadius * 2,
                "black");

            Milo.rectFill(
                x + cardWidth - edgeRadius,
                y + edgeRadius,
                edgeRadius,
                cardHeight - edgeRadius * 2,
                "black");

            Milo.pSet(x + 1, y + 1, "black");
            Milo.pSet(x, y + 1, "black");
            Milo.pSet(x + 1, y, "black");

            Milo.pSet(x + cardWidth - 2, y + 1, "black");
            Milo.pSet(x + cardWidth - 1, y + 1, "black");
            Milo.pSet(x + cardWidth - 2, y, "black");

            Milo.pSet(x + 1, y + cardHeight - 2, "black");
            Milo.pSet(x, y + cardHeight - 2, "black");
            Milo.pSet(x + 1, y + cardHeight - 1, "black");

            Milo.pSet(x + cardWidth - 2, y + cardHeight - 2, "black");
            Milo.pSet(x + cardWidth - 1, y + cardHeight - 2, "black");
            Milo.pSet(x + cardWidth - 2, y + cardHeight - 1, "black");
        }
    }
}

function rectColorOrImage(x, y, width, height, colorOrImage) {
    if (colorOrImage.startsWith("#") || colorOrImage.startsWith("rgb")) {
        Milo.rectFill(x, y, width, height, colorOrImage);
    } else {
        Milo.image(colorOrImage, x, y, {width: width, height: height});
    }
}

function _tick() {
    cursor = "default";

    Milo.cls({color: "#703c00"});

    const raiseHeight = 64;

    for (let i = 0; i < Math.min(4, deck.length); i++) {

        const cardSlot = deck[i];
        const card = cardSlot.card;

        const x = 80 + i * 90;
        let y = 55*8-70 - cardSlot.y;

        const mouseOver = card.mouseOver(x, y, {ignoreDown: true});

        if (mouseOver) {
            cardSlot.y = raiseHeight-Math.floor((raiseHeight - cardSlot.y) / 2);

            if (cardSlot.y === raiseHeight-1) {
                cardSlot.y = raiseHeight;
            }

            cursor = "pointer";
        } else {
            cardSlot.y = Math.floor(cardSlot.y / 2);

            if (cardSlot.y === 1) {
                cardSlot.y = 0;
            }
        }

        card.draw(x, y, i%2);

        // Milo.text("" + mouseOver + " " + cardSlot.y, x, y, "white");
    }

    Milo.image("mtg/covers/card-back.png", -5, 370);

    Milo.mouse.style(cursor);

    const card = new Card("wall", "mtg/covers/wall-image.png", {type: "b", desc: "Block them all!"});

    card.draw(10, 6, 9);
    card.draw(190, 6, 11);

    if (Milo.mouse.getClick() && animation === null) {
        animation = 0;
    }

    let cardPos = new Milo.Vector(10, 144);

    if (animation !== null) {
        animation += 0.1;

        if (animation > 1) {
            animation = null;
        }

        // cardPos = Milo.Vector.lerp(
        //     new Milo.Vector(10, 144),
        //     new Milo.Vector(100, 144),
        //     animation
        // );
    }

    card.draw(10, 144, -1);
    // card.draw(100, 144, 6);
    // card.draw(190, 144, 7);
}

Milo.functions(_init,_tick);