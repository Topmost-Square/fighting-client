import {Fighter} from "./Fighter";

export class AIFighter extends Fighter {
    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D
    ) {
        super(x, y, canvas, context);
    }

    update() {

    }
}