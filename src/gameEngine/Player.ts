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

        if (this.controls?.down && this.position.y) {
            this.height = 200; // temporarily simulate fighter is down (sitting)
        }

        if (!this.controls?.down && this.position.y) {
            this.height = 400; // temporarily simulate fighter is up
        }

        if (this.position.x !== null) {
            if (this.controls?.left) {
                if (this.position.x > 0) {
                    this.position.x -= 10;
                } else if (this.position.x <= 0) {
                    this.position.x = 0;
                }
            }

            if (this.controls?.right && this.canvas) {
                if (this.position.x + this.width < this.canvas?.width) {
                    this.position.x += 10;
                } else if (this.position.x + this.width >= this.canvas?.width) {
                    this.position.x = this.canvas?.width - this.width;
                }
            }
        }
    }
}
