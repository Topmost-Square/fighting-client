import {BaseControls} from "./BaseControls";

const decisions: any = {
    damageReceived: {
        phase1: [
            ['goLeft', 'goRight'], // add random distance value
            ['jump', 'jumpLeft', 'jumpRight'], // add random distance value
            ['sit'],
        ],
        phase2: [
            'handKick',
            'legKick'
        ]
    }
};

export class AIControls extends BaseControls {
    damageReceived = false;

    handKick() {

    }

    legKick() {

    }

    jump() {

    }

    jumpLeft() {

    }

    jumpRight() {

    }

    sit() {

    }

    goLeft() {

    }

    goRight() {

    }

    receiveDamage() {
        this.damageReceived = true;
    }

    didGetDamage() {
        this.makeDecision('damageReceived');
        this.damageReceived = false;
    }


    makeDecision(scenario: string) {
        if (decisions.hasOwnProperty(scenario)) {
            const scenarioValues: Array<any> = Object.values(decisions[scenario]);

            let actions: Array<string> = [];

            for (let i in scenarioValues) {
                const numberOfWays = scenarioValues[i].length;
                const randomlySelectedWay = Math.floor(Math.random() * numberOfWays);

                if (Array.isArray(randomlySelectedWay)) {
                    const randomlySelectedValueIndex = Math.floor(Math.random() * randomlySelectedWay.length);
                    actions = [...actions, randomlySelectedWay[randomlySelectedValueIndex]];
                } else {
                    actions = [...actions, scenarioValues[randomlySelectedWay]]
                }
            }
        }
    }

    whereToMove() {
        // console.log(this.fighter?.position, 'fighter itself')
        // console.log(this.fighter?.enemy?.position, 'enemy')
    }

    behave() {
        // 1 - orientation?
        // 2 - distance to enemy?

        this.whereToMove();

        // maybe again write it to decisions array

        // move to distance of kick (randomly arm or leg)
        // make a kick -> leg or arm

        // check did get damage? -> inside there's a decisions

        // check decisions array
        // if array is not empty -> do what
    }
}