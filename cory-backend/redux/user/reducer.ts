import { createReducer } from "@reduxjs/toolkit";
import { setUserId } from "./actions";

export type UserState = {
    id: number;
}

const initialState: UserState = {
    id: 0,
}

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setUserId, (state, action) => {
            state.id = action.payload;
        })
});

export default userReducer;