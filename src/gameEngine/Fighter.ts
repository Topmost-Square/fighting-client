type Position = { x: number|null, y: number|null };

export class Fighter {
    position: Position  = {
        x: null,
        y: null
    };

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;

    width = 50;
    height = 100;

    kickMask: Position = {
        x: null,
        y: null
    }

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D
    ) {
        this.position.x = x;
        this.position.y = y;
        this.canvas = canvas;
        this.context = context;
    }

    draw() {
        this.context!.fillRect(
            this.position.x!,
            this.position.y!,
            this.width,
            this.height
        );
    }
}
