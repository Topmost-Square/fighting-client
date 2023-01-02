import BasicFighterSprite from '../images/sprites/32/basic.png';
import GreenFighterSprite from '../images/sprites/32/green.png';

export class SpriteSheet {
    image: HTMLImageElement|null = null;
    size = 400;
    context: CanvasRenderingContext2D|null = null;

    counter = 0;
    xRange = 0;
    xStart = 1;
    maxCountTo = 10;

    constructor(spriteSheetName: string|null = null, context: CanvasRenderingContext2D) {
        this.image = new Image();
        this.image.src = this.setSpriteSheetFile(spriteSheetName);
        this.context = context
    }

    setSpriteSheetFile(spriteSheetName: string|null) {
        switch (spriteSheetName){
            case 'basis':
                return BasicFighterSprite;
            case 'green':
                return GreenFighterSprite;
            default:
                return BasicFighterSprite;
        }
    }

    getAnimationValues(animation: string) {
        switch (animation) {
            case 'idle':
                return {
                    yStart: 1,
                    xRange: 6,
                    speed: 10,
                }
            default:
                return {
                    yStart: 1,
                    xRange: 6,
                    speed: 10,
                }
        }
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

    draw(x: number, y: number, height: number) {
        const { yStart, xRange, speed } = this.getAnimationValues('idle');

        this.xRange = xRange;
        this.maxCountTo = speed;

        this.animate();

        if (this.image) {
            const oneImageSize = 32;
            const clipWidth = 32;
            const clipHeight = 32;
            const placeImageX = x
            const placeImageY = y + height - this.size
            const widthImage = this.size;
            const heightImage = this.size;

            this.context!.imageSmoothingEnabled = false;

            this.context!.drawImage(
                this.image,
                this.xStart * oneImageSize,
                yStart * oneImageSize,
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