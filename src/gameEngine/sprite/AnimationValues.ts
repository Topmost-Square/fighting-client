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
        case 'r-idle':
            return passAnimationObject(20, 6, 10, false);
        case 'r-flip':
            return passAnimationObject(26, 7, 5, false);
        case 'flip':
            return passAnimationObject(7, 7, 5, false);
        case 'back-flip':
            return passAnimationObject(38, 7, 5, false);
        case 'r-back-flip':
            return passAnimationObject(39, 7, 5, false);
        case 'sit':
            return passAnimationObject(13, 1, 1, false);
        case 'r-sit':
            return passAnimationObject(32, 1, 1, false);
        case 'hand':
            return passAnimationObject(2, 6, 3, true);
        case 'r-hand':
            return passAnimationObject(21, 6, 3, true);
        case 'hand-2':
            return passAnimationObject(4, 6, 4, true);
        case 'r-hand-2':
            return passAnimationObject(23, 6, 4, true);
        case 'up-hand':
            return passAnimationObject(9, 1, 1, true, 30);
        case 'r-up-hand':
            return passAnimationObject(28, 1, 1, true, 30);
        case 'uppercut':
            return passAnimationObject(17, 5, 4, true, 30);
        case 'r-uppercut':
            return passAnimationObject(36, 5, 4, true, 30);
        case 'walk':
            return passAnimationObject(18, 7, 10, false);
        case 'walk-back':
            return passAnimationObject(0, 7, 10, false);
        case 'r-walk':
            return passAnimationObject(37, 7, 10, false);
        case 'r-walk-back':
            return passAnimationObject(19, 7, 10, false);
        case 'leg':
            return passAnimationObject(3, 5, 6, true);
        case 'r-leg':
            return passAnimationObject(22, 5, 6, true);
        case 'leg-2':
            return passAnimationObject(5, 5, 6, true);
        case 'r-leg-2':
            return passAnimationObject(24, 5, 6, true);
        case 'up-leg':
            return passAnimationObject(10, 1, 1, true, 30);
        case 'r-up-leg':
            return passAnimationObject(29, 1, 1, true, 30);
        case 'turn-leg':
            return passAnimationObject(11, 8, 5, true, 30);
        case 'r-turn-leg':
            return passAnimationObject(30, 8, 5, true, 30);
        case 'block':
            return passAnimationObject(16, 1, 1, false);
        case 'r-block':
            return passAnimationObject(35, 1, 1, false);
        case 'down-block':
            return passAnimationObject(12, 1, 1, false);
        case 'r-down-block':
            return passAnimationObject(31, 1, 1, false);
        case 'face-kicked':
            return passAnimationObject(8, 1, 1, false);
        case 'r-face-kicked':
            return passAnimationObject(27, 1, 1, false);
        case 'torso-kicked':
            return passAnimationObject(15, 1, 1, false);
        case 'r-torso-kicked':
            return passAnimationObject(34, 1, 1, false);
        case 'fall':
            return passAnimationObject(6, 7, 10, true, 30);
        case 'r-fall':
            return passAnimationObject(25, 7, 10, true, 30);
        default:
            return passAnimationObject(1, 6, 10, false);
    }
}