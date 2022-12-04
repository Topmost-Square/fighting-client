import {Fighter} from "../fighters/Fighter";

export class Game {
    opponent1: Fighter;
    opponent2: Fighter;

    constructor(opponent1: Fighter, opponent2: Fighter) {
        this.opponent1 = opponent1;
        this.opponent2 = opponent2;
    }

    update() {

    }
}
