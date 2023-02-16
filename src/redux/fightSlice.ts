import { createSlice } from "@reduxjs/toolkit";

export interface DamageWrapper {
    damageInflicted: Damage,
    damageReceived: Damage,
}

export interface Damage {
    hand1: number,
    hand2: number,
    leg1: number,
    leg2: number,
    turnLeg: number,
    uppercut: number,
}

export interface Opponents {
    player: string,
    enemy: string,
}

export interface FightState {
    opponents: Opponents,
    damage: DamageWrapper,
    winner: string
}

const initialState: FightState = {
    opponents: {
        player: '',
        enemy: '',
    },
    damage: {
        damageInflicted: {
            hand1: 0,
            hand2: 0,
            leg1: 0,
            leg2: 0,
            turnLeg: 0,
            uppercut: 0,
        },
        damageReceived: {
            hand1: 0,
            hand2: 0,
            leg1: 0,
            leg2: 0,
            turnLeg: 0,
            uppercut: 0,
        },
    },
    winner: ''
}

const updateKickInfo =
    (state: FightState, type: keyof DamageWrapper, kick: keyof Damage) =>
        state.damage[type][kick]++;

const setOpponent =
    (state: FightState, type: keyof Opponents, character: string) =>
        state.opponents[type] = character;

export const fightSlice = createSlice({
    name: 'fight',
    initialState,
    reducers: {
        clearState: state => state = initialState,
        setCharacter: (state, action) => {
            const { type, character } = action.payload;
            setOpponent(state, type, character);
        },
        updateKick: (state, action) => {
            const { type, kick } = action.payload;
            updateKickInfo(state, type, kick);
        },
        setWinner: (state, action) => {
            state.winner = action.payload
            localStorage.setItem('fight', JSON.stringify(state))
        }
    }
});

export const { clearState, setCharacter, updateKick, setWinner } = fightSlice.actions

export default fightSlice.reducer;
