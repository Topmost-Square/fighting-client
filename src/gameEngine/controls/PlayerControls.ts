import {BaseControls} from "./BaseControls";

export class PlayerControls extends BaseControls {

    generalCheck() {
        return this.fightStarted && !this.fighter!.isDown && !this.fighter!.kicked;
    }

    constructor() {
        super();
        window.addEventListener('keydown', e => {
             switch (e.key) {
                    case 'ArrowUp':
                        this.generalCheck() && this.setOption('up', true);
                        break;
                    case 'ArrowDown':
                        this.generalCheck() && !this.options.hand2Kick.pushed && this.setOption('down', true);
                        break;
                    case 'ArrowLeft':
                        if (this.generalCheck()) {
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
                        }
                        break;
                    case 'ArrowRight':
                        if (this.generalCheck()) {
                            this.setOption('right', true);
                            if (!this.options.down && !this.fighter?.isInTheAir()) {
                                if (this.fighter?.side === 'left') {
                                    this.fighter?.callAnimation('walk');
                                } else {
                                    this.fighter?.callAnimation('r-walk-back');
                                }
                            }
                        }
                        break;
                    case ' ':
                        this.generalCheck() && this.setOption('block', true);
                        break;
                    case 'd':
                        if (this.generalCheck()) {
                            this.options = {
                                ...this.options,
                                handKick: {
                                    ...this.options.handKick,
                                    pushed: true,
                                }
                            }
                        }
                        break;
                    case 'e':
                        if (this.generalCheck()) {
                            this.options = {
                                ...this.options,
                                hand2Kick: {
                                    ...this.options.hand2Kick,
                                    pushed: true,
                                }
                            }
                        }
                        break;
                    case 's':
                        if (this.generalCheck()) {
                            this.options = {
                                ...this.options,
                                legKick: {
                                    ...this.options.legKick,
                                    pushed: true,
                                }
                            }
                        }
                        break;
                    case 'w':
                        if (this.generalCheck()) {
                            this.options = {
                                ...this.options,
                                leg2Kick: {
                                    ...this.options.leg2Kick,
                                    pushed: true,
                                }
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

    behave() {}
}
