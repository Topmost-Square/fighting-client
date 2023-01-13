import {BaseControls} from "../controls/BaseControls";
import {SpriteSheet} from "../sprite/SpriteSheet";

export type Position = { x: number|null, y: number|null };
type KickMask = {
    x: number|null,
    y: number|null,
    width: number,
    height: number,
    show: boolean
};

export class Fighter {
    controls: BaseControls|null = null;

    position: Position  = {
        x: null,
        y: null
    };

    health: number = 100;

    enemy: Fighter|null = null;

    side: null|string = null;

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;

    // todo: these values should depend on screen size
    width = 150;
    height = 400;

    verticalAcceleration = 0;
    gravity = 20;
    speed = 5;
    airSpeed = 10;

    spriteSheet: SpriteSheet|null = null;

    // temp. for debugging
    pointer: KickMask = {
        x: null,
        y: null,
        width: 50,
        height: 50,
        show: true
    }

    handKickMask: KickMask = {
        show: false,
        x: null,
        y: null,
        width: 150,
        height: 50
    }

    legKickMask: KickMask = {
        show: false,
        x: null,
        y: null,
        width: 250,
        height: 70
    }

    constructor(
        x: number,
        y: number,
        canvas: HTMLCanvasElement|null,
        context: CanvasRenderingContext2D,
        spriteSheet: string|null = null
    ) {
        this.position.x = x;
        this.position.y = y;

        if (spriteSheet) {
            this.spriteSheet = new SpriteSheet(spriteSheet, context, this)
        }

        this.canvas = canvas;
        this.context = context;
    }

    setEnemy(enemy: Fighter) {
        this.enemy = enemy;
    }

    upControlAction() {
        if (this.controls?.options.up && this.verticalAcceleration === 0 && !this.isInTheAir()) {
            this.verticalAcceleration = 50;
        }
    }

    sideControlAnimations(control: string) {
        if (control === 'left')
            return {
                kick: 'turn-leg',
                walk: 'walk-back'
            }
        else
            return {
                kick: 'r-turn-leg',
                walk: 'r-walk-back'
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

    callMove(control: string) {
        if (control === 'left') {
            this.moveLeft();
        } else {
            this.moveRight();
        }
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

    sideControlAction(control: string) {
        if (this.controls?.options.down) {
            return;
        }

        const sideControlAnimations =  this.sideControlAnimations(control);

        if (
            this.controls?.options.leg2Kick.pushed &&
            this.spriteSheet?.outsideAnimationCall !== sideControlAnimations.kick
        ) {
            this.spriteSheet?.dropAnimation();
            this.spriteSheet?.callAnimation(sideControlAnimations.kick);
            if (this.closeForDamage('leg')) {
                this.enemy?.getDamage(7, 'face', true);
            }
        } else if (this.spriteSheet?.outsideAnimationCall !== sideControlAnimations.kick) {
            if (
                !this.spriteSheet?.outsideAnimationCall ||
                this?.spriteSheet?.outsideAnimationCall !== sideControlAnimations.walk
            ) {
                this.spriteSheet?.callAnimation(sideControlAnimations.walk);
            }
            this.callMove(control)
        }
    }

    /**
     * getDamage
     *
     * @param damage - value to take from fighters health
     * @param area - place fighter was kicked (head, torso)
     * @param shouldFall - should player fall after kick
     */
    getDamage(damage: number, area: string, shouldFall: boolean) {
        this.health -= damage;
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

    performUpperCut() {
        if (this.side === 'left') {
            this.spriteSheet?.callAnimation('uppercut');
        } else {
            this.spriteSheet?.callAnimation('r-uppercut');
        }

        if (this.closeForDamage('hand')) {
            this.enemy?.getDamage(5, 'face', true);
        }
    }


    shouldCommitDamage(kick: string) {
        if (kick === 'hand' || kick === 'hand-2')
            return this.closeForDamage('hand');

        if (kick === 'leg' || kick === 'leg-2')
            return this.closeForDamage('leg');
    }

    calculateDamage(kick: string) {
        if (kick === 'hand')
            return { value: 1, area: 'head', shouldFall: false };

        if (kick === 'hand-2')
            // todo: condition enemy will fall
            return { value: 2, area: 'head', shouldFall: false };

        if (kick === 'leg')
            // todo: condition enemy will fall
            return { value: 4, area: 'head', shouldFall: false };

        if (kick === 'leg-2')
            return { value: 3, area: 'torso', shouldFall: false };

        return { value: 0, area: '', shouldFall: false };
    }

    calculateKickAnimation(kick: string) {
        if (this.side === 'left') {
            if (kick === 'hand')
                return 'hand';

            if (kick === 'hand-2')
                return 'hand-2';

            if (kick === 'leg')
                return 'leg';

            if (kick === 'leg-2')
                return 'leg-2';
        }

        if (this.side === 'right') {
            if (kick === 'hand')
                return 'r-hand';

            if (kick === 'hand-2')
                return 'r-hand-2';

            if (kick === 'leg')
                return 'r-leg';

            if (kick === 'leg-2')
                return 'r-leg-2';
        }

        return '';
    }

    calculateAndToggleKickMask(kick: string, show: boolean) {
        if (kick === 'hand' || kick === 'hand-2') {
            this.handKickMask.show = show;
        }

        if (kick === 'leg' || kick === 'leg-2') {
            this.legKickMask.show = show;
        }
    }

    calculatePointer() {
        this.pointer.y = this.position.y! + 100;

        if (this.side === 'left') {
            this.pointer.x = this.position.x! + this.width
        }

        if (this.side === 'right') {
            this.pointer.x = this.position.x! - this.pointer.width
        }
    }

    drawPointer() {
        this.context!.fillStyle = "brown";

        this.context!.fillRect(
            this.pointer.x!,
            this.pointer.y!,
            this.pointer.width,
            this.pointer.height
        );
    }

    drawKickMasks() {
        this.handKickMask.y = this.position.y! + this.height / 4;
        this.legKickMask.y = this.position.y! + this.height / 2;

        if (this.side === 'left') {
            this.handKickMask.x = this.position.x! + this.width;
            this.legKickMask.x = this.position.x! + this.width;
        }

        if (this.side === 'right') {
            this.handKickMask.x = this.position.x! - this.handKickMask.width;
            this.legKickMask.x = this.position.x! - this.legKickMask.width;
        }
    }

    useGravity() {
        if (this.position.y! < (this.canvas!.height - 500)) {
            this.position.y! += this.gravity;
        }

        if (this.verticalAcceleration > 0) {
            this.position.y! -= this.verticalAcceleration;
            this.verticalAcceleration--;
        }

        if (this.verticalAcceleration === 1) {
            this.verticalAcceleration = 0;
        }
    }

    setSide(side: string) {
        this.side = side;
    }

    goLeft() {
        if (this.isInTheAir()) {
            this.position.x! -= this.airSpeed;
        } else {
            this.position.x! -= this.speed;
        }
    }

    goRight() {
        if (this.isInTheAir()) {
            this.position.x! += this.airSpeed;
        } else {
            this.position.x! += this.speed;
        }
    }

    isInTheAir() {
        return !(this.position.y! >= (this.canvas!.height - 500))
    }

    showLegKick() {
        this.legKickMask.show = true;
    }

    hideLegKick() {
        this.legKickMask.show = false;
    }

    showHandKick() {
        this.handKickMask.show = true;
    }

    hideHandKick() {
        this.handKickMask.show = false;
    }

    draw() {
        this.useGravity();

        this.calculatePointer();
        this.drawPointer();

        // draw fighter
        this.context!.fillStyle = "black";

        this.context!.fillRect(
            this.position.x!,
            this.position.y!,
            this.width,
            this.height
        );

        this.drawKickMasks();

        // draw hand kick
        this.context!.fillStyle = "red";

        if (this.handKickMask.show) {
            this.context?.fillRect(
                this.handKickMask.x!,
                this.handKickMask.y!,
                this.handKickMask.width,
                this.handKickMask.height
            )
        }

        // draw leg kick
        this.context!.fillStyle = "green";

        if (this.legKickMask.show) {
            this.context?.fillRect(
                this.legKickMask.x!,
                this.legKickMask.y!,
                this.legKickMask.width,
                this.legKickMask.height
            )
        }

        const posX = this.side === 'left' ? this.position.x! - 50 : this.position.x! - 200

        if (this.spriteSheet) {
            this.spriteSheet.draw(posX, this.position.y!, this.height);
        }
    }
}
