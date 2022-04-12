import { createAction } from "@reduxjs/toolkit";

export const setUserId = createAction<number>('users/setUserId');