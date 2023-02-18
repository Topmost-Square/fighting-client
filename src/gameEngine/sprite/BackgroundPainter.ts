import {painterFile} from "./BackgroundPainterFile";

type StaticImage = {
    background: HTMLImageElement,
}

export class BackgroundPainter {
    context: CanvasRenderingContext2D|null = null;
    canvas: HTMLCanvasElement|null = null;

    name: string|null = null;

    staticImage: StaticImage|null = null;

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
        const clipWidth = 500;
        const clipHeight = 300;
        const placeImageX = 0
        const placeImageY = 0;
        const widthImage = this.canvas?.width;
        const heightImage = this.canvas?.height;

        this.context!.drawImage(
            this.staticImage!.background,
            0,
            0,
            clipWidth,
            clipHeight,
            placeImageX,
            placeImageY,
            widthImage!,
            heightImage!,
        );
    }
}
