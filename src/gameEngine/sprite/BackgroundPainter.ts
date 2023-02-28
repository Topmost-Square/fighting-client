import {painterFile} from "./BackgroundPainterFile";

type StaticImage = {
    background: HTMLImageElement,
}

export class BackgroundPainter {
    context: CanvasRenderingContext2D|null = null;
    canvas: HTMLCanvasElement|null = null;

    name: string|null = null;

    staticImage: StaticImage|null = null;

    clipWidth = 500;
    clipHeight = 300;

    placeImageX = 0
    placeImageY = 0;

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    setImage(name: string) {
        this.staticImage = {
            background: new Image(),
        };

        this.staticImage.background.src = painterFile(name);
    }

    draw() {
        const widthImage = this.canvas?.width;
        const heightImage = this.canvas?.height;

        this.context!.drawImage(
            this.staticImage!.background,
            0,
            0,
            this.clipWidth,
            this.clipHeight,
            this.placeImageX,
            this.placeImageY,
            widthImage!,
            heightImage!,
        );
    }
}
