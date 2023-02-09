import { charactersList } from "./charactersList";
import {IdleAnimation} from "./IdleAnimation";

type Character = {
    face: HTMLImageElement,
    idle: HTMLImageElement,
    name: string
}

export class SelectScreen {

    selected: boolean = false;

    canvas: HTMLCanvasElement|null = null;

    context: CanvasRenderingContext2D|null = null;

    idleAnimation: IdleAnimation|null = null;

    characters: Array<Character> = [];

    pointer: number = 0;

    loadImages() {
        charactersList().forEach((character) => {
            const face = new Image();
            face.src = character.face;

            const idle = new Image();
            idle.src = character.idle;

            const name = character.name

            this.characters.push({
                face,
                idle,
                name
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

                const placeX = sizeToDisplay * (index + 1) + this.canvas?.width! / 3

                this.context!.drawImage(
                    character.face,
                    0,
                    0,
                    imageSize,
                    imageSize,
                    placeX,
                    placeY,
                    sizeToDisplay,
                    sizeToDisplay,
                );
            }
        });
    }

    drawPointer(sizeToDisplay: number, placeY: number) {
        const pointerX = sizeToDisplay * (this.pointer + 1) + this.canvas?.width! / 3

        this.context!.strokeStyle = 'yellow';

        this.context!.beginPath();
        this.context!.rect(pointerX, placeY, sizeToDisplay, sizeToDisplay);
        this.context!.stroke();
    }

    drawFighterName() {
        this.context!.font = '30px Arial';
        this.context!.fillStyle = 'white';

        this.context!.fillText(this.characters[this.pointer].name, this.canvas?.width! / 2 - 100, 200)
    }

    draw() {
        const placeY = 300;
        const imageSize = 32
        const sizeToDisplay = imageSize * 3; // thrice the original

        this.drawFaces(sizeToDisplay, imageSize, placeY);

        this.drawPointer(sizeToDisplay, placeY);

        this.drawFighterName();

        this.idleAnimation?.draw(sizeToDisplay + this.canvas?.width! / 3, 700, 100)
    }
}