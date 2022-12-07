import {Game} from "./Game";
import {Player} from "../fighters/Player";
import {AIFighter} from "../fighters/AIFighter";

export class PracticeGame extends Game {
    constructor(player: Player, ai: AIFighter) {
        super(player, ai);
    }

    update() {
        this.defineOrientation();
    }
}
