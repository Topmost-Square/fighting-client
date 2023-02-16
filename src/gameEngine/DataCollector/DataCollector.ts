import {Dispatch} from "redux";
import {
    ActionCreatorWithoutPayload,
    ActionCreatorWithPayload
} from "@reduxjs/toolkit";

type Actions = {
    clearState: ActionCreatorWithoutPayload,
    setCharacter: ActionCreatorWithPayload<SetCharacterPayload>,
    updateKick: ActionCreatorWithPayload<UpdateKickPayload>,
    setWinner: ActionCreatorWithPayload<string>,
};

type UpdateKickPayload = {
    type: string,
    kick: string
}

type SetCharacterPayload = {
    type: string,
    character: string
}

export class DataCollector {
    dispatch: Dispatch|null = null;

    actions: Actions|null = null;

    setDispatch(dispatch: Dispatch) {
        this.dispatch = dispatch
    }

    setActions(actions: Actions) {
        this.actions = actions;
    }

    clearState() {
        this.dispatch!(this.actions?.clearState()!);
    }

    setCharacter(payload: SetCharacterPayload) {
        this.dispatch!(this.actions?.setCharacter(payload)!);
    }

    updateKick(payload: UpdateKickPayload) {
        this.dispatch!(this.actions?.updateKick(payload)!);
    }

    setWinner(winner: string) {
        this.dispatch!(this.actions?.setWinner(winner)!);
    }
}