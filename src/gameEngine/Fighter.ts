type Position = { x: number|null, y: number|null };
type KickMask = {
    x: number|null,
    y: number|null,
    width: number,
    height: number,
    show: boolean
};

export class Fighter {
    position: Position  = {
        x: null,
        y: null
    };

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;

    // todo: these values should depend on screen size
    width = 150;
    height = 400;

    verticalAcceleration = 0;
    gravity = 20;

    handKickMask: KickMask = {
        show: false,
        x: null,
        y: null,
        width: 150,
        height: 50
    }

    legKickMask: KickMask = {
        show: false,
        x: null,
        y: null,
        width: 250,
        height: 70
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

    drawKickMasks() {
        //todo: should depend on where fighter is pointed to left or right
        if (this.position.x !== null && this.position.y !== null) {
            this.handKickMask.x = this.position.x + this.width
            this.handKickMask.y = this.position.y + this.height / 4

            this.legKickMask.x = this.position.x + this.width
            this.legKickMask.y = this.position.y + this.height / 2
        }
    }

    useGravity() {
        if (this.position.y !== null && this.canvas) {
            if (this.position.y < (this.canvas.height - 500)) {
                this.position.y += this.gravity;
            }
        }

        if (this.verticalAcceleration > 0 && this.position.y && this.canvas) {
            this.position.y -= this.verticalAcceleration;
            this.verticalAcceleration--;
        }

        if (this.verticalAcceleration === 1) {
            this.verticalAcceleration = 0;
        }
    }

    draw() {
        this.useGravity();

        // draw fighter
        if (this.context) {
            this.context.fillStyle = "black";
        }
        this.context!.fillRect(
            this.position.x!,
            this.position.y!,
            this.width,
            this.height
        );

        this.drawKickMasks();

        // draw hand kick
        if (this.context) {
            this.context.fillStyle = "red";
        }

        if (this.handKickMask.show) {
            this.context?.fillRect(
                this.handKickMask.x!,
                this.handKickMask.y!,
                this.handKickMask.width,
                this.handKickMask.height
            )
        }

        // draw leg kick
        if (this.context) {
            this.context.fillStyle = "green";
        }

        if (this.legKickMask.show) {
            this.context?.fillRect(
                this.legKickMask.x!,
                this.legKickMask.y!,
                this.legKickMask.width,
                this.legKickMask.height
            )
        }
    }
}