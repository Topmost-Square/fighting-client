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
            this.spriteSheet?.outsideAnimationCall !== 'uppercut'
        ) {
            this.height = 200; // temporarily simulate fighter is down (sitting)

            if (
                !this.verticalAcceleration &&
                this.position.y! >= this.canvas?.height! - 500 - this.height
            ) {
                this.position.y = this.canvas?.height! - 500 + 200;

                if (this.controls.options.hand2Kick.pushed) {
                    this.spriteSheet?.callAnimation('uppercut');

                    if (this.closeForDamage('hand')) {
                        this.enemy?.getDamage(5);
                        // todo: enemy falls
                    }
                } else {
                    this.spriteSheet?.callAnimation('sit');
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

    leftControlAction() {
        if (this.controls?.options.down) {
            return;
        }

        if (this.controls?.options.left) {
            if (this.position.x! > 0) {
                this.goLeft();
            }

            if (this.position.x! <= 0) {
                this.position.x = 0;
            }
        }
    }

    callAnimation(animation: string) {
        this.spriteSheet?.callAnimation(animation);
    }

    rightControlAction() {
        if (this.controls?.options.down) {
            return;
        }

        if (this.position.x !== null) {
            if (this.controls?.options.right) {
                if (this.position.x + this.width < this.canvas?.width!) {
                    this.goRight();
                }

                if (this.position.x + this.width >= this.canvas?.width!) {
                    this.position.x = this.canvas?.width! - this.width;
                }
            }
        }
    }

    dropAnimation() {
        this.spriteSheet?.dropAnimation();
    }

    closeForDamage(kickType: string) {
        const kickMaskWidth = kickType === 'hand' ?
            this.handKickMask.width :
            this.legKickMask.width;

        return (
            this.side === 'left' &&
                this.enemy?.position.x! <=
                this.position.x! + this.width + kickMaskWidth) ||
            (
                this.side === 'right' &&
                this.enemy?.position.x! + this.enemy?.width! >=
                this.position.x! - kickMaskWidth
            );
    }

    checkHandKickPushed(kick: string) {
        const handKickPushed = kick === 'hand' ? this.controls?.options.handKick.pushed :
            this.controls?.options.hand2Kick.pushed;

        const handKickReleased = kick === 'hand' ? this.controls?.options.handKick.prevReleased :
            this.controls?.options.hand2Kick.prevReleased;

        return handKickPushed && handKickReleased && !this.isInTheAir() && this.spriteSheet?.outsideAnimationCall !== kick
    }

    handKickControlAction() {
        if (this.checkHandKickPushed('hand')) {
            if (this.closeForDamage('hand')) {
                this.enemy?.getDamage(1);
            }

            this.spriteSheet?.callAnimation('hand');

            this.handKickMask.show = true;

            this.controls?.dropReleaseFlag('handKick');

            this.handKickMask.show = false;
        }
    }

    hand2KickControlAction() {
        if (this.checkHandKickPushed('hand-2') && !this.controls?.options.down) {
            if (this.closeForDamage('hand')) {
                this.enemy?.getDamage(2);
                // todo: enemy get face kick
            }

            this.handKickMask.show = true;

            this.spriteSheet?.callAnimation('hand-2');

            this.controls?.dropReleaseFlag('hand2Kick');

            this.handKickMask.show = false;
        }
    }

    checkLegKickPushed(kick: string) {
        const legKickPushed = kick === 'leg' ? this.controls?.options.legKick.pushed :
            this.controls?.options.leg2Kick.pushed;

        const legKickReleased = kick === 'leg' ? this.controls?.options.legKick.prevReleased :
            this.controls?.options.leg2Kick.prevReleased;

        return legKickPushed && legKickReleased && !this.isInTheAir()
            && this.spriteSheet?.outsideAnimationCall !== kick
    }

    blockControlAction() {
        if (this.controls?.options.block && !this.isInTheAir()) {
            if (this.controls.options.down) {
                this.callAnimation('down-block');
            } else {
                this.callAnimation('block');
            }
        }
    }

    legKickControlAction() {
        if (this.checkLegKickPushed('leg')) {
            if (this.closeForDamage('leg')) {
                this.enemy?.getDamage(2);
            }

            this.legKickMask.show = true;

            this.spriteSheet?.callAnimation('leg');

            this.controls?.dropReleaseFlag('legKick');

            this.legKickMask.show = false;
        }
    }

    legKick2ControlAction() {
        if (this.checkLegKickPushed('leg-2')) {
            if (this.closeForDamage('leg')) {
                this.enemy?.getDamage(2);
            }

            this.legKickMask.show = true;

            this.spriteSheet?.callAnimation('leg-2');

            this.controls?.dropReleaseFlag('leg2Kick');

            this.legKickMask.show = false;
        }
    }

    inAirAction() {
        if (this.isInTheAir()) {
            if (this.spriteSheet?.outsideAnimationCall !== 'back-flip' && this.controls!.options.left) {
                    this.spriteSheet?.callAnimation('back-flip')
                } else if (this.spriteSheet?.outsideAnimationCall !== 'flip' && this.controls!.options.right) {
                    this.spriteSheet?.callAnimation('flip')
                }

            if (
                this.controls!.options.handKick.pushed &&
                this.spriteSheet?.outsideAnimationCall !== 'up-hand' &&
                this.spriteSheet?.outsideAnimationCall !== 'hand'
            ) {
                this.spriteSheet?.dropAnimation();
                this.spriteSheet?.callAnimation('up-hand')
            }

            if (
                this.controls!.options.legKick.pushed &&
                this.spriteSheet?.outsideAnimationCall !== 'up-leg' &&
                this.spriteSheet?.outsideAnimationCall !== 'leg'
            ) {
                this.spriteSheet?.dropAnimation();
                this.spriteSheet?.callAnimation('up-leg')
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
