import BlackFighterSprite from "../images/sprites/32/black.png";
import GreenFighterSprite from "../images/sprites/32/green.png";
import BlueFighterSprite from "../images/sprites/32/blue.png";
import RedFighterSprite from "../images/sprites/32/red.png";
import PurpleFighterSprite from "../images/sprites/32/purple.png";

export const spriteSheetFile = (spriteSheetName: string|null) => {
    switch (spriteSheetName){
        case 'red':
            return RedFighterSprite;
        case 'green':
            return GreenFighterSprite;
        case 'black':
            return BlackFighterSprite;
        case 'blue':
            return BlueFighterSprite;
        case 'purple':
            return PurpleFighterSprite;
        default:
            return PurpleFighterSprite;
    }
}
