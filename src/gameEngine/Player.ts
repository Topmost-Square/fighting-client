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
        if (this.controls?.up && this.position.y !== null && this.canvas) {
            if (this.verticalAcceleration === 0 && this.position.y >= (this.canvas.height - 500)) {
                this.controls?.stopUp();
                this.verticalAcceleration = 50;
            }
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
