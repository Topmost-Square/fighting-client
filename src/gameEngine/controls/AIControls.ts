import {BaseControls} from "./BaseControls";

export class AIControls extends BaseControls {
    damageReceived = false;

    moveTo: number|null = null;

    canAttack = false;

    kickSeries = 1;

    counter = 0;

    counterTop = 0;

    seriesEnergy = 1;

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
        // make decision
        this.damageReceived = false;
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

    isVerticallyKickable() {
        return this.fighter!.legKickMask.y! >= this.fighter!.enemy!.position.y! &&
            this.fighter!.legKickMask.y! <= this.fighter!.enemy!.position.y! + this.fighter!.height;
    }

    isCloseForLegKick() {
        if (!this.isVerticallyKickable())
            return false;

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

    isCloseForHandKick() {
        if (!this.isVerticallyKickable())
            return false;

        if (this.fighter?.side === 'left' &&
            this.fighter!.enemy!.position.x! <=
            this.fighter.position.x! + this.fighter.width +
            this.fighter.handKickMask.width)
            return true;

        if (this.fighter?.side === 'right' &&
            this.fighter.enemy!.position.x! + this.fighter.enemy!.width >=
            this.fighter.position.x! - this.fighter.handKickMask.width)
            return true;
    }

    count() {
        this.counter++;
        // 60 frames -> 1 second
        if (this.counter === 60) {
            this.counter = 0
            this.counterTop++;
        }

        // 60 seconds -> 1 minute
        if (this.counterTop === 60) {
            this.counterTop = 0;
        }
    }

    decisions = ['wait', 'attack'];
    timer = [1, 2, 3];

    think() {

    }



    behave() {
        if (this.fightStarted) {
            this.calculateAndMove();
            // make a kick -> leg or arm

            if (this.isCloseForLegKick()) {
                //kick leg kick
                this.fighter?.showLegKick();
            } else {
                this.fighter?.hideLegKick();
            }

            if (this.isCloseForHandKick()) {
                this.fighter?.hideLegKick();
                this.fighter?.showHandKick();
            } else {
                this.fighter?.hideLegKick();
                this.fighter?.hideHandKick();
            }
        }
    }
}