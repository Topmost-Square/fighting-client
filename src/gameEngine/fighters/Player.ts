import {Fighter} from "./Fighter";

export class Player extends Fighter {
    upControlAction() {
        if (this.controls?.options.up && this.verticalAcceleration === 0 && !this.isInTheAir()) {
            this.verticalAcceleration = 50 * this.yCoefficient;
        }
    }

    downControlAction() {
        if (
            this.controls?.options.down &&
            !this.controls.options.block &&
            this.spriteSheet?.outsideAnimationCall !== 'uppercut' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-uppercut'
        ) {
            if (!this.isInTheAir()) {
                this.height = 200 * this.yCoefficient; // fighter is down (sitting) / mask is twice smaller
            }

            if (
                !this.verticalAcceleration &&
                this.position.y! >= this.canvas?.height! - 500 * this.yCoefficient - this.height
            ) {
                this.position.y = this.canvas?.height! - 200 * this.yCoefficient;
                if (this.controls.options.hand2Kick.pushed) {
                    this.dataCollector?.updateKick({ type: 'damageInflicted', kick: 'uppercut' });
                    this.performUpperCut();
                } else {
                    this.spriteSheet?.callAnimation(this.side === 'left' ? 'sit' : 'r-sit');
                }
            }
        }

        if (!this.controls?.options.down && this.position.y) {
            this.height = 400 * this.yCoefficient; // temporarily simulate fighter is up

            if (!this.verticalAcceleration && this.position.y >= this.canvas?.height! - 500 * this.yCoefficient) {
                this.position.y = this.canvas?.height! - 500 * this.yCoefficient;
            }
        }
    }

    leftControlAction() {
        if (this.controls?.options.left && !this.controls.options.block && !this.controls?.options.down) {
            if (this.side === 'left') {
                this.sideControlAction('left');
            } else {
                this.moveLeft();
            }
        }
    }

    rightControlAction() {
        if (this.controls?.options.right && !this.controls.options.block && !this.controls?.options.down) {
            if (this.side === 'right') {
                this.sideControlAction('right');
            } else {
                this.moveRight();
            }
        }
    }

    legKickControlAction() {
        if (this.checkLegKickPushed('leg')) {
            this.dataCollector?.updateKick({ type: 'damageInflicted', kick: 'leg1' });
            this.performBasicKick('leg');
        }
    }

    legKick2ControlAction() {
        if (this.checkLegKickPushed('leg-2') && !this.controls?.options.left) {
            this.dataCollector?.updateKick({ type: 'damageInflicted', kick: 'leg2' });
            this.performBasicKick('leg-2');
        }
    }

    handKickControlAction() {
        if (this.checkHandKickPushed('hand')) {
            this.dataCollector?.updateKick({ type: 'damageInflicted', kick: 'hand1' });
            this.performBasicKick('hand');
        }
    }

    hand2KickControlAction() {
        if (this.checkHandKickPushed('hand-2') && !this.controls?.options.down) {
            this.dataCollector?.updateKick({ type: 'damageInflicted', kick: 'hand2' });
            this.performBasicKick('hand-2');
        }
    }

    blockControlAction() {
        if (this.controls?.options.block && !this.isInTheAir()) {
            if (this.controls.options.down) {
                if (this.side === 'left') {
                    this.callAnimation('down-block');
                } else {
                    this.callAnimation('r-down-block');
                }
            } else {
                if (this.side === 'left') {
                    this.callAnimation('block');
                } else {
                    this.callAnimation('r-block');
                }
            }
        }
    }


    inAirAction() {
        if (this.isInTheAir()) {
            if (this.side === 'left') {
                if (this.spriteSheet?.outsideAnimationCall !== 'back-flip' && this.controls!.options.left) {
                    this.spriteSheet?.callAnimation('back-flip')
                } else if (this.spriteSheet?.outsideAnimationCall !== 'flip' && this.controls!.options.right) {
                    this.spriteSheet?.callAnimation('flip')
                }
            }

            if (this.side === 'right') {
                if (this.spriteSheet?.outsideAnimationCall !== 'back-flip' && this.controls!.options.right) {
                    this.spriteSheet?.callAnimation('r-back-flip')
                } else if (this.spriteSheet?.outsideAnimationCall !== 'flip' && this.controls!.options.left) {
                    this.spriteSheet?.callAnimation('r-flip')
                }
            }

            if (
                this.controls!.options.handKick.pushed &&
                this.spriteSheet?.outsideAnimationCall !== 'up-hand' &&
                this.spriteSheet?.outsideAnimationCall !== 'r-up-hand' &&
                this.spriteSheet?.outsideAnimationCall !== 'hand' &&
                this.spriteSheet?.outsideAnimationCall !== 'r-hand'
            ) {
                this.spriteSheet?.dropAnimation();
                if (this.side === 'left') {
                    this.spriteSheet?.callAnimation('up-hand');
                } else {
                    this.spriteSheet?.callAnimation('r-up-hand');
                }
            }

            if (
                this.controls!.options.legKick.pushed &&
                this.spriteSheet?.outsideAnimationCall !== 'up-leg' &&
                this.spriteSheet?.outsideAnimationCall !== 'r-up-leg' &&
                this.spriteSheet?.outsideAnimationCall !== 'leg' &&
                this.spriteSheet?.outsideAnimationCall !== 'r-leg'
            ) {
                this.spriteSheet?.dropAnimation();
                if (this.side === 'left') {
                    this.spriteSheet?.callAnimation('up-leg');
                    //todo: inflict damage
                } else {
                    this.spriteSheet?.callAnimation('r-up-leg');
                    //todo: inflict damage
                }
            }
        }
    }

    update() {
        if (this.controls!.fightStarted && !this.isDown && !this.kicked) {
            this.upControlAction();
            this.downControlAction();

            //todo: for these add check so that player can't move if there's an enemy
            this.leftControlAction();
            this.rightControlAction();

            this.handKickControlAction();
            this.hand2KickControlAction();
            this.legKickControlAction();
            this.legKick2ControlAction();

            this.blockControlAction();

            this.inAirAction();
        }

    }
}
