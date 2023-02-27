export class IdleAnimation {

    context: CanvasRenderingContext2D|null = null;
    sprite: HTMLImageElement|null = null;

    doAnimate = true;

    size = 400;

    counter = 0;
    xRange = 6;
    xStart = 1;
    yStart = 0;
    maxCountTo = 10;

    constructor(sprite: HTMLImageElement|null, context: CanvasRenderingContext2D|null,) {
        this.context = context;
        this.sprite = sprite;
    }

    stopAnimating() {
        this.doAnimate = false;
    }

    animate() {
        this.counter++;

        if (this.counter >= this.maxCountTo) {
            this.xStart++;
            this.counter = 0;
        }

        if (this.xStart >= this.xRange) {
            this.xStart = 1;
        }
    }

    draw(
        x: number,
        y: number,
        height: number,
        xCoefficient: number,
        yCoefficient: number
    ) {

        this.doAnimate && this.animate();

        if (this.sprite) {
            const oneImageSize = 32;
            const clipWidth = 32;
            const clipHeight = 32;
            const placeImageX = x * xCoefficient
            const placeImageY = (y + height - this.size) * yCoefficient
            const widthImage = this.size * xCoefficient;
            const heightImage = this.size * yCoefficient;

            this.context!.imageSmoothingEnabled = false;

            this.context!.drawImage(
                this.sprite,
                this.xStart * oneImageSize,
                this.yStart! * oneImageSize,
                clipWidth,
                clipHeight,
                placeImageX,
                placeImageY,
                widthImage,
                heightImage,
            );
        }
    }
}
