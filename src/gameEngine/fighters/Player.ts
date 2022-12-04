import {Fighter} from "./Fighter";
import {PlayerControls} from "../controls/Controls";

export class Player extends Fighter {
    controls: PlayerControls|null = null;

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D
    ) {
        super(x, y, canvas, context);

        this.controls = new PlayerControls();
    }

    upControlAction() {
        if (this.controls?.options.up && this.position.y !== null && this.canvas) {
            if (this.verticalAcceleration === 0 && this.position.y >= (this.canvas.height - 500)) {
                this.verticalAcceleration = 50;
            }
        }
    }

    downControlAction() {
        if (this.controls?.options.down && this.position.y) {
            this.height = 200; // temporarily simulate fighter is down (sitting)

            if (
                this.canvas &&
                !this.verticalAcceleration &&
                this.position.y >= this.canvas?.height - 500 - this.height
            ) {
                this.position.y = this.canvas?.height - 500 + 200;
            }
        }

        if (!this.controls?.options.down && this.position.y) {
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
            if (this.controls?.options.left) {
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
            if (this.controls?.options.right && this.canvas) {
                if (this.position.x + this.width < this.canvas?.width) {
                    this.position.x += 10;
                } else if (this.position.x + this.width >= this.canvas?.width) {
                    this.position.x = this.canvas?.width - this.width;
                }
            }
        }
    }

    handKickControlAction() {
        if (
            this.controls?.options.handKick.pushed &&
            this.controls.options.handKick.prevReleased
        ) {
            this.handKickMask.show = true;
            this.controls?.dropReleaseFlag('handKick')
        } else {
            this.handKickMask.show = false;
        }
    }

    legKickControlAction() {
        if (
            this.controls?.options.legKick.pushed &&
            this.controls.options.legKick.prevReleased
        ) {
            this.legKickMask.show = true;
            this.controls?.dropReleaseFlag('legKick')
        } else {
            this.legKickMask.show = false;
        }
    }

    update() {
        this.upControlAction();
        this.downControlAction();
        this.leftControlAction();
        this.rightControlAction();
        this.handKickControlAction();
        this.legKickControlAction();
    }
}
