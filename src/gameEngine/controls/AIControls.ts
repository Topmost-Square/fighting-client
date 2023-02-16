import {BaseControls} from "./BaseControls";

export class AIControls extends BaseControls {
    moveTo: number|null = null;

    isAttacking = false;
    isWaiting   = false;

    kickSelected: string|null = null;
    kickPerformed: boolean = false;

    // todo: one of the options for harder AI -> higher speed
    kickSpeed = 500;

    attackingTimeoutId: any = null;
    waitingTimeoutId: any = null;
    moveToTimeoutId: any = null;

    decisions = ['wait', 'attack'];
    waitTimer = [1, 2];
    attackTimer = [3, 4, 5];

    kickSeries = 1;

    counter = 0;

    counterTop = 0;

    kicks = ['hand', 'hand-2', 'leg', 'leg-2', 'uppercut', 'turn'];
    calculateAndMoveHand = ['hand', 'hand-2', 'uppercut'];
    calculateAndMoveLeg = ['leg', 'leg-2', 'turn'];

    breakIdleAnimations = [
        'hand',
        'hand-2',
        'r-hand',
        'r-hand-2',
        'r-leg',
        'r-leg-2',
        'leg',
        'leg-2',
        'turn-leg',
        'r-turn-leg',
        'uppercut',
        'r-uppercut',
        'fall',
        'r-fall',
        'stand-up',
        'r-stand-up',
        'torso-kicked',
        'r-torso-kicked',
        'face-kicked',
        'r-face-kicked'
    ];

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
                // or maybe -100 -> jump forward
                return 0;
            }
        }

        return 0;
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
        return this.moveTo! < 0
            && this.fighter?.side === 'right'
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
        if (!this.kickSelected) {
            const randomKickIndex = Math.floor(Math.random() * this.kicks.length );
            this.kickSelected = this.kicks[randomKickIndex];
        } else {
            if (this.calculateAndMoveHand.includes(this.kickSelected) && !this.kickPerformed) {
                this.moveTo = this.whereToMoveHandKick();

                if (!this.fighter?.enemy?.isInTheAir() && !this.fighter?.isDown && !this.fighter?.isInTheAir()) {
                    if (this.rightMoveCheck()) {
                        this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk-back' : 'r-walk');
                        this.fighter?.goLeft();
                    } else if (this.leftMoveCheck()) {
                        this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk' : 'r-walk-back');
                        this.fighter?.goRight();
                    }
                }

                this.checkAndHandKick();

            } else if (this.calculateAndMoveLeg.includes(this.kickSelected) && !this.kickPerformed) {
                this.moveTo = this.whereToMoveLegKick();

                if (!this.fighter?.enemy?.isInTheAir() && !this.fighter?.isDown && !this.fighter?.isInTheAir()) {
                    if (this.rightMoveCheck()) {
                        this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk-back' : 'r-walk');
                        this.fighter?.goLeft();
                    }

                    if (this.leftMoveCheck()) {
                        this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk' : 'r-walk-back');
                        this.fighter?.goRight();
                    }
                }

                this.checkAndLegKick();
            }
        }
    }

    isVerticallyKickable() {
        return this.fighter!.legKickMask.y! >= this.fighter!.enemy!.position.y! &&
            this.fighter!.legKickMask.y! <= this.fighter!.enemy!.position.y! + this.fighter!.height;
    }

    isCloseForLegKick() {
        if (!this.isVerticallyKickable() && this.fighter?.isInTheAir()) {
            return false;
        }

        if (this.fighter?.side === 'left' &&
            this.fighter!.enemy!.position.x! <=
                this.fighter.position.x! + this.fighter.width +
                    this.fighter.legKickMask.width) {

            return true;
        }

        if (this.fighter?.side === 'right' &&
            this.fighter.enemy!.position.x! + this.fighter.enemy!.width >=
                this.fighter.position.x! - this.fighter.legKickMask.width) {

            return true;
        }
    }

    isCloseForHandKick() {
        if (!this.isVerticallyKickable() && this.fighter?.isInTheAir()) {
            return false;
        }

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

    /**
     * this fixes a lag when distance isn't divisible by speed
     */
    distancePerfectToMove() {
        return Math.abs(this.moveTo! - this.fighter?.position.x!) >= this.fighter?.speed!
    }

    shouldMove() {
        return this.isWaiting && !this.isAttacking && this.moveTo && this.distancePerfectToMove();
    }

    checkAndHandKick() {
        if (this.isCloseForHandKick() && !this.fighter?.enemy?.kicked && !this.fighter?.enemy?.isDown) {
            if (this.kickSelected === 'uppercut') {
                this.fighter?.performUpperCut();
            } else {
                this.fighter?.performBasicKick(this.kickSelected!);
            }

            this.kickSelected = null;
            this.kickPerformed = true;

            setTimeout(() => {
                this.fighter?.hideHandKick();
                this.kickPerformed = false;
            }, this.kickSpeed);
        }
    }

    checkAndLegKick() {
        if (this.isCloseForLegKick()  && !this.fighter?.enemy?.kicked && !this.fighter?.enemy?.isDown) {
            if (this.kickSelected === 'turn') {
                const turnKickAnimation = this.fighter?.sideControlAnimations(this.fighter?.side!)
                this.fighter?.performTurnKick(turnKickAnimation?.kick!)
            } else {
                this.fighter?.performBasicKick(this.kickSelected!);
            }

            this.kickSelected = null;
            this.kickPerformed = true;

            setTimeout(() => {
                this.fighter?.hideLegKick();
                this.kickPerformed = false;
            }, this.kickSpeed);
        }
    }

    behave() {
        if (this.fightStarted) {
            if (!this.isWaiting && !this.isAttacking && !this.fighter?.isDown) {
                this.makeChoice();
            }

            // move out of enemy after attack
            if (this.shouldMove() && !this.fighter?.isDown && !this.fighter?.isInTheAir()) {
                if (this.moveTo! > this.fighter?.position.x!) {
                    this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk' : 'r-walk-back');
                    this.fighter?.goRight();
                } else if (this.moveTo! < this.fighter?.position.x! && !this.fighter?.isDown) {
                    this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'walk-back' : 'r-walk');
                    this.fighter?.goLeft();
                }
            } else if (!this.breakIdleAnimations.includes(this.fighter?.spriteSheet?.outsideAnimationCall!) && !this.fighter?.isInTheAir()) {
                this.fighter?.spriteSheet?.callAnimation(this.fighter?.side === 'left' ? 'idle' : 'r-idle');
            }

            if (this.isAttacking && !this.fighter?.enemy?.isDown && !this.fighter?.isDown) {
                this.calculateAndMove();
            }
        }
    }
}
