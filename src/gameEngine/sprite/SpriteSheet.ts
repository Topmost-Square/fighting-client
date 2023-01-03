import BasicFighterSprite from '../images/sprites/32/basic.png';
import GreenFighterSprite from '../images/sprites/32/green.png';

export class SpriteSheet {
    image: HTMLImageElement|null = null;
    size = 400;
    context: CanvasRenderingContext2D|null = null;

    outsideAnimationCall: string|null = null;
    dropOnLast: boolean = false;

    counter = 0;
    xRange = 0;
    xStart = 1;
    yStart = 1;
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
                    dropOnLast: false
                }
            case 'hand':
                return {
                    yStart: 2,
                    xRange: 5,
                    speed: 15,
                    dropOnLast: true
                }
            default:
                return {
                    yStart: 1,
                    xRange: 6,
                    speed: 10,
                    dropOnLast: false
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

            if (this.dropOnLast) {
                this.outsideAnimationCall = null;
                this.dropOnLast = false;
            }
        }
    }

    callAnimation(animation: string|null) {
        this.outsideAnimationCall = animation;
    }

    processAnimation() {
        const animationType = this.outsideAnimationCall ?? 'idle'
        const animation = this.getAnimationValues(animationType);
        this.yStart = animation.yStart;
        this.xRange = animation.xRange;
        this.maxCountTo = animation.speed;
        this.dropOnLast = animation.dropOnLast;
    }

    draw(x: number, y: number, height: number) {
        this.processAnimation();

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
                this.yStart * oneImageSize,
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
