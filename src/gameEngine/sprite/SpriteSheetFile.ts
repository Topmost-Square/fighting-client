import BasicFighterSprite from "../images/sprites/32/basic.png";

export const spriteSheetFile = (spriteSheetName: string|null) => {
    switch (spriteSheetName){
        case 'basis':
            return BasicFighterSprite;
        default:
            return BasicFighterSprite;
    }
}
