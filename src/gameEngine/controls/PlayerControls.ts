import {BaseControls} from "./BaseControls";

export class PlayerControls extends BaseControls {

    generalCheck() {
        return this.fightStarted && !this.fighter!.isDown && !this.fighter!.kicked;
    }

    sideArrowCheck() {
        return !this.options.down && !this.fighter?.isInTheAir();
    }

    leftArrow() {
        if (this.sideArrowCheck())
            this.fighter?.callAnimation(this.fighter?.side === 'left' ? 'walk-back' : 'r-walk');
    }

    rightArrow() {
        if (this.sideArrowCheck())
            this.fighter?.callAnimation(this.fighter?.side === 'left' ? 'walk' : 'r-walk-back');
    }

    spreadPushAndReleased(kick: string, pushed: boolean) {
        const spreadKick = {
            ...this.options[kick],
            pushed
        }

        spreadKick.prevReleased = pushed;

        this.options = {
            ...this.options,

            [kick]: {
                ...spreadKick
            }
        }
    }

    dropMovement() {
        this.setOption('left', false);
        this.setOption('right', false);
    }

    keyDown(e: KeyboardEvent) {
        if (!this.generalCheck()) {
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
                this.setOption('up', true);
                break;
            case 'ArrowDown':
                !this.options.hand2Kick.pushed && this.setOption('down', true);
                break;
            case 'ArrowLeft':
                this.setOption('left', true);
                this.leftArrow();
                break;
            case 'ArrowRight':
                this.setOption('right', true);
                this.rightArrow();
                break;
            case ' ':
                this.setOption('block', true);
                break;
            case 'd':
                this.dropMovement();
                this.spreadPushAndReleased('handKick', true);
                break;
            case 'e':
                this.dropMovement();
                this.spreadPushAndReleased('hand2Kick', true);
                break;
            case 's':
                this.dropMovement();
                this.spreadPushAndReleased('legKick', true);
                break;
            case 'w':
                if (this.fighter?.side === 'left') {
                    this.setOption('right', false);
                }

                if (this.fighter?.side === 'right') {
                    this.setOption('left', false);
                }
                this.spreadPushAndReleased('leg2Kick', true);
                break;
        }
    }

    keyUp(e: KeyboardEvent) {
        if (!this.generalCheck()) {
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
                this.setOption('up', false);
                break;
            case 'ArrowDown':
                this.setOption('down', false);
                this.fighter?.dropAnimation();
                break;
            case 'ArrowLeft':
                this.setOption('left', false);
                this.fighter?.spriteSheet?.outsideAnimationCall !== 'turn-leg' &&
                !this.options.down &&
                this.fighter?.dropAnimation();
                break;
            case 'ArrowRight':
                this.setOption('right', false);
                this.fighter?.spriteSheet?.outsideAnimationCall !== 'r-turn-leg' &&
                !this.options.down &&
                this.fighter?.dropAnimation();
                break;
            case ' ':
                this.setOption('block', false);
                this.fighter?.dropAnimation();
                break;
            case 'd':
                this.spreadPushAndReleased('handKick', false);
                break;
            case 'e':
                this.spreadPushAndReleased('hand2Kick', false);
                break;
            case 's':
                this.spreadPushAndReleased('legKick', false);
                break;
            case 'w':
                this.spreadPushAndReleased('leg2Kick', false);
                break;
        }
    }

    constructor() {
        super();
        window.addEventListener('keydown', e => this.keyDown(e));
        window.addEventListener('keyup', e => this.keyUp(e));
    }

    behave() {}
}
