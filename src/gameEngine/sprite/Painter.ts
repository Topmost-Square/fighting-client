import {painterFile} from "./PainterFile";

type DeathImage = {
    left: HTMLImageElement,
    right: HTMLImageElement,
}

export class Painter {
    context: CanvasRenderingContext2D|null = null;

    // on next iterations we'll increase size
    oneImageSize: number = 32;

    size = 400;

    name: string|null = null;

    deathImage: DeathImage|null = null;

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    setImages(name: string) {
        this.deathImage = { left: new Image(), right: new Image() };
        this.deathImage.left.src = painterFile(`${name}-dead-left`);
        this.deathImage.right.src = painterFile(`${name}-dead-right`);
    }

    draw(x: number, y: number, height: number, side: string) {
        const clipWidth = 32;
        const clipHeight = 32;
        const placeImageX = x
        const placeImageY = y + height - this.size;
        const widthImage = this.size;
        const heightImage = this.size;

        this.context!.drawImage(
            side === 'left' ? this.deathImage!.left : this.deathImage!.right,
            0,
            0,
            clipWidth,
            clipHeight,
            placeImageX,
            placeImageY,
            widthImage,
            heightImage,
        );
    }
}
