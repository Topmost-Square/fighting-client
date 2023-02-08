import { charactersList } from "./charactersList";

export class SelectScreen {

    selected: boolean = false;

    context: CanvasRenderingContext2D|null = null;

    characters: Array<HTMLImageElement> = [];

    loadImages() {
        charactersList().forEach((character) => {
            const image = new Image();
            image.src = character;
            this.characters.push(image)
        })
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    constructor() {
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowUp':
                    console.log('UP');
                    break;
                case 'ArrowDown':
                    console.log('DOWN');
                    break;
                case 'ArrowLeft':
                    console.log('LEFT');
                    break;
                case 'ArrowRight':
                    console.log('RIGHT');
                    break;
            }
        });
    }

    draw() {
        this.characters.forEach((character, index) => {
            if (character) {
                this.context!.imageSmoothingEnabled = false;

                const sizeToDisplay = 64 * 3; // thrice the original
                const placeX = sizeToDisplay * (index + 1) / 2

                this.context!.drawImage(
                    character,
                    0,
                    0,
                    64,
                    64,
                    placeX,
                    300,
                    sizeToDisplay,
                    sizeToDisplay,
                )
            }
        })
    }
}