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
                    this.setOption('down', true);
                    break;
                case 'ArrowLeft':
                    this.setOption('left', true);
                    break;
                case 'ArrowRight':
                    this.setOption('right', true);
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
                case 's':
                    this.options = {
                        ...this.options,
                        legKick: {
                            ...this.options.legKick,
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
                    break;
                case 'ArrowLeft':
                    this.setOption('left', false);
                    this.fighter?.dropAnimation();
                    break;
                case 'ArrowRight':
                    this.setOption('right', false);
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
            }
        });
    }
}
