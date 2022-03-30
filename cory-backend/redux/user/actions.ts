import { createAction } from "@reduxjs/toolkit";
import { User } from "../../models/user";

export const setUserId = createAction<number>('users/setUserId');
export const setUserName = createAction<string>('users/setUserName');
export const setUserEmail = createAction<string>('users/setUserEmail');