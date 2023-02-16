import { configureStore } from "@reduxjs/toolkit";
import userReducer from './redux/userSlice'
import fightReducer from './redux/fightSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        fight: fightReducer
    }
});
