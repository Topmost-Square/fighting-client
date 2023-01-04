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
                xRange: 5,
                speed: 4,
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