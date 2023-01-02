import BasicFighterSprite from '../images/sprites/32/basic.png';
import GreenFighterSprite from '../images/sprites/32/green.png';

export class SpriteSheet {
    image: HTMLImageElement|null = null;
    size = 400;
    context: CanvasRenderingContext2D|null = null;

    constructor(spriteSheetName: string|null = null, context: CanvasRenderingContext2D) {
        this.image = new Image();
        this.image.src = this.setSpriteSheetFile(spriteSheetName);
        this.context = context
    }

    setSpriteSheetFile(spriteSheetName: string|null) {
        switch (spriteSheetName){
            case 'basis':
                return BasicFighterSprite;
            case 'green':
                return GreenFighterSprite;
            default:
                return BasicFighterSprite;
        }
    }

    draw(x: number, y: number, height: number) {
        if (this.image) {
            const oneImageSize = 32;
            const xStart = 1;
            const yStart = 0;
            const clipWidth = 32;
            const clipHeight = 32;
            const placeImageX = x
            const placeImageY = y + height - this.size
            const widthImage = this.size;
            const heightImage = this.size;

            this.context!.imageSmoothingEnabled = false;

            this.context!.drawImage(
                this.image,
                xStart * oneImageSize,
                yStart * oneImageSize,
                clipWidth,
                clipHeight,
                placeImageX,
                placeImageY,
                widthImage,
                heightImage,
            );
        }
    }
}