import {Fighter} from "./Fighter";
import {AIControls} from "../controls/AIControls";

export class AIFighter extends Fighter {
    controls: AIControls|null = null;

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D,
        spriteSheet: string|null
    ) {
        super(x, y, canvas, context, spriteSheet);

        this.controls = new AIControls();
        this.controls.setFighter(this);
    }

    update() {
        this.controls?.behave();
    }
}