import {Fighter} from "./Fighter";
import {PlayerControls} from "../controls/PlayerControls";

export class Player extends Fighter {

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D,
        spriteSheet: string|null
    ) {
        super(x, y, canvas, context, spriteSheet);

        this.controls = new PlayerControls(this);
    }

    upControlAction() {
        if (this.controls?.options.up && this.verticalAcceleration === 0 && !this.isInTheAir()) {
            this.verticalAcceleration = 50;
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
                this.height = 200; // fighter is down (sitting) / mask is twice smaller
            }

            if (
                !this.verticalAcceleration &&
                this.position.y! >= this.canvas?.height! - 500 - this.height
            ) {
                this.position.y = this.canvas?.height! - 500 + 200;

                if (this.controls.options.hand2Kick.pushed) {
                    this.performUpperCut();
                } else {
                    if (this.side === 'left') {
                        this.spriteSheet?.callAnimation('sit');
                    } else {
                        this.spriteSheet?.callAnimation('r-sit');
                    }
                }
            }
        }

        if (!this.controls?.options.down && this.position.y) {
            this.height = 400; // temporarily simulate fighter is up

            if (!this.verticalAcceleration && this.position.y >= this.canvas?.height! - 500) {
                this.position.y = this.canvas?.height! - 500;
            }
        }
    }

    moveLeft() {
        if (this.position.x! > 0) {
            this.goLeft();
        }

        if (this.position.x! <= 0) {
            this.position.x = 0;
        }
    }

    leftControlAction() {
        if (this.controls?.options.down) {
            return;
        }

        if (this.controls?.options.left) {
            if (this.side === 'left') {
                if (this.controls.options.leg2Kick.pushed && this.spriteSheet?.outsideAnimationCall !== 'turn-leg') {
                    this.spriteSheet?.dropAnimation();
                    this.spriteSheet?.callAnimation('turn-leg');
                } else if (this.spriteSheet?.outsideAnimationCall !== 'turn-leg') {
                    if (
                        !this.spriteSheet?.outsideAnimationCall ||
                        this?.spriteSheet?.outsideAnimationCall !== 'walk-back'
                    ) {
                        this.spriteSheet?.callAnimation('walk-back');
                    }
                    this.moveLeft();
                }
            } else {
                this.moveLeft();
            }
        }
    }

    callAnimation(animation: string) {
        this.spriteSheet?.callAnimation(animation);
    }

    moveRight() {
        if (this.position.x !== null) {
            if (this.position.x + this.width < this.canvas?.width!) {
                this.goRight();
            }

            if (this.position.x + this.width >= this.canvas?.width!) {
                this.position.x = this.canvas?.width! - this.width;
            }
        }
    }

    rightControlAction() {
        if (this.controls?.options.down) {
            return;
        }

        if (this.controls?.options.right) {
            if (this.side === 'right') {
                if (this.controls!.options.leg2Kick.pushed && this.spriteSheet?.outsideAnimationCall !== 'r-turn-leg') {
                    this.spriteSheet?.dropAnimation();
                    this.spriteSheet?.callAnimation('r-turn-leg');
                } else if (this.spriteSheet?.outsideAnimationCall !== 'r-turn-leg') {
                    if (
                        !this.spriteSheet?.outsideAnimationCall ||
                        this?.spriteSheet?.outsideAnimationCall !== 'r-walk-back'
                    ) {
                        this.spriteSheet?.callAnimation('r-walk-back');
                    }
                    this.moveRight();
                }
            } else {
                this.moveRight();
            }
        }
    }

    dropAnimation() {
        this.spriteSheet?.dropAnimation();
    }

    checkHandKickPushed(kick: string) {
        const handKickPushed = kick === 'hand' ? this.controls?.options.handKick.pushed :
            this.controls?.options.hand2Kick.pushed;

        const handKickReleased = kick === 'hand' ? this.controls?.options.handKick.prevReleased :
            this.controls?.options.hand2Kick.prevReleased;

        return handKickPushed && handKickReleased && !this.isInTheAir() && this.spriteSheet?.outsideAnimationCall !== kick
    }

    performBasicKick(kick: string) {
        if (this.shouldCommitDamage(kick)) {
            const calculatedDamage = this.calculateDamage(kick)
                this.enemy?.getDamage(
                    calculatedDamage.value,
                    calculatedDamage.area,
                    calculatedDamage.shouldFall
                );
        }

        this.spriteSheet?.callAnimation(this.calculateKickAnimation(kick));

        this.calculateAndToggleKickMask(kick, true);

        this.controls?.dropReleaseFlag(kick === 'hand' ? 'handKick' : 'hand2Kick');

        this.calculateAndToggleKickMask(kick, false);
    }

    legKickControlAction() {
        if (this.checkLegKickPushed('leg')) {
            this.performBasicKick('leg');
        }
    }

    legKick2ControlAction() {
        if (this.checkLegKickPushed('leg-2') && !this.controls?.options.left) {
            this.performBasicKick('leg-2');
        }
    }

    handKickControlAction() {
        if (this.checkHandKickPushed('hand')) {
            this.performBasicKick('hand');
        }
    }

    hand2KickControlAction() {
        if (this.checkHandKickPushed('hand-2') && !this.controls?.options.down) {
            this.performBasicKick('hand-2');
        }
    }

    checkLegKickPushed(kick: string) {
        const legKickPushed = kick === 'leg' ? this.controls?.options.legKick.pushed :
            this.controls?.options.leg2Kick.pushed;

        const legKickReleased = kick === 'leg' ? this.controls?.options.legKick.prevReleased :
            this.controls?.options.leg2Kick.prevReleased;

        return legKickPushed && legKickReleased && !this.isInTheAir()
            && this.spriteSheet?.outsideAnimationCall !== kick
            && this.spriteSheet?.outsideAnimationCall !== 'turn-leg'
            && this.spriteSheet?.outsideAnimationCall !== 'r-turn-leg'
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
                } else {
                    this.spriteSheet?.callAnimation('r-up-leg');
                }
            }
        }
    }

    update() {
        if (this.controls?.fightStarted) {
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
