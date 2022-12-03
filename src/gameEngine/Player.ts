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

    upControlAction() {
        if (this.controls?.up && this.position.y !== null && this.canvas) {
            if (this.verticalAcceleration === 0 && this.position.y >= (this.canvas.height - 500)) {
                this.verticalAcceleration = 50;
            }
        }
    }

    downControlAction() {
        if (this.controls?.down && this.position.y) {
            this.height = 200; // temporarily simulate fighter is down (sitting)

            if (
                this.canvas &&
                !this.verticalAcceleration &&
                this.position.y >= this.canvas?.height - 500 - this.height
            ) {
                this.position.y = this.canvas?.height - 500 + 200;
            }
        }

        if (!this.controls?.down && this.position.y) {
            this.height = 400; // temporarily simulate fighter is up

            if (
                this.canvas &&
                !this.verticalAcceleration &&
                this.position.y >= this.canvas?.height - 500
            ) {
                this.position.y = this.canvas?.height - 500;
            }
        }
    }

    leftControlAction() {
        if (this.position.x !== null) {
            if (this.controls?.left) {
                if (this.position.x > 0) {
                    this.position.x -= 10;
                } else if (this.position.x <= 0) {
                    this.position.x = 0;
                }
            }
        }
    }

    rightControlAction() {
        if (this.position.x !== null) {
            if (this.controls?.right && this.canvas) {
                if (this.position.x + this.width < this.canvas?.width) {
                    this.position.x += 10;
                } else if (this.position.x + this.width >= this.canvas?.width) {
                    this.position.x = this.canvas?.width - this.width;
                }
            }
        }
    }

    update() {
        this.upControlAction();
        this.downControlAction();
        this.leftControlAction();
        this.rightControlAction();
    }
}
