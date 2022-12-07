import {Fighter} from "./Fighter";
import {PlayerControls} from "../controls/PlayerControls";

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
        if (this.controls?.options.up && this.verticalAcceleration === 0 && !this.isInTheAir()) {
            this.verticalAcceleration = 50;
        }
    }

    downControlAction() {
        if (this.controls?.options.down) {
            this.height = 200; // temporarily simulate fighter is down (sitting)

            if (!this.verticalAcceleration && this.position.y! >= this.canvas?.height! - 500 - this.height) {
                this.position.y = this.canvas?.height! - 500 + 200;
            }
        }

        if (!this.controls?.options.down && this.position.y) {
            this.height = 400; // temporarily simulate fighter is up

            if (!this.verticalAcceleration && this.position.y >= this.canvas?.height! - 500) {
                this.position.y = this.canvas?.height! - 500;
            }
        }
    }

    leftControlAction() {
        if (this.controls?.options.left) {
            if (this.position.x! > 0) {
                this.goLeft();
            }

            if (this.position.x! <= 0) {
                this.position.x = 0;
            }
        }
    }

    rightControlAction() {
        if (this.position.x !== null) {
            if (this.controls?.options.right) {
                if (this.position.x + this.width < this.canvas?.width!) {
                    this.goRight();
                }

                if (this.position.x + this.width >= this.canvas?.width!) {
                    this.position.x = this.canvas?.width! - this.width;
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

        //todo: for these add check so that player can't move if there's an enemy
        this.leftControlAction();
        this.rightControlAction();

        this.handKickControlAction();
        this.legKickControlAction();
    }
}
