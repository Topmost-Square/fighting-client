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
        {
            name: 'SKAR',
            face: PurpleFighterFace,
            idle: PurpleFighterIdle,
            story: [
                "One of the few  humans that",
                "survived the  great  element",
                "revolt. He seems to be weak",
                "to fight  against all the",
                "power of nature that rebelled",
                "against humans, being no more",
                "subject to them. Yet he has no",
                "choice since  he's the only",
                "chance  of mankind  to  survive."
            ]
        }, // purple
        {
            name: 'REVEN',
            face: GreenFighterFace,
            idle: GreenFighterIdle,
            story: [
                "The most poisonous being that",
                "ever  walked  on  the  earth.",
                "Mindless mutant that kills",
                "everyone it sees. Uncontrolled",
                "even by those who created it"


            ]
        }, //green
        {
            name: 'TENEMOR NIL',
            face: BlackFighterFace,
            idle: BlackFighterIdle,
            story: [
                "Rotten  soil that  was revived.",
                "Darkest matter  with  all  the",
                "power to devour life. Greatest",
                "wish is  to  put  the  mankind",
                "inside  the  eternal  dark"
            ]
        }, //black
        {
            name: 'NUBIS FRIG',
            face: BlueFighterFace,
            idle: BlueFighterIdle,
            story: [
                "Anomaly  of  heaven. Should",
                "be  the  messiah  waited by",
                "the others, but  turned out",
                "to be the cruelest assassin",
                "with  the coldest  mind and",
                "intentions"
            ]
        }, //blue
        {
            name: 'IGNIS FLAM',
            face: RedFighterFace,
            idle: RedFighterIdle,
            story: [
                "The scars on his face is",
                "the flame that tried to",
                "burn him from the inside.",
                "But he managed to tame that",
                "curse infected his blood,",
                "made it burn. Now this power",
                "obeys his command. Who knows,",
                "maybe he could burn everything..."
            ]
        }, //red
    ];
}
