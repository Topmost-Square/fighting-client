import { spriteSheetFile } from "./SpriteSheetFile";
import { getAnimationValues } from "./AnimationValues";
import {Fighter} from "../fighters/Fighter";

export type Animation = {
    yStart: number,
    xRange: number,
    speed: number,
    dropOnLast: boolean,
    delayOnLast: number
}

export class SpriteSheet {
    image: HTMLImageElement|null = null;
    size = 400;
    context: CanvasRenderingContext2D|null = null;
    fighter: Fighter|null = null;

    outsideAnimationCall: string|null = null;
    dropOnLast: boolean = false;

    counter = 0;
    xRange = 0;
    xStart = 1;
    yStart = 1;
    speed = 10;
    delayOnLast = 0;

    constructor(
        spriteSheetName: string|null = null,
        context: CanvasRenderingContext2D,
        fighter: Fighter
    ) {
        this.image = new Image();
        this.image.src = spriteSheetFile(spriteSheetName);
        this.context = context;
        this.fighter = fighter;
    }

    dropAnimation() {
        this.outsideAnimationCall = null;
        this.xRange = 0;
    }

    spreadAnimationValues(animationValues: Animation) {
        this.yStart = animationValues.yStart;
        this.xRange = animationValues.xRange;
        this.speed = animationValues.speed;
        this.dropOnLast = animationValues.dropOnLast;
        this.delayOnLast = animationValues.delayOnLast;
    }

    setAnimationValues(animation: string) {
        if (!this.xRange) {
            if (
                this.outsideAnimationCall === 'turn-leg' ||
                this.outsideAnimationCall === 'r-turn-leg'
            ) {
                if (this.xStart === 1) {
                    this.spreadAnimationValues(getAnimationValues(animation));
                }
            } else {
                this.spreadAnimationValues(getAnimationValues(animation));
            }
        }
    }

    animate() {
        this.counter++;

        // todo: check for 1 frame
        const countTo = this.xStart === this.xRange - 1 ?
            this.speed + this.delayOnLast : this.speed;

        if (this.counter >= countTo) {
            this.xStart++;
            this.counter = 0;
        }

        if (this.xStart >= this.xRange) {
            if (this.dropOnLast) {
                this.outsideAnimationCall = null;
                this.dropOnLast = false;
            }

            this.xStart = 1;
            this.xRange = 0;
            this.delayOnLast = 0;
        }
    }

    callAnimation(animation: string|null) {
        if (
            animation !== this.outsideAnimationCall ||
            !(this.dropOnLast && this.xStart < this.xRange)
        ) {
            if (
                animation === 'walk' ||
                animation === 'r-walk' ||
                animation === 'walk-back' ||
                animation === 'r-walk-back' ||
                animation === 'sit' ||
                animation === 'flip' ||
                animation === 'r-flip' ||
                animation === 'back-flip' ||
                animation === 'r-back-flip' ||
                animation === 'up-hand' ||
                animation === 'r-up-hand' ||
                animation === 'up-leg' ||
                animation === 'r-up-leg' ||
                animation === 'turn-leg' ||
                animation === 'r-turn-leg'
            ) {
                this.xRange = 0;
            }
            this.outsideAnimationCall = animation;
        }
    }

    processAnimation() {
        let animationType;

        if (this.fighter?.side === 'left') {
            if (this.outsideAnimationCall) {
                animationType = this.outsideAnimationCall;
            } else {
                animationType = 'idle';
            }
        } else if (this.fighter?.side === 'right') {
            if (this.outsideAnimationCall) {
                animationType = this.outsideAnimationCall;
            } else {
                animationType = 'r-idle';
            }
        }

        if (animationType) {
            this.setAnimationValues(animationType);
        }
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
