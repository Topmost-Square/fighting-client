import BasicFighterSprite from "../images/sprites/32/basic.png";
import GreenFighterSprite from "../images/sprites/32/green.png";

export const spriteSheetFile = (spriteSheetName: string|null) => {
    switch (spriteSheetName){
        case 'basis':
            return BasicFighterSprite;
        case 'green':
            return GreenFighterSprite;
        default:
            return BasicFighterSprite;
    }
}
