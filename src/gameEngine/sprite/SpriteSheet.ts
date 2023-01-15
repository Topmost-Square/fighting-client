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

const dropRangeAnimations = [
    'turn-leg',
    'r-turn-leg',
    'hand',
    'r-hand',
    'hand-2',
    'r-hand-2',
    'leg',
    'r-leg',
    'leg-2',
    'r-leg-2',
    'fall',
    'r-fall',
    'stand-up',
    'r-stand-up',
];

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

    // yStart = 1;
    yStart: number|null = null;

    speed = 10;
    delayOnLast = 0;

    isDownCounter = 0;

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
            if (dropRangeAnimations.includes(this.outsideAnimationCall!)) {
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

        const countTo = this.xStart === this.xRange - 1 ?
            this.speed + this.delayOnLast : this.speed;

        if (this.outsideAnimationCall === 'stand-up' || this.outsideAnimationCall === 'r-stand-up') {
            if (this.xStart === this.xRange - 1) {
                this.fighter?.setFighterUp();
            }
        }

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
        if (animation !== this.outsideAnimationCall) {
            this.xRange = 0;
            this.outsideAnimationCall = animation;
        }
    }

    processAnimation() {
        let animationType;

        if (this.fighter?.side === 'left') {
            if (this.outsideAnimationCall) {
                animationType = this.outsideAnimationCall;
            } else {
                animationType = !this.fighter.isDown ? 'idle' : 'fall';
            }
        } else if (this.fighter?.side === 'right') {
            if (this.outsideAnimationCall) {
                animationType = this.outsideAnimationCall;
            } else {
                animationType = !this.fighter.isDown ? 'r-idle' : 'r-fall';
            }
        }

        if (animationType) {
            this.setAnimationValues(animationType);
        }
    }


    draw(x: number, y: number, height: number) {
        if (
            !this.fighter?.isDown
            || this.outsideAnimationCall === 'stand-up' ||
            this.outsideAnimationCall === 'r-stand-up'
        ) {
            this.processAnimation();
        }

        if (this.outsideAnimationCall === 'fall' || this.outsideAnimationCall === 'r-fall') {
            if (this.xStart === this.xRange - 1) {
                this.fighter?.setFighterDown();
            }
        }

        if (
            !this.fighter?.isDown
            || this.outsideAnimationCall === 'stand-up' ||
            this.outsideAnimationCall === 'r-stand-up'
        ) {
            this.animate();
        }

        if (
            this.fighter?.isDown
        ) {
            if (this.isDownCounter === 30) {
                this.callAnimation(this.fighter!.side === 'left' ? 'stand-up' : 'r-stand-up');
                this.isDownCounter = 0;
            } else {
                this.isDownCounter++
            }
        }

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
