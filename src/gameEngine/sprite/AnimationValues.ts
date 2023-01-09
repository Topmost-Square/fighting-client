import { Animation } from "./SpriteSheet";

export const getAnimationValues = (animation: string): Animation => {
    switch (animation) {
        case 'idle':
            return {
                yStart: 1,
                xRange: 6,
                speed: 10,
                dropOnLast: false
            };
        case 'hand':
            return {
                yStart: 2,
                xRange: 6,
                speed: 3,
                dropOnLast: true
            };
        case 'hand-2':
            return {
                yStart: 4,
                xRange: 6,
                speed: 4,
                dropOnLast: true
            };
        case 'walk':
            return {
                yStart: 18,
                xRange: 7,
                speed: 10,
                dropOnLast: false
            };
        case 'walk-back':
            return {
                yStart: 0,
                xRange: 7,
                speed: 10,
                dropOnLast: false
            };
        case 'leg':
            return {
                yStart: 3,
                xRange: 5,
                speed: 6,
                dropOnLast: true
            };
        case 'leg-2':
            return {
                yStart: 5,
                xRange: 5,
                speed: 6,
                dropOnLast: true
            };
        default:
            return {
                yStart: 1,
                xRange: 6,
                speed: 10,
                dropOnLast: false
            };
    }
}