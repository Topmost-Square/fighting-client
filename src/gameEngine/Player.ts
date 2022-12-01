import {Fighter} from "./Fighter";
import {Controls} from "./Controls";

export class Player extends Fighter {
    controls: Controls|null = null;

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D
    ) {
        super(x, y, canvas, context);

        this.controls = new Controls();
    }

    update() {
        if (this.controls?.up && this.position.y !== null) {
            this.position.y -= 10;
        }

        if (this.controls?.down && this.position.y !== null) {
            this.position.y += 10;
        }

        if (this.controls?.left && this.position.x !== null) {
            this.position.x -= 10;
        }

        if (this.controls?.right && this.position.x !== null) {
            this.position.x += 10;
        }
    }
}
