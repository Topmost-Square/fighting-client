import BlackFighterFace from "../images/faces/black.png";
import PurpleFighterFace from "../images/faces/purple.png";
import GreenFighterFace from "../images/faces/green.png";
import BlueFighterFace from "../images/faces/blue.png";
import RedFighterFace from "../images/faces/red.png";

import BlackFighterIdle from "../images/idle/black.png";
import BlueFighterIdle from "../images/idle/blue.png";
import GreenFighterIdle from "../images/idle/green.png";
import PurpleFighterIdle from "../images/idle/purple.png";
import RedFighterIdle from "../images/idle/red.png";

export const characters = ['purple', 'green', 'black', 'blue', 'red'];

export const charactersList = () => {
    return [
        { name: 'Purple', face: PurpleFighterFace, idle: PurpleFighterIdle },
        { name: 'Green', face: GreenFighterFace, idle: GreenFighterIdle },
        { name: 'Black', face: BlackFighterFace, idle: BlackFighterIdle },
        { name: 'Blue', face: BlueFighterFace, idle: BlueFighterIdle },
        { name: 'Red', face: RedFighterFace, idle: RedFighterIdle },
    ];
}
