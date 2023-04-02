export const calculateCoefficients = (width: number) => {
    if (width >= 320 && width <= 480) {
        return { x: .5, y: .3, px: .3, py: .4 };
    }

    if (width >= 481 && width <= 768) {
        return { x: .75, y: .45, px: .5, py: .7 };
    }

    if (width >= 769 && width <= 1024) {
        return { x: .8, y: .5, px: .6, py: .8 };
    }

    if (width >= 1025 && width <= 1200) {
        return { x: .9, y: .7, px: .7, py: .8 };
    }

    if (width >= 1201) {
        return { x: 1, y: 1, px: 1, py: 1 };
    }

    return { x: 1, y: 1, px: 1, py: 1 };
}