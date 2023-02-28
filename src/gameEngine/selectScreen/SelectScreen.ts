import { charactersList } from "./charactersList";
import {IdleAnimation} from "./IdleAnimation";

type Character = {
    face: HTMLImageElement,
    idle: HTMLImageElement,
    name: string,
    story: Array<string>
}

export class SelectScreen {

    selected: boolean = false;

    canvas: HTMLCanvasElement|null = null;

    context: CanvasRenderingContext2D|null = null;

    idleAnimation: IdleAnimation|null = null;

    characters: Array<Character> = [];

    pointer: number = 0;

    xCoefficient: number = 1;
    yCoefficient: number = 1;

    placeY = 0;
    imageSize = 0
    sizeToDisplay = 0;
    xDraw = 0;
    yDraw = 0;

    textX = 0;
    textY = 0;

    loadImages() {
        charactersList().forEach((character) => {
            const face = new Image();
            face.src = character.face;

            const idle = new Image();
            idle.src = character.idle;

            const name = character.name
            const story = character.story

            this.characters.push({
                face,
                idle,
                name,
                story
            })
        })
    }

    setDefaultAnimation() {
        this.setIdleAnimation(this.characters[this.pointer].idle)
    }

    setCanvas(canvas: HTMLCanvasElement|null) {
        this.canvas = canvas;
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    setIdleAnimation(sprite: HTMLImageElement|null) {
        this.idleAnimation = new IdleAnimation(sprite, this.context)
    }

    setCoefficient(xCoefficient: number, yCoefficient: number) {
        this.xCoefficient = xCoefficient;
        this.yCoefficient = yCoefficient;

        this.placeY = 300 * this.yCoefficient;
        this.imageSize = 32;
        this.sizeToDisplay = this.imageSize * 3 * this.xCoefficient; // thrice the original
        this.xDraw = 700 * this.xCoefficient;
        this.yDraw = 100 * this.yCoefficient;

        this.textX = (this.canvas?.width! / 10) * this.xCoefficient;
        this.textY = 100 * this.yCoefficient;
    }

    constructor() {
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case ' ':
                    console.log('select');
                    this.selected = true;
                    break;
                case 'ArrowLeft':
                    if (!this.selected) {
                        if (this.pointer === 0) {
                            this.pointer = this.characters.length - 1;
                        } else {
                            this.pointer--;
                        }

                        this.setIdleAnimation(this.characters[this.pointer].idle)
                    }
                    break;
                case 'ArrowRight':
                    if (!this.selected) {
                        if (this.pointer >= this.characters.length - 1) {
                            this.pointer = 0;
                        } else {
                            this.pointer++;
                        }

                        this.setIdleAnimation(this.characters[this.pointer].idle)
                    }
                    break;
            }
        });
    }

    drawFaces(sizeToDisplay: number, imageSize: number, placeY: number) {
        this.characters.forEach((character, index) => {
            if (character) {
                this.context!.imageSmoothingEnabled = false;

                const placeX = (sizeToDisplay * (index + 1) + this.canvas?.width! / 3) * this.xCoefficient

                this.context!.drawImage(
                    character.face,
                    0,
                    0,
                    imageSize,
                    imageSize,
                    placeX,
                    placeY * this.yCoefficient,
                    sizeToDisplay * this.xCoefficient,
                    sizeToDisplay * this.yCoefficient,
                );
            }
        });
    }

    drawPointer(sizeToDisplay: number, placeY: number) {
        const pointerX = (sizeToDisplay * (this.pointer + 1) + this.canvas?.width! / 3)  * this.xCoefficient

        this.context!.strokeStyle = 'yellow';

        this.context!.beginPath();
        this.context!.rect(
            //todo: might be not right
            pointerX,
            placeY * this.yCoefficient,
            sizeToDisplay * this.xCoefficient,
            sizeToDisplay * this.yCoefficient
        );
        this.context!.stroke();
    }

    drawFighterName() {
        this.context!.font = `${30 * this.yCoefficient}px Arial`;
        this.context!.fillStyle = 'white';

        const story = this.characters[this.pointer].story;

        this.context!.fillText(
            this.characters[this.pointer].name,
            this.textX,
            this.textY
        );

        for (let item in story) {
            this.context!.fillText(
                story[item],
                this.textX,
                this.textY + 100 + (parseInt(item) * 30) * this.yCoefficient
            );
        }
    }

    draw() {
        this.drawFaces(this.sizeToDisplay, this.imageSize, this.placeY);

        this.drawPointer(this.sizeToDisplay, this.placeY);

        this.drawFighterName();

        this.idleAnimation?.draw(
            this.sizeToDisplay + this.canvas?.width! / 3,
            this.xDraw,
            this.yDraw,
            this.xCoefficient,
            this.yCoefficient
        )
    }
}