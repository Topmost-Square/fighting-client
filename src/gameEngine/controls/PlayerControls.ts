import {BaseControls} from "./BaseControls";
import {Player} from "../fighters/Player";

export class PlayerControls extends BaseControls {
    fighter: Player|null = null;

    constructor(fighter: Player|null) {
        super();

        this.fighter = fighter;

        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowUp':
                    this.setOption('up', true);
                    break;
                case 'ArrowDown':
                    !this.options.hand2Kick.pushed && this.setOption('down', true);
                    break;
                case 'ArrowLeft':
                    this.setOption('left', true);
                    if (
                        !this.options.down &&
                        !this.fighter?.isInTheAir()
                    ) {
                        if (this.fighter?.side === 'left') {
                            this.fighter?.callAnimation('walk-back');
                        } else {
                            this.fighter?.callAnimation('r-walk');
                        }
                    }
                    break;
                case 'ArrowRight':
                    this.setOption('right', true);
                    if (!this.options.down && !fighter?.isInTheAir()) {
                        if (this.fighter?.side === 'left') {
                            this.fighter?.callAnimation('walk-back');
                        } else {
                            this.fighter?.callAnimation('r-walk-back');
                        }
                    }
                    break;
                case ' ':
                    this.setOption('block', true);
                    break;
                case 'd':
                    this.options = {
                        ...this.options,
                        handKick: {
                            ...this.options.handKick,
                            pushed: true,
                        }
                    }
                    break;
                case 'e':
                    this.options = {
                        ...this.options,
                        hand2Kick: {
                            ...this.options.hand2Kick,
                            pushed: true,
                        }
                    }
                    break;
                case 's':
                    this.options = {
                        ...this.options,
                        legKick: {
                            ...this.options.legKick,
                            pushed: true,
                        }
                    }
                    break;
                case 'w':
                    this.options = {
                        ...this.options,
                        leg2Kick: {
                            ...this.options.leg2Kick,
                            pushed: true,
                        }
                    }
                    break;
            }
        });

        window.addEventListener('keyup', e => {
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
                    fighter?.spriteSheet?.outsideAnimationCall !== 'turn-leg' &&
                    !this.options.down &&
                    this.fighter?.dropAnimation();
                    break;
                case 'ArrowRight':
                    this.setOption('right', false);
                    !this.options.down && this.fighter?.dropAnimation();
                    break;
                case ' ':
                    this.setOption('block', false);
                    this.fighter?.dropAnimation();
                    break;
                case 'd':
                    this.options = {
                        ...this.options,
                        handKick: {
                            ...this.options.handKick,
                            pushed: false,
                            prevReleased: true
                        }
                    }
                    break;
                case 'e':
                    this.options = {
                        ...this.options,
                        hand2Kick: {
                            ...this.options.hand2Kick,
                            pushed: false,
                            prevReleased: true
                        }
                    }
                    break;
                case 's':
                    this.options = {
                        ...this.options,
                        legKick: {
                            ...this.options.legKick,
                            pushed: false,
                            prevReleased: true
                        }
                    }
                    break;
                case 'w':
                    this.options = {
                        ...this.options,
                        leg2Kick: {
                            ...this.options.leg2Kick,
                            pushed: false,
                            prevReleased: true
                        }
                    }
                    break;
            }
        });
    }
}
