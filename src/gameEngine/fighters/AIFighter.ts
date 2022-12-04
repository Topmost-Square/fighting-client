import {Fighter} from "./Fighter";
import {AIControls} from "../controls/AIControls";

export class AIFighter extends Fighter {
    controls: AIControls|null = null;

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D
    ) {
        super(x, y, canvas, context);

        this.controls = new AIControls();
    }

    update() {

    }
}