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

    moveTo: number|null = null;

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
        return this.fighter?.side === 'left' &&
            this.fighter!.enemy!.position.x! >
                this.fighter!.position.x! +
                this.fighter!.width +
                this.fighter!.handKickMask.width
    }

    leftMoveCoordinate() {
        return this.fighter!.enemy!.position.x! -
            (this.fighter!.width + this.fighter!.handKickMask.width);
    }

    shouldMoveFromRight() {
        return this.fighter?.side === 'right' &&
            this.fighter!.enemy!.position.x! +
            this.fighter!.enemy!.width <
                (this.fighter!.position.x! - this.fighter!.handKickMask.width)
    }

    rightMoveCoordinate() {
        return this.fighter!.enemy!.position.x! + this.fighter!.enemy!.width -
            (this.fighter!.position.x! - this.fighter!.handKickMask.width);
    }

    whereToMoveHandKick() {
        if (this.shouldMoveFromLeft())
            return this.leftMoveCoordinate()

        if (this.shouldMoveFromRight()) {
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

    rightMoveCheck() {
        return this.moveTo! < 0 && this.fighter?.side === 'right'
    }

    leftMoveCheck() {
        return this.moveTo! > 0 && this.fighter?.side === 'left' &&
            (
                this.fighter?.enemy?.position?.x! >
                this.fighter?.handKickMask?.x! +
                this.fighter.handKickMask.width
            )
    }

    isEnemyMoving() {
        return this.fighter?.enemy?.controls?.options.left ||
            this.fighter?.enemy?.controls?.options.right;
    }

    calculateAndMove() {
        if (!this.isEnemyMoving()) {
            this.moveTo = this.whereToMoveHandKick();

            if (this.moveTo && !this.fighter?.enemy?.isInTheAir()) {
                if (this.rightMoveCheck())
                    this.fighter?.goLeft();

                if (this.leftMoveCheck())
                    this.fighter?.goRight();
            }
        }
    }

    isCloseForLegKick() {
        if (this.fighter?.side === 'left' &&
            this.fighter!.enemy!.position.x! <=
                this.fighter.position.x! + this.fighter.width +
                    this.fighter.legKickMask.width)
            return true;

        if (this.fighter?.side === 'right' &&
            this.fighter.enemy!.position.x! + this.fighter.enemy!.width >=
                this.fighter.position.x! - this.fighter.legKickMask.width)
            return true;
    }

    behave() {
        // if enemy is in the air
        // randomly jump and try to attack


        this.calculateAndMove();
        // make a kick -> leg or arm

        if (this.isCloseForLegKick()) {
            //kick leg kick
            this.fighter?.showLegKick();
        } else {
            this.fighter?.hideLegKick();
        }



        // check did get damage? -> inside there's a decisions

        // check decisions array
        // if array is not empty -> do what
    }
}