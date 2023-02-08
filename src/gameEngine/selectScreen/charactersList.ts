import BasicFighterFace from "../images/faces/1.png";
import GreenFighterFace from "../images/faces/2.png";

import BasicFighterIdle from "../images/idle/1.png";
import GreenFighterIdle from "../images/idle/2.png";

export const charactersList = () => {
    return [
        { name: 'Purple', face: BasicFighterFace, idle: BasicFighterIdle },
        { name: 'Green', face: GreenFighterFace, idle: GreenFighterIdle }
    ];
}
