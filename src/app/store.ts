import { configureStore } from "@reduxjs/toolkit";
import ClueReducer from "../features/clue/cluesSlice"

export const store = configureStore({
    reducer: {
        clues: ClueReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch