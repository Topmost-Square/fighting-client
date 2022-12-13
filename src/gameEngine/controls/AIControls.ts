import {BaseControls} from "./BaseControls";

export class AIControls extends BaseControls {
    damageReceived = false;

    moveTo: number|null = null;

    isAttacking = false;
    isWaiting   = false;

    attackingTimeoutId: any = null;
    waitingTimeoutId: any = null;
    moveToTimeoutId: any = null;

    decisions = ['wait', 'attack'];
    waitTimer = [1, 2];
    attackTimer = [3, 4, 5];

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

    receiveDamage(damage: number) {
        this.damageReceived = true;
        //todo: lower health
    }

    moveFromEnemy() {
        if (this.fighter?.side === 'left') {
            if (this.fighter.position.x! - 250 > 0) {
                return this.fighter.position.x! - 250
            } else if (this.fighter.position.x! - 200 > 0) {
                return this.fighter.position.x! - 200
            } else if (this.fighter.position.x! - 150 > 0) {
                return this.fighter.position.x! - 150
            } else if (this.fighter.position.x! - 100 > 0) {
                return this.fighter.position.x! - 100
            } else if (this.fighter.position.x! - 50 > 0) {
                return this.fighter.position.x! - 50
            } else {
                //implement jump
                this.jump();
                // or maybe 100 -> jump forward
                return 0;
            }
        }

        if (this.fighter?.side === 'right') {
            if (this.fighter.position.x! + this.fighter.width + 250 <= this.fighter.canvas!.width) {
                return this.fighter.position.x! + 250
            } else if (this.fighter.position.x! + this.fighter.width + 200 <= this.fighter.canvas!.width) {
                return this.fighter.position.x! + 200
            } else if (this.fighter.position.x! + this.fighter.width + 150 <= this.fighter.canvas!.width) {
                return this.fighter.position.x! + 150
            } else if (this.fighter.position.x! + this.fighter.width + 100 <= this.fighter.canvas!.width) {
                return this.fighter.position.x! + 100
            } else if (this.fighter.position.x! + this.fighter.width + 50 <= this.fighter.canvas!.width) {
                return this.fighter.position.x! + 50
            } else {
                //implement jump
                this.jump();
                // or maybe -100 -> jump forward
                return 0;
            }
        }

        return 0;
    }

    didGetDamage() {
        if (this.damageReceived) {
            // make decision to move out of enemy
            this.moveTo = this.moveFromEnemy();

            this.attackingTimeoutId = null;
            this.waitingTimeoutId = null;
            this.moveToTimeoutId = null;

            this.isWaiting = false;
            this.isAttacking = false;
        }

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

    finishAttack(time: number) {
        this.isAttacking = true;
        this.attackingTimeoutId = setTimeout(() => {
            this.isAttacking = false;
            this.moveTo = this.moveFromEnemy();
            this.finishWaiting(2);

            this.moveToTimeoutId = setTimeout(() => {
                this.moveTo = null;
            }, 2000);
        }, time * 1000);
    }

    finishWaiting(time: number) {
        this.isWaiting = true;
        this.waitingTimeoutId = setTimeout(() => {
            this.isWaiting = false;
        }, time * 1000);
    }

    makeChoice() {
        const randomDecisionIndex = Math.floor(Math.random() + .5);
        const action = this.decisions[randomDecisionIndex];

        if (action === 'attack') {
            const randomTimerIndex = Math.floor(Math.random() * 3);
            const time = this.attackTimer[randomTimerIndex];

            this.finishAttack(time);
        }

        if (action === 'wait') {
            const randomTimerIndex = Math.floor(Math.random() * 2);
            const time = this.waitTimer[randomTimerIndex];

            this.finishWaiting(time);
        }
    }

    behave() {
        if (this.fightStarted) {

            this.didGetDamage()

            if (!this.isWaiting && !this.isAttacking) {
                this.makeChoice();
            }

            if (this.isWaiting && !this.isAttacking && this.moveTo) {
                if (this.moveTo > this.fighter?.position.x!) {
                    this.fighter?.goRight();
                } else {
                    this.fighter?.goLeft();
                }
            }

            if (this.isAttacking) {
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
}