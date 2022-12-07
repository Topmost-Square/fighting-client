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
        let coordinateToMoveHandKick = null;
        let coordinateToMoveLegKick = null;

        if (this.fighter?.position.x && this.fighter.enemy?.position.x) {
            if (this.fighter?.side === 'left') {
                coordinateToMoveHandKick =
                    this.fighter.enemy.position.x -
                    (this.fighter.width +
                    this.fighter.handKickMask.width);

                coordinateToMoveLegKick =
                    this.fighter.enemy.position.x -
                    (this.fighter.width +
                    this.fighter.legKickMask.width);

            } else if (this.fighter?.side === 'right') {
                coordinateToMoveHandKick =
                    this.fighter.enemy.position.x + this.fighter.enemy.width -
                    (this.fighter.position.x -
                    this.fighter.handKickMask.width);

                coordinateToMoveLegKick =
                    this.fighter.enemy.position.x + this.fighter.enemy.width -
                    (this.fighter.position.x -
                    this.fighter.legKickMask.width);
            }

            // todo: randomly decide if move to hand or leg kick
            return coordinateToMoveHandKick;
        }
    }

    behave() {
        // 1 - orientation?
        // 2 - distance to enemy?

        const moveTo = this.whereToMove();
        if (
            this.fighter !== null &&
            this.fighter.enemy !== null &&
            this.fighter.enemy.position.x !== null &&
            this.fighter.handKickMask.x !== null &&
            this.fighter.position.x !== null
        ) {
            if (moveTo! < 0 && this.fighter?.side === 'right') {
                this.fighter?.goLeft();
            } else if (
                moveTo! > 0 &&
                this.fighter?.side === 'left' &&
                (this.fighter.enemy.position.x > this.fighter.handKickMask.x + this.fighter.handKickMask.width)
            ) {
                this.fighter?.goRight();
            }
        }

        // maybe again write it to decisions array

        // move to distance of kick (randomly arm or leg)
        // make a kick -> leg or arm

        // check did get damage? -> inside there's a decisions

        // check decisions array
        // if array is not empty -> do what
    }
}