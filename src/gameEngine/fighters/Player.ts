import {Fighter} from "./Fighter";

export class Player extends Fighter {
    update() {

        // console.log(this.kicked)
        if (this.controls!.fightStarted && !this.isDown && !this.kicked) {
            this.upControlAction();
            this.downControlAction();

            //todo: for these add check so that player can't move if there's an enemy
            this.leftControlAction();
            this.rightControlAction();

            this.handKickControlAction();
            this.hand2KickControlAction();
            this.legKickControlAction();
            this.legKick2ControlAction();

            this.blockControlAction();

            this.inAirAction();
        }

    }
}
