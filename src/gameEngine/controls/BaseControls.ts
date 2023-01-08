import {Fighter} from "../fighters/Fighter";

export class BaseControls {
    options = {
        up: false,
        down: false,
        left: false,
        right: false,
        handKick: {
            prevReleased: true,
            pushed: false
        },
        hand2Kick: {
            prevReleased: true,
            pushed: false
        },
        legKick: {
            prevReleased: true,
            pushed: false
        },
    };

    fightStarted = false;

    fighter: Fighter|null = null;

    constructor() {
        // wait for 3 seconds to prepare for fight
        if (!this.fightStarted) {
            this.preFightDelay();
        }
    }

    preFightDelay() {
        setTimeout(() => {
            this.fightStarted = true;
        }, 100);
    }

    setFighter(fighter: Fighter) {
        this.fighter = fighter;
    }

    setOption(option: string, value: boolean) {
        this.options = {
            ...this.options,
            [option]: value
        }
    }

    dropReleaseFlag(kickType: string) {
        if (this.options.hasOwnProperty(kickType)) {
            this.options = {
                ...this.options,
                [kickType]: {
                    ...[kickType],
                    prevReleased: false
                }
            };
        }
    }
}