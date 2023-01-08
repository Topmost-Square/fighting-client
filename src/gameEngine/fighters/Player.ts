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
        if (this.controls?.options.down) {
            this.height = 200; // temporarily simulate fighter is down (sitting)

            if (!this.verticalAcceleration && this.position.y! >= this.canvas?.height! - 500 - this.height) {
                this.position.y = this.canvas?.height! - 500 + 200;
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

    checkHandKickPushed() {
        return this.controls?.options.handKick.pushed &&
            this.controls.options.handKick.prevReleased &&
            this.spriteSheet?.outsideAnimationCall !== 'hand'
    }

    handKickControlAction() {
        if (this.checkHandKickPushed()) {
            if (this.closeForDamage('hand')) {
                this.enemy?.getDamage(1);
            }

            this.handKickMask.show = true;

            this.spriteSheet?.callAnimation('hand');

            this.controls?.dropReleaseFlag('handKick');
        } else {
            this.handKickMask.show = false;
        }
    }

    checkLegKickPushed() {
        return this.controls?.options.legKick.pushed &&
            this.controls.options.legKick.prevReleased &&
            this.spriteSheet?.outsideAnimationCall !== 'leg'
    }

    legKickControlAction() {
        if (this.checkLegKickPushed()) {
            if (this.closeForDamage('leg')) {
                this.enemy?.getDamage(2);
            }

            this.legKickMask.show = true;

            this.spriteSheet?.callAnimation('leg');

            this.controls?.dropReleaseFlag('legKick')
        } else {
            this.legKickMask.show = false;
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
            this.legKickControlAction();
        }
    }
}
