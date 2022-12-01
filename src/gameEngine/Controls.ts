export class Controls {
    up = false;
    down = false;
    left = false;
    right = false;

    constructor() {
        window.addEventListener('keydown', e => {
            console.log(e.key, 'event')

            switch (e.key) {
                case 'ArrowUp':
                    this.up = true;
                    break;
                case 'ArrowDown':
                    this.down = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
            }
        });

        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowUp':
                    this.up = false;
                    break;
                case 'ArrowDown':
                    this.down = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
            }
        });
    }
}