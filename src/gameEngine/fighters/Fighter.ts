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

    kicked: boolean = false;

    position: Position  = {
        x: null,
        y: null
    };

    health: number = 100;

    isDown: boolean = false;

    enemy: Fighter|null = null;

    side: null|string = null;

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;

    // todo: these values should depend on screen size
    width = 150;
    height = 400;

    verticalAcceleration = 0;
    horizontalAcceleration = 0;
    gravity = 20;
    speed = 5;
    airSpeed = 10;

    spriteSheet: SpriteSheet|null = null;

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

    setControls(controls: BaseControls) {
        this.controls = controls;
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    setSpriteSheet(spriteSheet: string|null) {
        this.spriteSheet = new SpriteSheet(spriteSheet, this.context, this)
    }

    setCanvas(canvas: HTMLCanvasElement|null) {
        this.canvas = canvas;
    }

    setInitialX(x: number) {
        this.position.x = x;
    }

    setInitialY(y: number) {
        this.position.y = y;
    }

    setEnemy(enemy: Fighter) {
        this.enemy = enemy;
    }

    checkHandKickPushed(kick: string) {
        const handKickPushed = kick === 'hand' ? this.controls?.options.handKick.pushed :
            this.controls?.options.hand2Kick.pushed;

        const handKickReleased = kick === 'hand' ? this.controls?.options.handKick.prevReleased :
            this.controls?.options.hand2Kick.prevReleased;

        return handKickPushed &&
            handKickReleased &&
            !this.isInTheAir() &&
            this.spriteSheet?.outsideAnimationCall !== kick
    }

    checkLegKickPushed(kick: string) {
        const legKickPushed = kick === 'leg' ? this.controls?.options.legKick.pushed :
            this.controls?.options.leg2Kick.pushed;

        const legKickReleased = kick === 'leg' ? this.controls?.options.legKick.prevReleased :
            this.controls?.options.leg2Kick.prevReleased;

        return legKickPushed &&
            legKickReleased &&
            !this.isInTheAir() &&
            this.spriteSheet?.outsideAnimationCall !== kick &&
            this.spriteSheet?.outsideAnimationCall !== 'turn-leg' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-turn-leg'
    }

    calculateKickToDrop(kick: string) {
        if (kick === 'hand') {
            return 'handKick';
        }

        if (kick === 'hand-2') {
            return 'hand2Kick';
        }

        if (kick === 'leg') {
            return 'legKick';
        }

        if (kick === 'leg-2') {
            return 'leg2Kick';
        }

        return 'handKick';
    }

    performBasicKick(kick: string) {
        if (this.shouldCommitDamage(kick) && !this.enemy?.isDown) {
            const calculatedDamage = this.calculateDamage(kick)
            this.enemy?.getDamage(
                calculatedDamage.value,
                calculatedDamage.area
            );
        }

        this.spriteSheet?.callAnimation(this.calculateKickAnimation(kick));

        this.calculateAndToggleKickMask(kick, true);

        const kickToDrop = this.calculateKickToDrop(kick);

        this.controls?.dropReleaseFlag(kickToDrop);

        this.calculateAndToggleKickMask(kick, false);
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

    performTurnKick(kickAnimation: string) {
        this.spriteSheet?.dropAnimation();
        this.spriteSheet?.callAnimation(kickAnimation);
        if (this.closeForDamage('leg') && !this.enemy?.isDown) {
            this.enemy?.getDamage(7, 'head', true, 30, 50);
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
            this.performTurnKick(sideControlAnimations.kick);
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

    getDamageAnimation(area: string) {
        if (area === 'head') {
            return this.side === 'left' ? 'face-kicked' : 'r-face-kicked';
        }

        if (area === 'torso') {
            return this.side === 'left' ? 'torso-kicked' : 'r-torso-kicked';
        }

        return this.side === 'left' ? 'face-kicked' : 'r-face-kicked';
    }

    setKicked() {
        this.kicked = true;
    }

    setNotKicked() {
        this.kicked = false;
    }

    /**
     *  getDamage
     *
     * @param damage - value to take from fighters health
     * @param area - place fighter was kicked (head, torso)
     * @param shouldFall - should player fall after kick
     * @param up - how enemy should fly up %
     * @param side - how enemy should fly to the side %
     */
    getDamage(
        damage: number,
        area: string,
        shouldFall: boolean = false,
        up: number = 0,
        side: number = 0
    ) {
        this.health -= damage;

        if (!shouldFall) {
            this.callAnimation(this.getDamageAnimation(area));
            setTimeout(() => {
                this.dropAnimation();
            }, 500);
        }

        if (shouldFall) {
            this.setKicked();
            this.setFighterDown();
            this.dropAnimation();
            this.callAnimation(this.side === 'left' ? 'fall' : 'r-fall');
        }

        if (up) {
            this.verticalAcceleration = up;
        }

        if (side) {
            this.horizontalAcceleration = this.side === 'left' ? side : -side;
        }
    }

    setFighterDown() {
        if (!this.isDown) {
            this.isDown = true;
        }
    }

    setFighterUp() {
        if (this.isDown) {
            this.isDown = false;
        }
    }

    closeForDamage(kickType: string) {
        const kickMaskWidth = kickType === 'hand' ?
            this.handKickMask.width :
            this.legKickMask.width;

        return (
                this.side === 'left' &&
                this.enemy?.position.x! <=
                this.position.x! + this.width + kickMaskWidth
            ) || (
                this.side === 'right' &&
                this.enemy?.position.x! + this.enemy?.width! >=
                this.position.x! - kickMaskWidth
            );
    }

    performUpperCut() {
        this.spriteSheet?.callAnimation(this.side === 'left' ? 'uppercut' : 'r-uppercut');

        if (this.closeForDamage('hand') && !this.enemy?.isDown && !this.enemy?.controls?.options.down) {
            this.enemy?.getDamage(5, 'head', true, 50, 30);
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
            return { value: 1, area: 'head' };

        if (kick === 'hand-2')
            return { value: 2, area: 'head' };

        if (kick === 'leg')
            return { value: 4, area: 'head' };

        if (kick === 'leg-2')
            return { value: 3, area: 'torso' };

        return { value: 0, area: '' };
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

        if (
            this.verticalAcceleration === 0 &&
            this.kicked &&
            this.spriteSheet?.outsideAnimationCall !== 'stand-up' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-stand-up' &&
            this.spriteSheet?.outsideAnimationCall !== 'fall' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-fall'
        ) {
            this.setNotKicked();
        }

        if (
            this.verticalAcceleration === 0 &&
            this.kicked &&
            this.spriteSheet?.outsideAnimationCall !== 'stand-up' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-stand-up' &&
            this.spriteSheet?.outsideAnimationCall !== 'fall' &&
            this.spriteSheet?.outsideAnimationCall !== 'r-fall'
        ) {
            this.setNotKicked();
        }
    }

    useHorizontalAcceleration() {
        if (this.horizontalAcceleration < 0) {
            this.horizontalAcceleration++;
            this.moveRight();
        }

        if (this.horizontalAcceleration > 0) {
            this.horizontalAcceleration--;
            this.moveLeft();
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

    callAnimation(animation: string) {
        this.spriteSheet?.callAnimation(animation);
    }

    dropAnimation() {
        this.spriteSheet?.dropAnimation();
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
        this.useHorizontalAcceleration();

        const posX = this.side === 'left' ? this.position.x! - 50 : this.position.x! - 200

        if (this.spriteSheet) {
            this.spriteSheet.draw(posX, this.position.y!, this.height);
        }
    }
}
