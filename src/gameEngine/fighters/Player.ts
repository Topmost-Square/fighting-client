import {Fighter} from "./Fighter";
import {PlayerControls} from "../controls/PlayerControls";

export class Player extends Fighter {
    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D,
        spriteSheet: string|null
    ) {
        super(x, y, canvas, context, spriteSheet);

        this.controls = new PlayerControls(this);
    }

    update() {
        if (this.controls?.fightStarted) {
            this.upControlAction();
            this.downControlAction();

            //todo: for these add check so that player can't move if there's an enemy
            this.leftControlAction();
            this.rightControlAction();

            this.handKickControlAction();
            this.hand2KickControlAction();
            this.legKickControlAction();
            this.legKick2ControlAction();

            this.blockControlAction();

            this.inAirAction();
        }
    }
}
