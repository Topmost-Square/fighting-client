export const calculateCoefficients = (width: number) => {
    if (width >= 320 && width <= 480) {
        return { x: .5, y: .3 };
    }

    if (width >= 481 && width <= 768) {
        return { x: .75, y: .45 };
    }

    if (width >= 769 && width <= 1024) {
        return { x: .8, y: .5 };
    }

    if (width >= 1025 && width <= 1200) {
        return { x: .9, y: .7 };
    }

    if (width >= 1201) {
        return { x: 1, y: 1 };
    }

    return { x: 1, y: 1 };
}