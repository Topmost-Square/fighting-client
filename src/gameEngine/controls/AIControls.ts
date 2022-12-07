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

    shouldMoveFromLeft() {
        return this.fighter!.enemy!.position.x! >
            this.fighter!.position.x! + this.fighter!.width + this.fighter!.handKickMask.width
    }

    leftMoveCoordinate() {
        return this.fighter!.enemy!.position.x! - (this.fighter!.width + this.fighter!.handKickMask.width);
    }

    shouldMoveFromRight() {
        return this.fighter!.enemy!.position.x! + this.fighter!.enemy!.width <
            (this.fighter!.position.x! - this.fighter!.handKickMask.width)
    }

    rightMoveCoordinate() {
        return this.fighter!.enemy!.position.x! + this.fighter!.enemy!.width -
            (this.fighter!.position.x! - this.fighter!.handKickMask.width);
    }

    whereToMoveHandKick() {
        if (this.fighter?.side === 'left' && this.shouldMoveFromLeft())
            return this.leftMoveCoordinate()

        if (this.fighter?.side === 'right' && this.shouldMoveFromRight()) {
            return this.rightMoveCoordinate();
        }

        return null;
    }

    whereToMoveLegKick() {
        if (this.fighter?.side === 'left') {
            return this.fighter!.enemy!.position.x! -
                (this.fighter.width +
                    this.fighter.legKickMask.width);

        }

        if (this.fighter?.side === 'right') {
            return this.fighter.enemy!.position.x! + this.fighter.enemy!.width -
                (this.fighter.position.x! -
                    this.fighter.legKickMask.width);
        }

        return null;
    }

    rightMoveCheck(moveTo: number) {
        return moveTo! < 0 && this.fighter?.side === 'right'
    }

    leftMoveCheck(moveTo: number) {
        return moveTo! > 0 && this.fighter?.side === 'left' &&
            (
                this.fighter?.enemy?.position?.x! >
                this.fighter?.handKickMask?.x! +
                this.fighter.handKickMask.width
            )
    }

    calculateAndMove() {
        let moveTo = this.whereToMoveHandKick();
        if (moveTo && !this.fighter?.enemy?.isInTheAir()) {
            if (this.rightMoveCheck(moveTo))
                this.fighter?.goLeft();

            if (this.leftMoveCheck(moveTo))
                this.fighter?.goRight();
        }
    }

    behave() {
        this.calculateAndMove();
        // make a kick -> leg or arm

        // check did get damage? -> inside there's a decisions

        // check decisions array
        // if array is not empty -> do what
    }
}