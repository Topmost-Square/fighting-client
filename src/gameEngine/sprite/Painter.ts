import {painterFile} from "./PainterFile";

type StaticImage = {
    left: HTMLImageElement,
    right: HTMLImageElement,
    win: HTMLImageElement,
}

export class Painter {
    context: CanvasRenderingContext2D|null = null;

    // on next iterations we'll increase size
    oneImageSize: number = 32;

    size = 400;

    name: string|null = null;

    staticImage: StaticImage|null = null;

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    setImages(name: string) {
        this.staticImage = {
            left: new Image(),
            right: new Image(),
            win: new Image()
        };

        this.staticImage.left.src = painterFile(`${name}-dead-left`);
        this.staticImage.right.src = painterFile(`${name}-dead-right`);
        this.staticImage.win.src = painterFile(`${name}-win`);
    }

    parseImage(name: string) {
        if (name === 'left')
            return this.staticImage!.left;

        if (name === 'right')
            return this.staticImage!.right;

        if (name === 'win')
            return this.staticImage!.win;

        return this.staticImage!.win;
    }

    draw(
        x: number,
        y: number,
        height: number,
        name: string
    ) {
        const clipWidth = 32;
        const clipHeight = 32;
        const placeImageX = x
        const placeImageY = y + height - this.size;
        const widthImage = this.size;
        const heightImage = this.size;

        this.context!.drawImage(
            this.parseImage(name),
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
