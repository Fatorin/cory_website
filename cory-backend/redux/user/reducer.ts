import { createReducer } from "@reduxjs/toolkit";
import { User } from "../../models/user";
import { setUserEmail, setUserId, setUserName } from "./actions";

export type UserState = {
    id: number;
    username: string;
    email: string;
}

const initialState: UserState = {
    id: 0,
    username: "",
    email: "",
}

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setUserId, (state, action) => {
            state.id = action.payload;
        })
        .addCase(setUserName, (state, action) => {
            state.username = action.payload;
        })
        .addCase(setUserEmail, (state, action) => {
            state.email = action.payload;
        })
});

export default userReducer;