import { Animation } from "./SpriteSheet";

const passAnimationObject = (
    yStart: number,
    xRange: number,
    speed: number,
    dropOnLast: boolean,
    delayOnLast: number = 0
    ) => ({
    yStart,
    xRange,
    speed,
    dropOnLast,
    delayOnLast
});

export const getAnimationValues = (animation: string): Animation => {
    switch (animation) {
        case 'idle':
            return passAnimationObject(1, 6, 10, false);
        case 'sit':
            return passAnimationObject(13, 1, 1, false);
        case 'hand':
            return passAnimationObject(2, 6, 3, true);
        case 'hand-2':
            return passAnimationObject(4, 6, 4, true);
        case 'uppercut':
            return passAnimationObject(17, 5, 4, true, 30);
        case 'walk':
            return passAnimationObject(18, 7, 10, false);
        case 'walk-back':
            return passAnimationObject(0, 7, 10, false);
        case 'leg':
            return passAnimationObject(3, 5, 6, true);
        case 'leg-2':
            return passAnimationObject(5, 5, 6, true);
        case 'block':
            return passAnimationObject(16, 1, 1, false);
        case 'down-block':
            return passAnimationObject(12, 1, 1, false);
        default:
            return passAnimationObject(1, 6, 10, false);
    }
}